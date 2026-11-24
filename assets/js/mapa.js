/* =========================================================
   PLANTAS DO ESPAÇO
   -----------------------------------------------------------
   Vêm da configuração do espaço (espacos/<slug>/espaco.json, ver
   espaco.js) e são preenchidas em prepararEspaco(), indexadas pelo
   código da planta. Campos de cada planta:
     largura/altura = área de coordenadas (os pontos de `lugares` usam
       essas coordenadas — não altere, senão os pontos saem do lugar);
     url = imagem base (2 px por coordenada); hd = pasta com os pedaços
       em alta resolução, gerados por scripts/gerar-plantas-hd.sh;
     proporcaoArte = proporção do desenho original, que é esticado para
       caber na área de coordenadas; uma imagem nova deve ter a mesma.
   ========================================================= */
const plantas = {};
let PLANTA_PRINCIPAL = null;     // código da planta principal (ex.: o mapa geral)
let NOMES_ALAS = {};             // código -> nome exibido ("Mapa Geral")
let ORDEM_PRINCIPAIS = [];       // locais que aparecem primeiro na lista lateral
let PREFIXOS_NOME = null;        // "Bloco A - ", "Subsolo B - "... omitidos no nome curto

// Precisa bater com as variáveis de scripts/gerar-plantas-hd.sh
const PLANTA_HD = {
    colunas: 6,
    linhas: 4,
    escalaBase: 2,     // px por coordenada da imagem base
    sobreposicao: 1    // coordenadas que cada pedaço avança sobre o vizinho
};

/* =========================================================
   LOCAIS DO MAPA
   -----------------------------------------------------------
   Vêm do banco de dados (GET /api/pontos), onde o admin insere,
   edita e exclui locais. Cada local tem: id, nome, tipo (geral,
   fisica, auditiva ou alerta), categoria, planta (código da planta
   em que aparece), bloco_pai, subponto e as coordenadas x/y.
   Se o servidor estiver fora do ar, o mapa público mostra a lista
   original do espaço (espacos/<slug>/locais.json), a mesma usada
   para popular o banco na primeira execução.
   ========================================================= */
const lugares = [];
let lugaresDoServidor = false;   // false = servidor fora do ar (lista original, só leitura)

function urlLocaisOriginais() {
    return `espacos/${encodeURIComponent(AccessMapEspaco.config.slug)}/locais.json`;
}

async function carregarLugares() {
    let lista = null;
    try {
        lista = await AccessMapApi.listarPontos();
        lugaresDoServidor = true;
    } catch (erro) {
        console.warn("AccessMap: servidor indisponível, usando a lista original de locais.", erro);
        try {
            const resposta = await fetch(urlLocaisOriginais());
            if (resposta.ok) lista = await resposta.json();
        } catch (_) { /* sem locais */ }
    }
    lugares.splice(0, lugares.length, ...(Array.isArray(lista) ? lista : []));
}

/* =========================================================
   ESTADO DO MAPA
   ========================================================= */
let mapa;
let camadaImagem = null;
let pedacosHD = [];      // [{ limites, camada, url }] da planta aberta
let filtroAtual = null;
let alaAtual = null;             // código da planta aberta
let primeiraInicializacao = true;

/**
 * Lê a configuração do espaço (espaco.js) e monta as plantas, os nomes
 * das alas, a ordem dos destaques e os botões "Mapa exibido".
 */
function prepararEspaco(config) {
    Object.keys(plantas).forEach(k => delete plantas[k]);
    NOMES_ALAS = {};
    config.plantas.forEach(p => {
        plantas[p.codigo] = {
            codigo: p.codigo,
            nome: p.nome,
            rotuloCurto: p.rotuloCurto,
            descricao: p.descricao,
            principal: !!p.principal,
            andar: p.andar || null,        // ex.: "subsolo", mostrado ao lado dos locais
            bloco: p.bloco || null,        // área fixa dos locais cadastrados nesta planta
            prefixoNome: p.prefixoNome || null,
            largura: p.largura,
            altura: p.altura,
            url: p.imagem,
            hd: p.hd || null,
            proporcaoArte: p.proporcaoArte || null,
            altOriginal: p.alt || ""
        };
        NOMES_ALAS[p.codigo] = p.nome;
    });
    PLANTA_PRINCIPAL = (config.plantas.find(p => p.principal) || config.plantas[0]).codigo;
    alaAtual = PLANTA_PRINCIPAL;
    ORDEM_PRINCIPAIS = config.destaques.slice();

    prepararAreas(config);   // cores e ícones (icones-lugares.js)

    const prefixos = [...Object.keys(AREA_DOS_BLOCOS), ...config.plantas.map(p => p.prefixoNome).filter(Boolean)]
        .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    PREFIXOS_NOME = prefixos.length ? new RegExp(`^(${prefixos.join("|")}) - `) : null;

    montarBotoesAlas();
}

