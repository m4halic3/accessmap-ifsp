/* =========================================================
   PLANTAS (IMAGENS DO MAPA) - ACCESSMAP
   -----------------------------------------------------------
   As imagens de mapa enviadas pelo administrador ficam no banco
   de dados (tabela `planta_versao`), pela API /api/plantas (ver
   api.js). Assim, o mapa público (mapa.html) de qualquer
   visitante passa a exibir a versão mais recente.

   Histórico: para cada planta o servidor guarda a imagem em uso e
   a anterior. O campo `anterior` de cada registro descreve a versão
   que volta com "Voltar ao mapa anterior" ({ original: true } se
   for a imagem original do projeto).
   ========================================================= */
(function () {
    "use strict";

    const TIPOS_ACEITOS = ["image/png", "image/jpeg", "image/webp"];
    const TAMANHO_MAXIMO = 25 * 1024 * 1024; // 25 MB (imagens em alta resolução)

    /** Publica uma nova imagem; a que estava em uso vira a "anterior". */
    function publicar(registro) {
        const dados = new FormData();
        dados.append("arquivo", registro.blob, registro.nome);
        dados.append("largura", registro.largura);
        dados.append("altura", registro.altura);
        if (registro.alt) dados.append("alt", registro.alt);
        return AccessMapApi.publicarPlanta(registro.ala, dados);
    }

    /** Volta o mapa para a versão anterior à última publicação. */
    function voltarAnterior(ala) {
        return AccessMapApi.voltarPlantaAnterior(ala);
    }

    /** Planta enviada pelo admin em uso na ala, ou null se é a original. */
    async function obter(ala) {
        try {
            return await AccessMapApi.requisitar(`/plantas/${ala}`);
        } catch (erro) {
            if (erro.status === 404) return null;
            throw erro;
        }
    }

    /** Remove as imagens enviadas e o histórico: volta a imagem original. */
    function remover(ala) {
        return AccessMapApi.restaurarPlantaOriginal(ala);
    }

    // Guarda a imagem original na primeira vez, para poder restaurar depois
    function guardarOriginal(planta) {
        if (!planta.urlOriginal) planta.urlOriginal = planta.url;
    }

    /** Aplica o registro vindo do servidor (ou null = imagem original) à planta. */
    function aplicarRegistro(planta, registro) {
        guardarOriginal(planta);

        if (registro) {
            planta.url = AccessMapApi.urlAbsoluta(registro.url);
            planta.alt = registro.alt || "";
            planta.personalizada = true;
            planta.meta = {
                nome: registro.nome,
                atualizadoEm: registro.atualizadoEm,
                largura: registro.largura,
                altura: registro.altura
            };
            planta.temAnterior = !!registro.anterior;
        } else {
            planta.url = planta.urlOriginal;
            planta.alt = "";
            planta.personalizada = false;
            planta.meta = null;
            planta.temAnterior = false;
        }
    }

    /**
     * Atualiza UMA planta do objeto `plantas` (definido em mapa.js) com o que
     * estiver salvo no servidor: se houver imagem enviada pelo admin, usa ela;
     * senão volta para a imagem original do projeto.
     */
    async function aplicarAla(plantas, ala) {
        const planta = plantas[ala];
        if (!planta) return;
        aplicarRegistro(planta, await obter(ala));
    }

    /** Aplica todas as plantas salvas. Nunca lança erro: se o servidor falhar, o mapa usa as originais. */
    async function aplicarEm(plantas) {
        try {
            const registros = await AccessMapApi.listarPlantas();
            for (const ala of Object.keys(plantas)) {
                aplicarRegistro(plantas[ala], registros.find(r => r.ala === ala) || null);
            }
        } catch (erro) {
            Object.values(plantas).forEach(guardarOriginal);
            console.warn("AccessMap: não foi possível carregar as imagens de mapa salvas. Usando as originais.", erro);
        }
    }

    window.PlantasStorage = {
        TIPOS_ACEITOS,
        TAMANHO_MAXIMO,
        publicar,
        voltarAnterior,
        obter,
        remover,
        aplicarAla,
        aplicarEm
    };
})();
