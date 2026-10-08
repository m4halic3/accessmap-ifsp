/* =========================================================
   ADMIN - ATUALIZAR IMAGEM DO MAPA
   -----------------------------------------------------------
   Permite ao administrador enviar uma nova imagem (planta) para
   o Mapa Geral ou para um dos subsolos, quando o campus muda
   (ex.: um novo prédio foi construído).

   Depende de (carregados antes): mapa.js, admin.js e
   plantas-storage.js.

   IMPORTANTE sobre as coordenadas: a nova imagem é encaixada na
   MESMA área de coordenadas da planta atual (plantas[ala].largura /
   altura). Assim, todos os pontos já cadastrados continuam no mesmo
   lugar, desde que a nova imagem tenha a mesma proporção e o mesmo
   enquadramento da anterior.
   ========================================================= */
(function () {
    "use strict";

    const NOMES_PLANTAS = {
        todos: "Mapa Geral (campus)",
        edificacoes: "Subsolo Edificações (Bloco C)",
        mecanica: "Subsolo Mecânica (Bloco B)"
    };

    const LIMITE_PROPORCAO = 0.02;   // tolerância de 2% na proporção
    const LADO_MINIMO_PX = 300;

    let arquivo = null;          // File escolhido
    let infoArquivo = null;      // { largura, altura }
    let urlPreview = null;       // object URL da pré-visualização
    let razaoAtual = null;       // proporção (largura/altura) da imagem em uso
    let focoAnterior = null;
    let sequenciaAtual = 0;      // evita "corrida" entre leituras assíncronas
    let urlPreviewAnterior = null; // object URL da miniatura do mapa anterior

    const el = {};

    function $(id) { return document.getElementById(id); }

    function iniciar() {
        el.btnAbrir = $("btn-atualizar-planta");
        el.overlay = $("overlay-planta");
        if (!el.btnAbrir || !el.overlay) return;

        el.card = el.overlay.querySelector(".planta-card");
        el.btnFechar = $("btn-fechar-planta");
        el.alvo = $("planta-alvo");
        el.origem = $("planta-origem");
        el.arquivo = $("planta-arquivo");
        el.previewArea = $("planta-preview-area");
        el.preview = $("planta-preview");
        el.info = $("planta-info");
        el.aviso = $("planta-aviso");
        el.erro = $("planta-erro");
        el.alt = $("planta-alt");
        el.anteriorArea = $("planta-anterior-area");
        el.anteriorImg = $("planta-anterior-img");
        el.anteriorInfo = $("planta-anterior-info");
        el.btnVoltar = $("btn-voltar-planta");
        el.btnRestaurar = $("btn-restaurar-planta");
        el.btnPublicar = $("btn-publicar-planta");
        el.status = $("planta-status");

        el.btnAbrir.addEventListener("click", abrirModal);
        el.btnFechar.addEventListener("click", fecharModal);
        el.alvo.addEventListener("change", aoTrocarMapaAlvo);
        el.arquivo.addEventListener("change", aoEscolherArquivo);
        el.btnPublicar.addEventListener("click", pedirConfirmacaoPublicar);
        el.btnRestaurar.addEventListener("click", pedirConfirmacaoRestaurar);
        el.btnVoltar.addEventListener("click", pedirConfirmacaoVoltar);

        // Fecha clicando fora do cartão
        el.overlay.addEventListener("click", (e) => {
            if (e.target === el.overlay) fecharModal();
        });

        // Escape fecha e Tab fica preso dentro do modal.
        // O listener fica no cartão (e não no document) para não interferir
        // no modal de confirmação, que é um elemento irmão.
        el.card.addEventListener("keydown", aoPressionarTecla);
    }

    // ---------------------------------------------------------------
    // Abrir / fechar
    // ---------------------------------------------------------------
    function abrirModal() {
        focoAnterior = document.activeElement;

        el.alvo.value = (typeof alaAtual !== "undefined" && NOMES_PLANTAS[alaAtual]) ? alaAtual : "todos";
        limparSelecao();
        mostrarErro("");
        atualizarEstadoDoMapaAlvo();

        el.overlay.classList.remove("oculto");
        el.overlay.setAttribute("aria-hidden", "false");
        el.alvo.focus();
    }

    function fecharModal() {
        el.overlay.classList.add("oculto");
        el.overlay.setAttribute("aria-hidden", "true");
        limparSelecao();
        limparPreviewAnterior();
        if (focoAnterior && typeof focoAnterior.focus === "function") focoAnterior.focus();
    }

    function aoPressionarTecla(e) {
        if (e.key === "Escape") {
            e.preventDefault();
            fecharModal();
            return;
        }
        if (e.key !== "Tab") return;

        const focaveis = Array.from(el.card.querySelectorAll(
            "button:not([disabled]), input:not([disabled]), select:not([disabled])"
        )).filter((n) => !n.closest("[hidden]"));
        if (focaveis.length === 0) return;

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primeiro.focus();
        }
    }

    // ---------------------------------------------------------------
    // Estado do mapa selecionado (original x personalizado)
    // ---------------------------------------------------------------
    function aoTrocarMapaAlvo() {
        limparSelecao();
        mostrarErro("");
        atualizarEstadoDoMapaAlvo();
    }

    function limparPreviewAnterior() {
        if (urlPreviewAnterior) {
            URL.revokeObjectURL(urlPreviewAnterior);
            urlPreviewAnterior = null;
        }
        el.anteriorImg.removeAttribute("src");
        el.anteriorInfo.textContent = "";
        el.anteriorArea.hidden = true;
    }

    // Mostra (ou esconde) o bloco "Mapa anterior guardado" com miniatura
    async function atualizarMapaAnterior(ala, minhaSequencia) {
        limparPreviewAnterior();

        const planta = plantas[ala];
        if (!planta.personalizada) return;

        let registro = null;
        try {
            registro = await PlantasStorage.obter(ala);
        } catch (_) {
            return; // sem o histórico simplesmente não oferecemos o botão
        }
        if (minhaSequencia !== sequenciaAtual) return; // o admin já trocou de mapa
        if (!registro || !registro.anterior) return;

        const anterior = registro.anterior;
        if (anterior.original) {
            el.anteriorImg.src = planta.urlOriginal;
            el.anteriorInfo.textContent = "Imagem original do projeto.";
        } else if (anterior.blob) {
            urlPreviewAnterior = URL.createObjectURL(anterior.blob);
            el.anteriorImg.src = urlPreviewAnterior;
            const data = new Date(anterior.atualizadoEm).toLocaleString("pt-BR");
            el.anteriorInfo.textContent = `${anterior.nome} — enviada em ${data}.`;
        } else {
            return;
        }
        el.anteriorArea.hidden = false;
    }

    async function atualizarEstadoDoMapaAlvo() {
        const ala = el.alvo.value;
        const planta = plantas[ala];

        if (planta.personalizada && planta.meta) {
            const data = new Date(planta.meta.atualizadoEm).toLocaleString("pt-BR");
            el.origem.textContent = `Imagem em uso: enviada pelo administrador em ${data} (${planta.meta.nome}).`;
        } else {
            el.origem.textContent = "Imagem em uso: original do projeto.";
        }
        el.btnRestaurar.hidden = !planta.personalizada;
        el.alt.value = planta.alt || "";

        const minhaSequencia = ++sequenciaAtual;
        atualizarMapaAnterior(ala, minhaSequencia);

        // Descobre a proporção da imagem atual para avisar se a nova for diferente
        razaoAtual = null;
        try {
            const dims = await medirImagem(planta.url);
            if (minhaSequencia === sequenciaAtual) {
                razaoAtual = dims.largura / dims.altura;
                if (arquivo && infoArquivo) avaliarProporcao();
            }
        } catch (_) {
            // Sem a proporção atual simplesmente não mostramos o aviso
        }
    }

    // ---------------------------------------------------------------
    // Escolha e validação do arquivo
    // ---------------------------------------------------------------
    function limparSelecao() {
        arquivo = null;
        infoArquivo = null;
        el.arquivo.value = "";
        if (urlPreview) {
            URL.revokeObjectURL(urlPreview);
            urlPreview = null;
        }
        el.preview.removeAttribute("src");
        el.previewArea.hidden = true;
        el.aviso.hidden = true;
        el.aviso.textContent = "";
        el.btnPublicar.disabled = true;
    }

    function mostrarErro(texto) {
        el.erro.textContent = texto;
        el.erro.hidden = !texto;
    }

    function formatarTamanho(bytes) {
        if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    function medirImagem(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve({ largura: img.naturalWidth, altura: img.naturalHeight });
            img.onerror = () => reject(new Error("Não foi possível ler a imagem."));
            img.src = url;
        });
    }

    async function aoEscolherArquivo() {
        const escolhido = el.arquivo.files && el.arquivo.files[0];
        limparSelecao();
        mostrarErro("");
        if (!escolhido) return;

        if (!PlantasStorage.TIPOS_ACEITOS.includes(escolhido.type)) {
            el.arquivo.value = "";
            mostrarErro("Formato não aceito. Envie uma imagem PNG, JPG ou WEBP.");
            return;
        }
        if (escolhido.size > PlantasStorage.TAMANHO_MAXIMO) {
            el.arquivo.value = "";
            mostrarErro(`A imagem tem ${formatarTamanho(escolhido.size)}. O limite é ${formatarTamanho(PlantasStorage.TAMANHO_MAXIMO)}.`);
            return;
        }

        const url = URL.createObjectURL(escolhido);
        try {
            const dims = await medirImagem(url);

            if (dims.largura < LADO_MINIMO_PX || dims.altura < LADO_MINIMO_PX) {
                URL.revokeObjectURL(url);
                el.arquivo.value = "";
                mostrarErro(`Imagem muito pequena (${dims.largura}×${dims.altura} px). Use pelo menos ${LADO_MINIMO_PX}×${LADO_MINIMO_PX} px.`);
                return;
            }

            arquivo = escolhido;
            infoArquivo = dims;
            urlPreview = url;

            el.preview.src = url;
            el.info.textContent = `${escolhido.name} — ${dims.largura}×${dims.altura} px, ${formatarTamanho(escolhido.size)}`;
            el.previewArea.hidden = false;
            el.btnPublicar.disabled = false;
            avaliarProporcao();
        } catch (_) {
            URL.revokeObjectURL(url);
            el.arquivo.value = "";
            mostrarErro("Não foi possível abrir esse arquivo como imagem. Verifique se ele não está corrompido.");
        }
    }

    function avaliarProporcao() {
        if (!infoArquivo || !razaoAtual) {
            el.aviso.hidden = true;
            return;
        }
        const razaoNova = infoArquivo.largura / infoArquivo.altura;
        const diferenca = Math.abs(razaoNova / razaoAtual - 1);

        if (diferenca > LIMITE_PROPORCAO) {
            el.aviso.textContent =
                "Atenção: a proporção desta imagem é diferente da imagem atual. Ela será esticada para caber " +
                "na área do mapa e os pontos já cadastrados podem ficar fora do lugar certo. " +
                "Prefira uma imagem com a mesma proporção e o mesmo enquadramento da anterior.";
            el.aviso.hidden = false;
        } else {
            el.aviso.hidden = true;
            el.aviso.textContent = "";
        }
    }

    // ---------------------------------------------------------------
    // Publicar / restaurar (sempre com confirmação)
    // ---------------------------------------------------------------
    function pedirConfirmacaoPublicar() {
        if (!arquivo) {
            mostrarErro("Escolha uma imagem antes de publicar.");
            return;
        }
        const ala = el.alvo.value;
        abrirConfirmacao(
            "Publicar novo mapa",
            `Tem certeza que deseja substituir a imagem de "${NOMES_PLANTAS[ala]}" por "${arquivo.name}"? ` +
            "A nova imagem passa a aparecer no mapa público deste navegador. " +
            "Se for preciso, você poderá voltar ao mapa anterior depois.",
            confirmarPublicar
        );
    }

    async function confirmarPublicar() {
        const ala = el.alvo.value;
        const alt = el.alt.value.trim();

        try {
            await PlantasStorage.publicar({
                ala,
                blob: arquivo,
                nome: arquivo.name,
                tipo: arquivo.type,
                tamanho: arquivo.size,
                largura: infoArquivo.largura,
                altura: infoArquivo.altura,
                alt,
                atualizadoEm: Date.now()
            });
            await PlantasStorage.aplicarAla(plantas, ala);
        } catch (erro) {
            console.error("AccessMap: falha ao salvar a imagem do mapa.", erro);
            const cheio = erro && erro.name === "QuotaExceededError";
            mostrarErro(cheio
                ? "O navegador está sem espaço para guardar essa imagem. Use uma imagem menor ou libere espaço."
                : "Não foi possível salvar a imagem neste navegador. Tente novamente.");
            return;
        }

        const nomeMapa = NOMES_PLANTAS[ala];
        const estaNaTela = ala === alaAtual;
        if (estaNaTela) atualizarPlantaDeFundo();

        fecharModal();
        mostrarStatus(
            estaNaTela
                ? `Mapa atualizado: "${nomeMapa}" já está com a nova imagem.`
                : `Mapa atualizado: "${nomeMapa}" foi salvo. Abra essa aba do mapa para ver a nova imagem.`
        );
    }

    function pedirConfirmacaoRestaurar() {
        const ala = el.alvo.value;
        abrirConfirmacao(
            "Restaurar mapa original",
            `Tem certeza que deseja voltar "${NOMES_PLANTAS[ala]}" para a imagem original do projeto? A imagem enviada e o histórico dela serão removidos.`,
            confirmarRestaurar
        );
    }

    async function confirmarRestaurar() {
        const ala = el.alvo.value;

        try {
            await PlantasStorage.remover(ala);
            await PlantasStorage.aplicarAla(plantas, ala);
        } catch (erro) {
            console.error("AccessMap: falha ao restaurar a imagem original.", erro);
            mostrarErro("Não foi possível restaurar a imagem original. Tente novamente.");
            return;
        }

        if (ala === alaAtual) atualizarPlantaDeFundo();

        fecharModal();
        mostrarStatus(`"${NOMES_PLANTAS[ala]}" voltou para a imagem original.`);
    }

    function pedirConfirmacaoVoltar() {
        const ala = el.alvo.value;
        abrirConfirmacao(
            "Voltar ao mapa anterior",
            `Tem certeza que deseja voltar "${NOMES_PLANTAS[ala]}" para o mapa anterior? A imagem que está em uso agora será descartada.`,
            confirmarVoltar
        );
    }

    async function confirmarVoltar() {
        const ala = el.alvo.value;

        try {
            await PlantasStorage.voltarAnterior(ala);
            await PlantasStorage.aplicarAla(plantas, ala);
        } catch (erro) {
            console.error("AccessMap: falha ao voltar ao mapa anterior.", erro);
            mostrarErro("Não foi possível voltar ao mapa anterior. Tente novamente.");
            return;
        }

        if (ala === alaAtual) atualizarPlantaDeFundo();

        fecharModal();
        mostrarStatus(`"${NOMES_PLANTAS[ala]}" voltou para o mapa anterior.`);
    }

    // Mensagem fora do modal (leitores de tela anunciam por causa do aria-live)
    function mostrarStatus(texto) {
        el.status.textContent = texto;
    }

    mapaPronto.then(iniciar);
})();