// Botões "Mapa exibido": um por planta do espaço
function montarBotoesAlas() {
    const grupo = document.getElementById("seletor-alas");
    if (!grupo) return;
    grupo.innerHTML = "";
    Object.values(plantas).forEach(planta => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-type";
        btn.dataset.ala = planta.codigo;
        btn.textContent = planta.rotuloCurto;
        if (planta.rotuloCurto !== planta.nome) btn.title = planta.nome;
        btn.addEventListener("click", () => filtrarAla(planta.codigo));
        grupo.appendChild(btn);
    });
    marcarBotaoAla(alaAtual);
}


// Escapa texto antes de inserir via innerHTML (nomes podem ser digitados pelo admin)
function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Remove acentos e hífens, para "auditorio" achar "Auditório" e
// "bloco a" achar "Bloco A - ..."
function normalizarTexto(txt) {
    return String(txt)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
}

function normalizarBusca(txt) {
    return normalizarTexto(txt).replace(/-/g, " ").replace(/\s+/g, " ");
}

function termoDeBuscaAtual() {
    const searchInput = document.getElementById("search-input");
    return searchInput ? normalizarBusca(searchInput.value) : "";
}

function initMap() {
    mapa = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 3,
        zoomSnap: 0.5,   // zoom em meios passos: transição mais suave
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 90,
        zoomControl: false
    });

    // Botões + / − com textos em português (viram dica e nome acessível)
    L.control.zoom({ zoomInTitle: "Aproximar o mapa", zoomOutTitle: "Afastar o mapa" }).addTo(mapa);

    // Camadas próprias para a planta: a base fica embaixo e os pedaços HD
    // por cima dela, ambos abaixo dos marcadores e do marcador temporário
    mapa.createPane("planta").style.zIndex = 250;
    mapa.createPane("plantaHD").style.zIndex = 260;
    // Nomes dos locais abaixo dos pinos; "destaque" (marcador temporário do
    // admin) acima de tudo, menos dos popups
    mapa.createPane("rotulos").style.zIndex = 590;
    mapa.createPane("destaque").style.zIndex = 650;
    mapa.on("zoomend moveend", atualizarCamadaHD);
    mapa.on("zoomend moveend", atualizarVisibilidadeMapa);
    // Nomes que ficariam cortados atrás do popup aberto somem enquanto ele está aberto
    mapa.on("popupopen", atualizarVisibilidadeMapa);
    mapa.on("popupclose", (e) => {
        if (e.popup === popupAberto) popupAberto = null;
        atualizarVisibilidadeMapa();
    });

    // A+ / A- muda o tamanho dos nomes: mede tudo de novo
    document.addEventListener("accessmap:fonte", () => {
        itensMapa.forEach(item => { item.tamanho = null; });
        atualizarVisibilidadeMapa();
    });

    primeiraInicializacao = true;
    atualizarPlantaDeFundo();

    // Busca "ao vivo": a lista lateral e os marcadores refletem o texto
    // digitado. O Enter (handleBuscaKeydown) vai direto ao primeiro resultado.
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", aplicarFiltrosCombinados);
    }

    // Sem isso o Leaflet mantém o tamanho antigo do container em cache
    // quando a janela muda de tamanho.
    window.addEventListener("resize", () => {
        if (mapa) mapa.invalidateSize();
    });
}

function atualizarPlantaDeFundo() {
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    let textAltPlanta = dadosPlanta.altOriginal || `Planta: ${dadosPlanta.nome}.`;

    // Se o admin enviou uma imagem nova com descrição, usa a descrição dele
    if (dadosPlanta.alt) textAltPlanta = dadosPlanta.alt;

    camadaImagem = L.imageOverlay(dadosPlanta.url, limites, {
        alt: textAltPlanta,
        pane: "planta"
    }).addTo(mapa);

    prepararPedacosHD(dadosPlanta);
    enquadrarPlanta();
    atualizarCamadaHD();
    atualizarTituloResultados();
    aplicarFiltrosCombinados();
}

