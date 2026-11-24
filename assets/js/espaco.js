/* =========================================================
   ESPAÇO PÚBLICO - ACCESSMAP
   -----------------------------------------------------------
   O AccessMap pode atender qualquer espaço público (campus,
   prefeitura, parque...). Tudo o que é próprio do lugar — plantas,
   áreas com cores e ícones, ordem dos destaques e textos da
   interface — fica no pacote espacos/<slug>/espaco.json.

   Este script carrega essa configuração (da API, ou do arquivo
   estático se o servidor estiver fora do ar) e expõe:
       AccessMapEspaco.pronto   Promise com a configuração
       AccessMapEspaco.config   a configuração, depois de carregada

   Textos das páginas: elementos com estes atributos recebem o
   texto do espaço (o HTML já traz o texto do espaço padrão):
       data-espaco-texto="Mapa {do} {Tipo}"   -> conteúdo do elemento
       data-espaco-placeholder="{exemploLocal}" -> placeholder
       data-espaco-aria="..."                 -> aria-label
       data-espaco-titulo="..."               -> title
       data-espaco-src="{mapaLocalizacao}"    -> src
   Variáveis: {nome}, {cidade}, {tipo}, {Tipo}, {do}, {no}, {um}
   (artigos conforme o gênero do tipo: "do campus", "da prefeitura")
   e as chaves de "textos" do espaco.json.

   Depende de api.js (carregado antes).
   ========================================================= */