/* ---------------------------------------------------------
   ALTA RESOLUÇÃO SOB DEMANDA
   A imagem base é leve e sempre carregada. Quando o zoom pede mais
   detalhe do que ela tem, entram por cima os pedaços HD — só os que
   estão na área visível (com uma margem), para a página continuar leve.
   --------------------------------------------------------- */
function prepararPedacosHD(planta) {
    pedacosHD.forEach(p => { if (p.camada) mapa.removeLayer(p.camada); });
    pedacosHD = [];

    // Imagem enviada pelo admin não tem pedaços HD: usa só ela
    if (!planta.hd || planta.personalizada) return;

    const { colunas, linhas, sobreposicao } = PLANTA_HD;
    const cw = planta.largura / colunas;
    const ch = planta.altura / linhas;

    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            // Mesmo cálculo do script (linha 0 = faixa de cima da imagem)
            const x0 = Math.max(0, c * cw - sobreposicao);
            const x1 = Math.min(planta.largura, (c + 1) * cw + sobreposicao);
            const yTopo = Math.max(0, l * ch - sobreposicao);
            const yBase = Math.min(planta.altura, (l + 1) * ch + sobreposicao);

            pedacosHD.push({
                url: `${planta.hd}/${l}-${c}.webp`,
                // No mapa, a coordenada Y cresce para cima
                limites: L.latLngBounds([planta.altura - yBase, x0], [planta.altura - yTopo, x1]),
                camada: null
            });
        }
    }
}

function precisaDeHD() {
    // px de tela por coordenada, considerando telas de alta densidade (retina)
    const pixelsPorCoordenada = Math.pow(2, mapa.getZoom()) * (window.devicePixelRatio || 1);
    return pixelsPorCoordenada > PLANTA_HD.escalaBase;
}

function atualizarCamadaHD() {
    if (!mapa || pedacosHD.length === 0) return;

    if (!precisaDeHD()) {
        pedacosHD.forEach(p => {
            if (p.camada && mapa.hasLayer(p.camada)) mapa.removeLayer(p.camada);
        });
        return;
    }

    const areaVisivel = mapa.getBounds().pad(0.25);
    pedacosHD.forEach(p => {
        if (!areaVisivel.intersects(p.limites)) return;
        if (!p.camada) {
            p.camada = L.imageOverlay(p.url, p.limites, {
                pane: "plantaHD",
                alt: "",          // decorativo: a descrição está na imagem base
                interactive: false
            });
        }
        if (!mapa.hasLayer(p.camada)) p.camada.addTo(mapa);
    });
}

// Mostra a planta inteira na área visível. No celular, desconta o painel
// inferior recolhido (sidebar-mapa.js), para a planta não ficar embaixo dele.
function enquadrarPlanta() {
    const dadosPlanta = plantas[alaAtual];
    const limites = L.latLngBounds([[0, 0], [dadosPlanta.altura, dadosPlanta.largura]]);
    const painel = typeof window.alturaPainelInferior === "function" ? window.alturaPainelInferior() : 0;
    const margem = L.point(0, painel);
    zoomEnquadrado = mapa.getBoundsZoom(limites, false, margem);
    mapa.fitBounds(limites, { paddingBottomRight: margem, animate: false });
}

function atualizarTituloResultados() {
    const titulo = document.getElementById("titulo-resultados");
    if (titulo) titulo.textContent = `Resultados (${NOMES_ALAS[alaAtual]})`;
}

// Deixa destacado (e anunciado) o botão da ala aberta
function marcarBotaoAla(ala) {
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        const ativo = btn.dataset.ala === ala;
        btn.classList.toggle("active", ativo);
        btn.setAttribute("aria-pressed", String(ativo));
    });
}

// Sincroniza o visual dos botões de filtro com `filtroAtual`
function marcarBotoesFiltro() {
    document.querySelectorAll(".filtro[data-filtro]").forEach(btn => {
        const ativo = btn.dataset.filtro === filtroAtual;
        btn.classList.toggle("ativo", ativo);
        btn.setAttribute("aria-pressed", String(ativo));
    });
    const verTodos = document.getElementById("btn-ver-todos");
    if (verTodos) verTodos.setAttribute("aria-pressed", String(filtroAtual === "acessibilidade"));
}

function filtrarAla(ala) {
    if (!plantas[ala]) return;
    primeiraInicializacao = false;
    alaAtual = ala;
    lugarSelecionado = null;
    mapa.closePopup();
    marcarBotaoAla(ala);
    atualizarPlantaDeFundo();
}

function aplicarFiltrosCombinados() {
    const termo = termoDeBuscaAtual();
    let filtrados;

    if (termo) {
        // Na planta principal a busca procura em todas as plantas; dentro de
        // outra planta (ex.: um subsolo), fica restrita aos locais dela.
        const candidatos = naPlantaPrincipal() ? lugares : lugaresDaPlanta();

        filtrados = candidatos.filter(l => normalizarBusca(l.nome).includes(termo));
    } else if (naPlantaPrincipal()) {
        filtrados = filtroAtual
            ? [...lugares]
            : lugares.filter(l => l.subponto === true && l.planta === alaAtual);
    } else {
        filtrados = lugaresDaPlanta();
    }

    // Filtro por tipo de acessibilidade
    if (filtroAtual) {
        if (filtroAtual === "fisica") {
            filtrados = filtrados.filter(l => l.tipo === "fisica" || l.tipo === "alerta");
        } else if (filtroAtual === "acessibilidade") {
            // "Ver Todos": física, auditiva e alertas do mapa aberto
            filtrados = filtrados.filter(l => ["fisica", "auditiva", "alerta"].includes(l.tipo));
        } else {
            filtrados = filtrados.filter(l => l.tipo === filtroAtual);
        }

        // Na planta principal, oculta itens que pertencem a outras plantas
        if (naPlantaPrincipal()) {
            filtrados = filtrados.filter(l => l.planta === alaAtual);
        }
    }

    // No mapa, os resultados da busca ficam sempre visíveis e destacados
    destaquesMapa = termo ? new Set(filtrados) : new Set();
    atualizarVisibilidadeMapa();

    if (naPlantaPrincipal() && !termo && !filtroAtual) {
        // Estado padrão da planta principal: lateral só com os blocos/locais principais
        const blocosPrincipais = lugares.filter(l => l.subponto === false && l.planta === alaAtual);
        atualizarListaLateral(blocosPrincipais);
    } else {
        atualizarListaLateral(filtrados, { mostrarTodos: true });
    }
}

// Texto curto "o que é · onde fica" (ícones e cores: icones-lugares.js)
function descricaoDoTipo(lugar) {
    if (lugar.tipo === "alerta") return "<span class='tag-alerta'>⚠️ Barreira física (necessita de melhorias)</span>";

    const estilo = estiloDoLugar(lugar);
    const rotuloAndar = plantas[lugar.planta] && plantas[lugar.planta].andar;
    const andar = rotuloAndar ? ` (${escaparHtml(rotuloAndar)})` : "";
    if (TIPOS_DESTAQUE[lugar.tipo]) {
        return `${TIPOS_DESTAQUE[lugar.tipo].rotulo} · ${escaparHtml(estilo.oQue)}${andar}`;
    }
    return `${escaparHtml(estilo.oQue)} · ${escaparHtml(estilo.area)}${andar}`;
}

/* =========================================================
   CAMADAS DO MAPA: NOMES (TEXTO) E PINOS DE ACESSIBILIDADE
   -----------------------------------------------------------
   • Todo local da planta aberta aparece como NOME em texto.
   • Só pontos de acessibilidade (física/auditiva) e alertas viram PINO.
   • Os itens aparecem conforme o zoom (como no Airbnb): de longe só os
     prédios e áreas principais; aproximando, surgem as salas. Nomes que
     se sobreporiam a outros mais importantes ficam escondidos até haver
     espaço na tela.
   ========================================================= */
const ZOOM_SALAS = 0.5;          // zoom a partir do qual as salas do Mapa Geral aparecem
const ZOOM_AFASTADO = 0;         // abaixo disso, as etiquetas dos prédios ficam compactas
// Ao abrir a planta o mapa fica limpo: os locais só aparecem depois que a
// pessoa aproxima pelo menos um passo a partir do enquadramento inicial
const PASSO_PARA_MOSTRAR = 0.5;
let zoomEnquadrado = -Infinity;  // zoom em que a planta inteira cabe na tela
const MARGEM_ROTULO = 4;         // px de folga entre nomes