(function () {
    "use strict";

    // Textos usados quando o espaco.json não define a chave
    function textosPadrao(config) {
        return {
            localizacao: config.cidade ? `${config.nome} - ${config.cidade}` : config.nome,
            exemploLocal: "Ex: Entrada principal, Banheiro, Rampa...",
            exemploFiltroLocal: "Ex: Entrada, Banheiro...",
            exemploNomeLocal: "Ex: Recepção",
            exemploAltPlanta: `Ex: Planta atualizada ${artigos(config).do} ${config.tipo}`,
            tituloMapaLocalizacao: `Mapa de localização: ${config.nome}`
        };
    }

    // Tipos de lugar femininos mais comuns; outros podem usar "genero": "f" no espaco.json
    const TIPOS_FEMININOS = ["prefeitura", "escola", "universidade", "faculdade", "praça", "praca",
        "biblioteca", "unidade", "secretaria", "câmara", "camara", "estação", "estacao", "rodoviária",
        "rodoviaria", "igreja", "instituição", "instituicao", "feira", "arena", "sede"];

    function artigos(config) {
        const tipo = String(config.tipo || "").toLowerCase();
        const feminino = config.genero ? config.genero === "f" : TIPOS_FEMININOS.includes(tipo);
        return feminino ? { do: "da", no: "na", um: "uma" } : { do: "do", no: "no", um: "um" };
    }

    function capitalizar(txt) {
        return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : txt;
    }

    // Caminhos de imagem: "assets/...", "/..." e URLs completas ficam como estão;
    // os demais são relativos à pasta do pacote (ex.: "plantas/terreo.svg")
    function caminhoDoPacote(config, caminho) {
        if (!caminho || /^(https?:|data:|\/|assets\/|espacos\/)/.test(caminho)) return caminho;
        return `espacos/${encodeURIComponent(config.slug)}/${caminho}`;
    }

    // Garante os campos que o resto do front-end usa, venha da API ou do arquivo
    function normalizar(config) {
        config.tipo = config.tipo || "local";
        config.plantas = Array.isArray(config.plantas) ? config.plantas : [];
        config.areas = Array.isArray(config.areas) ? config.areas : [];
        config.destaques = Array.isArray(config.destaques) ? config.destaques : [];
        if (!config.plantas.some(p => p.principal) && config.plantas[0]) config.plantas[0].principal = true;
        config.plantas.forEach(p => {
            p.rotuloCurto = p.rotuloCurto || p.nome;
            p.descricao = p.descricao || p.nome;
            p.imagem = caminhoDoPacote(config, p.imagem);
            p.hd = caminhoDoPacote(config, p.hd);
        });
        config.textos = Object.assign(textosPadrao(config), config.textos || {});
        // Sem mapa de localização próprio: busca o lugar pelo nome no Google Maps
        if (!config.mapaLocalizacao) {
            const consulta = [config.nome, config.cidade].filter(Boolean).join(", ");
            config.mapaLocalizacao = `https://www.google.com/maps?q=${encodeURIComponent(consulta)}&output=embed`;
        }
        return config;
    }

    function variaveis(config) {
        return Object.assign({
            nome: config.nome,
            cidade: config.cidade || "",
            tipo: config.tipo,
            Tipo: capitalizar(config.tipo),
            mapaLocalizacao: config.mapaLocalizacao
        }, artigos(config), config.textos);
    }

    // Troca {chave} pelos valores; se faltar alguma, devolve null (mantém o texto do HTML)
    function preencher(modelo, vars) {
        let faltou = false;
        const texto = modelo.replace(/\{(\w+)\}/g, (_, chave) => {
            const valor = vars[chave];
            if (valor === undefined || valor === null || valor === "") {
                faltou = true;
                return "";
            }
            return valor;
        });
        return faltou ? null : texto;
    }

    function aplicarTextos(config) {
        const vars = variaveis(config);
        const regras = [
            ["data-espaco-texto", (el, v) => { el.textContent = v; }],
            ["data-espaco-placeholder", (el, v) => el.setAttribute("placeholder", v)],
            ["data-espaco-aria", (el, v) => el.setAttribute("aria-label", v)],
            ["data-espaco-titulo", (el, v) => el.setAttribute("title", v)],
            ["data-espaco-src", (el, v) => { if (el.getAttribute("src") !== v) el.setAttribute("src", v); }]
        ];
        regras.forEach(([atributo, aplicar]) => {
            document.querySelectorAll(`[${atributo}]`).forEach(el => {
                const valor = preencher(el.getAttribute(atributo), vars);
                if (valor !== null) aplicar(el, valor);
            });
        });
    }

    async function lerJson(url) {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`${url}: ${resposta.status}`);
        return resposta.json();
    }

    // Servidor fora do ar (ou site estático, ex.: GitHub Pages): lê o pacote direto
    async function carregarEstatico(slug) {
        let alvo = slug;
        if (!alvo) alvo = (await lerJson("espacos/index.json")).padrao;
        const config = await lerJson(`espacos/${encodeURIComponent(alvo)}/espaco.json`);
        config.slug = alvo;   // o slug é o nome da pasta
        return config;
    }

    async function carregar() {
        const pedido = AccessMapApi.espacoAtual();
        try {
            return await AccessMapApi.obterEspaco(pedido);
        } catch (erro) {
            // Espaço lembrado que não existe mais no servidor: volta para o padrão
            if (pedido && erro.status === 404) {
                try {
                    const padrao = await AccessMapApi.obterEspaco(null);
                    AccessMapApi.definirEspaco(null);
                    return padrao;
                } catch (_) { /* servidor sem API: segue para o arquivo estático */ }
            }
            // Servidor fora do ar ou site estático (ex.: GitHub Pages, onde /api não existe)
            console.warn("AccessMap: API indisponível, usando o pacote do espaço em espacos/.", erro);
            try {
                return await carregarEstatico(pedido);
            } catch (e) {
                if (!pedido) throw erro;
                const padrao = await carregarEstatico(null).catch(() => { throw erro; });
                AccessMapApi.definirEspaco(null);
                return padrao;
            }
        }
    }

    const api = {
        config: null,
        pronto: null,
        artigos: () => artigos(api.config),
        aplicarTextos: () => api.config && aplicarTextos(api.config)
    };

    // Uma falha passageira de rede não deve deixar a página sem mapa: tenta de novo
    async function carregarComNovaTentativa(tentativas = 3) {
        for (let i = 1; ; i++) {
            try {
                return await carregar();
            } catch (erro) {
                if (i >= tentativas) throw erro;
                await new Promise(r => setTimeout(r, 800 * i));
            }
        }
    }

    api.pronto = carregarComNovaTentativa().then((config) => {
        api.config = normalizar(config);
        const aplicar = () => aplicarTextos(api.config);
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", aplicar);
        else aplicar();
        return api.config;
    });
    api.pronto.catch((erro) => console.error("AccessMap: não foi possível carregar a configuração do espaço.", erro));

    window.AccessMapEspaco = api;
})();