let itensMapa = [];              // [{ lugar, marcador, ePino, prioridade, zoomMinimo, tamanho }]
let assinaturaItens = "";
let destaquesMapa = new Set();   // resultados da busca (sempre visíveis)
let lugarSelecionado = null;     // local aberto pela lista/busca (sempre visível)
let popupAberto = null;
let mapaAfastado = null;

function ePontoDeAcessibilidade(lugar) {
    return lugar.tipo === "fisica" || lugar.tipo === "auditiva" || lugar.tipo === "alerta";
}

function naPlantaPrincipal() {
    return alaAtual === PLANTA_PRINCIPAL;
}

// Locais da planta aberta
function lugaresDaPlanta() {
    return lugares.filter(l => l.planta === alaAtual);
}

// Planta em que o local aparece (planta desconhecida = planta principal)
function plantaDoLugar(lugar) {
    return plantas[lugar.planta] ? lugar.planta : PLANTA_PRINCIPAL;
}

// "Bloco A - Lab A (A206)" -> "Lab A (A206)": no mapa o prédio já é visível.
// Os prefixos são os nomes dos prédios e os prefixos das plantas do espaço.
function nomeCurto(lugar) {
    return PREFIXOS_NOME ? lugar.nome.replace(PREFIXOS_NOME, "") : lugar.nome;
}

// Prédios curtos ("Bloco A") viram palavra + letra, para a etiqueta poder
// ficar compacta (em duas linhas) quando o zoom está afastado
function textoDoRotulo(lugar) {
    const predio = AREA_DOS_BLOCOS[lugar.nome] && /^(.*\S)\s+(\S{1,3})$/.exec(lugar.nome);
    if (predio) {
        return `<span class="rotulo-texto"><span class="rotulo-predio-palavra">${escaparHtml(predio[1])}</span> <span class="rotulo-predio-letra">${escaparHtml(predio[2])}</span></span>`;
    }
    return `<span class="rotulo-texto">${escaparHtml(nomeCurto(lugar))}</span>`;
}

function conteudoPopup(lugar) {
    return `
        <div class="popup-lugar">
            ${seloDoLugar(lugar, "selo-lugar--popup")}
            <strong>${escaparHtml(lugar.nome)}</strong>
            <span>${descricaoDoTipo(lugar)}</span>
        </div>`;
}

function abrirPopupDoLugar(lugar) {
    // No celular, o popup não pode ficar escondido atrás do painel inferior
    const painel = typeof window.alturaPainelInferior === "function" ? window.alturaPainelInferior() : 0;
    popupAberto = L.popup({
        offset: ePontoDeAcessibilidade(lugar) ? [0, -36] : [0, -10],
        maxWidth: Math.min(340, window.innerWidth - 60),
        autoPanPaddingTopLeft: L.point(16, 16),
        autoPanPaddingBottomRight: L.point(16, painel + 16)
    })
        .setLatLng([lugar.y, lugar.x])
        .setContent(conteudoPopup(lugar));
    // Abre só depois de guardar em popupAberto: o evento "popupopen" já usa ele
    popupAberto.openOn(mapa);
}

// Prioridade (menor = mais importante) e zoom mínimo de cada item
// Os prédios vêm antes de tudo (orientação); depois os pinos de acessibilidade
function prioridadeDoItem(lugar, ePino) {
    if (AREA_DOS_BLOCOS[lugar.nome]) return 0;
    if (ePino) return { alerta: 1, fisica: 2, auditiva: 3 }[lugar.tipo];
    return lugar.subponto ? 30 : 20;
}

function zoomMinimoDoItem(lugar, ePino) {
    if (ePino || !naPlantaPrincipal() || !lugar.subponto) return -Infinity;
    return ZOOM_SALAS;
}

function criarItemMapa(lugar) {
    const ePino = ePontoDeAcessibilidade(lugar);
    let marcador;

    if (ePino) {
        const estilo = estiloDoLugar(lugar);
        marcador = L.marker([lugar.y, lugar.x], {
            icon: criarIconeLugar(lugar),
            title: lugar.nome,
            keyboard: true
        });
        marcador.on("add", () => {
            // Nome acessível do pino (é um <div>, sem alt)
            marcador.getElement().setAttribute("aria-label", `${lugar.nome}. ${estilo.descricao}`);
        });
    } else {
        const estilo = estiloDoLugar(lugar);
        const nivel = AREA_DOS_BLOCOS[lugar.nome] ? "predio" : (lugar.subponto ? "sala" : "area");
        marcador = L.marker([lugar.y, lugar.x], {
            pane: "rotulos",
            keyboard: false, // pelo teclado, os locais são acessados pela lista lateral
            icon: L.divIcon({
                className: "rotulo-wrap",
                iconSize: [0, 0],
                iconAnchor: [0, 0],
                html: `<span class="rotulo-lugar rotulo-lugar--${nivel}" style="--cor-lugar:${estilo.cor};--cor-icone:${estilo.corIcone}" aria-hidden="true">` +
                      `<i class="fas ${estilo.icone}"></i>${textoDoRotulo(lugar)}</span>`
            })
        });
    }

    // O admin pode tratar o clique (ex.: abrir a edição); senão abre o popup
    marcador.on("click", (e) => {
        if (typeof window.aoClicarLugarNoMapa === "function" && window.aoClicarLugarNoMapa(lugar, e)) return;
        abrirPopupDoLugar(lugar);
    });

    return {
        lugar,
        marcador,
        ePino,
        prioridade: prioridadeDoItem(lugar, ePino),
        zoomMinimo: zoomMinimoDoItem(lugar, ePino),
        tamanho: null
    };
}

// Recria os itens só quando a planta ou os dados mudam
function garantirItensMapa() {
    const assinatura = alaAtual + "|" + JSON.stringify(lugaresDaPlanta().map(l =>
        [l.nome, l.x, l.y, l.tipo, l.categoria, l.bloco_pai, l.planta, l.subponto]));
    if (assinatura === assinaturaItens) return;
    assinaturaItens = assinatura;

    itensMapa.forEach(item => mapa.removeLayer(item.marcador));
    itensMapa = lugaresDaPlanta().map(criarItemMapa);
    itensMapa.forEach(item => {
        item.marcador.addTo(mapa);
        item.marcador.getElement().classList.add("item-mapa-oculto");
    });
    if (lugarSelecionado && !lugares.includes(lugarSelecionado)) lugarSelecionado = null;
}

function passaNoFiltro(lugar) {
    if (!filtroAtual || filtroAtual === "acessibilidade") return true;
    if (filtroAtual === "fisica") return lugar.tipo === "fisica" || lugar.tipo === "alerta";
    return lugar.tipo === filtroAtual;
}

// Retângulo ocupado na tela (px do contêiner do mapa)
function retanguloDoItem(item, ponto) {
    if (item.ePino) {
        // corpo do pino (sem a ponta), um pouco menor para pinos vizinhos caberem
        return { x1: ponto.x - 11, y1: ponto.y - 38, x2: ponto.x + 11, y2: ponto.y - 14 };
    }
    const { w, h } = item.tamanho;
    // Prédios: centralizados no ponto. Salas/áreas: o ícone fica no ponto e
    // o nome segue para a direita (ver .rotulo-lugar em _marcadores.scss)
    const esquerda = AREA_DOS_BLOCOS[item.lugar.nome] ? ponto.x - w / 2 : ponto.x - item.ancora;
    return {
        x1: esquerda - MARGEM_ROTULO, y1: ponto.y - h / 2 - MARGEM_ROTULO,
        x2: esquerda + w + MARGEM_ROTULO, y2: ponto.y + h / 2 + MARGEM_ROTULO
    };
}

function sobrepoe(a, b) {
    return a.x1 < b.x2 && a.x2 > b.x1 && a.y1 < b.y2 && a.y2 > b.y1;
}

function atualizarVisibilidadeMapa() {
    if (!mapa) return;
    garantirItensMapa();

    const zoom = mapa.getZoom();
    const areaVisivel = mapa.getBounds().pad(0.15);
    const aproximou = zoom >= zoomEnquadrado + PASSO_PARA_MOSTRAR;
    // Com filtro de acessibilidade ativo, os pinos aparecem mesmo sem zoom
    const filtroAtivo = !!filtroAtual;
    const comBusca = destaquesMapa.size > 0;
    mapa.getContainer().classList.toggle("mapa-com-busca", comBusca);

    // Zoom afastado: etiquetas dos prédios compactas (precisam ser medidas de novo)
    const afastado = zoom < ZOOM_AFASTADO;
    if (afastado !== mapaAfastado) {
        mapaAfastado = afastado;
        mapa.getContainer().classList.toggle("mapa-afastado", afastado);
        itensMapa.forEach(item => { if (AREA_DOS_BLOCOS[item.lugar.nome]) item.tamanho = null; });
    }

    // 1) Lê os tamanhos que faltam (todas as leituras antes das escritas)
    itensMapa.forEach(item => {
        if (!item.ePino && !item.tamanho) {
            const el = item.marcador.getElement().firstElementChild;
            item.tamanho = { w: el.offsetWidth, h: el.offsetHeight };
            item.ancora = parseFloat(getComputedStyle(el).getPropertyValue("--ancora")) || 0;
        }
    });

    // 2) Decide quem aparece. O local selecionado sempre aparece; os
    //    resultados da busca têm prioridade, mas também não se sobrepõem
    //    (os que não couberem surgem ao aproximar o zoom).
    const forcado = (item) => item.lugar === lugarSelecionado;
    const destacado = (item) => destaquesMapa.has(item.lugar);
    const ordenados = [...itensMapa].sort((a, b) =>
        (forcado(b) - forcado(a)) || (destacado(b) - destacado(a)) || (a.prioridade - b.prioridade));

    const ocupados = [];
    const visiveis = new Set();

    // O popup aberto ocupa espaço: o que ficaria embaixo dele não aparece
    const caixaPopup = popupAberto && mapa.hasLayer(popupAberto) && popupAberto.getElement()
        ? popupAberto.getElement().querySelector(".leaflet-popup-content-wrapper")
        : null;
    if (caixaPopup) {
        const r = caixaPopup.getBoundingClientRect();
        const m = mapa.getContainer().getBoundingClientRect();
        ocupados.push({ x1: r.left - m.left, y1: r.top - m.top, x2: r.right - m.left, y2: r.bottom - m.top });
    }

    ordenados.forEach(item => {
        const eForcado = forcado(item);
        const latlng = [item.lugar.y, item.lugar.x];

        if (!eForcado && !destacado(item)) {
            if (item.ePino && !passaNoFiltro(item.lugar)) return;
            const liberadoPeloFiltro = item.ePino && filtroAtivo;
            if (!aproximou && !liberadoPeloFiltro) return;   // tela inicial limpa
            if (zoom < item.zoomMinimo && !liberadoPeloFiltro) return;
        }
        if (!eForcado && !areaVisivel.contains(latlng)) return;

        const ret = retanguloDoItem(item, mapa.latLngToContainerPoint(latlng));
        if (!eForcado && ocupados.some(o => sobrepoe(o, ret))) return;

        ocupados.push(ret);
        visiveis.add(item);
    });

    // 3) Aplica (só escritas)
    itensMapa.forEach(item => {
        const el = item.marcador.getElement();
        el.classList.toggle("item-mapa-oculto", !visiveis.has(item));
        el.classList.toggle("item-mapa-destaque", forcado(item) || destacado(item));
    });
}

function filtrar(tipo) {
    primeiraInicializacao = false;
    filtroAtual = (filtroAtual === tipo) ? null : tipo;
    marcarBotoesFiltro();
    aplicarFiltrosCombinados();
}


/**
 * Monta a lista lateral do mapa público.
 * Sem `mostrarTodos`, exibe só os locais principais (subponto: false) —
 * usado no estado padrão do Mapa Geral.
 */
function atualizarListaLateral(lista, { mostrarTodos = false } = {}) {
    const container = document.getElementById("lista-lugares");
    if (!container) return;

    container.innerHTML = "";

    const listaParaExibir = mostrarTodos ? [...lista] : lista.filter(l => l.subponto === false);

    // Blocos e estacionamentos principais primeiro, na ordem definida
    listaParaExibir.sort((a, b) => {
        const iA = ORDEM_PRINCIPAIS.indexOf(a.nome);
        const iB = ORDEM_PRINCIPAIS.indexOf(b.nome);
        if (iA !== -1 && iB !== -1) return iA - iB;
        if (iA !== -1) return -1;
        if (iB !== -1) return 1;
        return 0;
    });

    atualizarContador(listaParaExibir.length);

    if (listaParaExibir.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "lista-vazia";
        const termo = document.getElementById("search-input")?.value.trim();
        vazio.textContent = termo
            ? `Nenhum local encontrado para "${termo}" em ${NOMES_ALAS[alaAtual]}. Confira a grafia ou troque de mapa.`
            : "Nenhum local com esse filtro neste mapa.";
        container.appendChild(vazio);
        return;
    }

    listaParaExibir.forEach(lugar => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "item-lugar com-selo";
        item.style.setProperty("--cor-borda", estiloDoLugar(lugar).cor);
        item.innerHTML = `
            ${seloDoLugar(lugar)}
            <span class="item-lugar-texto">
                <p><strong>${escaparHtml(lugar.nome)}</strong></p>
                <span>${descricaoDoTipo(lugar)}</span>
            </span>
        `;
        item.addEventListener("click", () => focarNoLugar(lugar));
        container.appendChild(item);
    });
}

function atualizarContador(quantidade) {
    const contador = document.getElementById("contador-resultados");
    if (contador) {
        contador.textContent = `${quantidade} ${quantidade === 1 ? "local" : "locais"}`;
    }
}

// Navega o mapa até um lugar e abre o popup dele. Para um prédio, o zoom
// fica no nível em que as salas internas começam a aparecer.
function focarNoLugar(lugar) {
    primeiraInicializacao = false;
    lugarSelecionado = lugar;

    const zoomAlvo = AREA_DOS_BLOCOS[lugar.nome]
        ? Math.max(ZOOM_SALAS + 0.5, 1)
        : Math.max(mapa.getZoom(), 1.5);

    let abriu = false;
    const abrir = () => {
        if (abriu) return;
        abriu = true;
        atualizarVisibilidadeMapa();
        abrirPopupDoLugar(lugar);
    };
    mapa.once("moveend", abrir);
    mapa.setView([lugar.y, lugar.x], zoomAlvo);
    setTimeout(abrir, 450); // caso o mapa já esteja nessa posição (sem "moveend")
}

// Busca por nome e vai direto pro local. Prioriza correspondência exata;
// senão usa a primeira parcial (ex: "auditorio" acha "Bloco A - Auditório A202").
function buscarEIrParaLocal() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    const termo = normalizarBusca(searchInput.value);
    if (!termo) return;

    const encontrado =
        lugares.find(l => normalizarBusca(l.nome) === termo) ||
        lugares.find(l => normalizarBusca(l.nome).includes(termo));

    searchInput.classList.remove("busca-sem-resultado");
    searchInput.removeAttribute("aria-invalid");

    if (encontrado) {
        // Local de outra planta: troca para a planta certa antes de focar
        const alaDoLugar = plantaDoLugar(encontrado);
        if (alaDoLugar !== alaAtual) filtrarAla(alaDoLugar);
        focarNoLugar(encontrado);
    } else {
        // Feedback visual rápido de "não encontrado" (a lista já mostra a mensagem)
        searchInput.classList.add("busca-sem-resultado");
        searchInput.setAttribute("aria-invalid", "true");
        setTimeout(() => searchInput.classList.remove("busca-sem-resultado"), 1200);
    }
}

function handleBuscaKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarEIrParaLocal();
    } else if (event.key === "Escape" && event.target.value) {
        event.preventDefault();
        event.target.value = "";
        event.target.dispatchEvent(new Event("input"));
    }
}

// "Ver Todos": todos os pontos de acessibilidade (física, auditiva e
// alertas) do mapa aberto. Clicar de novo desativa.
function mostrarTodos() {
    filtrar("acessibilidade");
}

function resetarMapaCompleto() {
    filtroAtual = null;
    alaAtual = PLANTA_PRINCIPAL;
    primeiraInicializacao = true;

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.value = "";
        searchInput.removeAttribute("aria-invalid");
    }

    lugarSelecionado = null;
    destaquesMapa = new Set();
    if (mapa) mapa.closePopup();

    marcarBotoesFiltro();
    marcarBotaoAla(PLANTA_PRINCIPAL);
    atualizarPlantaDeFundo();
}

// Promise resolvida quando o mapa já foi criado. Antes de criar o mapa,
// carrega a configuração do espaço, os locais e as imagens de planta
// enviadas pelo admin (do servidor), para não exibir a planta antiga e
// depois trocar. Os scripts do admin (admin.js / admin-planta.js) esperam
// por ela antes de usar `mapa`.
const mapaPronto = new Promise((resolve) => {
    window.addEventListener("load", async () => {
        prepararEspaco(await AccessMapEspaco.pronto);
        await Promise.all([
            carregarLugares(),
            window.PlantasStorage ? PlantasStorage.aplicarEm(plantas) : null // nunca lança erro
        ]);
        initMap();
        resolve();
    });
});
