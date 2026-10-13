const modoAdmin =
    document.body.dataset.admin === "sempre" ||
    new URLSearchParams(window.location.search).get("admin") === "1";

const OPCOES_BLOCO = [
    { valor: "", texto: "Nenhum (área externa)" },
    { valor: "informatica", texto: "Bloco A" },
    { valor: "mecanica", texto: "Bloco B" },
    { valor: "edificacoes", texto: "Bloco C" },
    { valor: "administrativo", texto: "Bloco D" }
];

let indiceEmEdicao = null;
let coordsClicadas = null;
let elementoComFocoAntesDoModal = null;
let marcadorTemporario = null;

// Modo "Reposicionar": o admin escolhe um ponto na lista e clica no mapa
// para dizer onde ele fica agora (útil quando a imagem do mapa muda).
// null = desligado; senão { lugar, ala, original: {x, y} }
let modoReposicionar = null;
let marcadorPosicaoAntiga = null;

function iniciarAdmin() {
    if (!modoAdmin) return;

    document.querySelectorAll(".somente-admin").forEach(el => el.classList.remove("somente-admin-oculto"));
    const decoracao = document.querySelector(".sidebar-decoracao");
    if (decoracao) decoracao.style.display = "none";

    popularSelectBlocos();
    renderizarListaAdmin();
    ligarEventosAdmin();

    primeiraInicializacao = false;
    aplicarFiltrosCombinados();

    // Trocar de mapa (aba) no meio do reposicionamento cancela o modo,
    // porque o ponto escolhido pertence ao mapa que estava aberto.
    const filtrarAlaOriginal = filtrarAla;
    window.filtrarAla = function () {
        cancelarReposicionar();
        return filtrarAlaOriginal.apply(this, arguments);
    };
    const resetarMapaOriginal = resetarMapaCompleto;
    window.resetarMapaCompleto = function () {
        cancelarReposicionar();
        return resetarMapaOriginal.apply(this, arguments);
    };

    mapa.on("click", (e) => {
        if (modoReposicionar) {
            aoClicarMapaReposicionando(e);
            return;
        }

        const coords = {
            x: Math.round(e.latlng.lng),
            y: Math.round(e.latlng.lat)
        };

        const painelAberto = !document.getElementById("overlay-form").classList.contains("oculto");

        if (!painelAberto) {
            // Nenhum formulário aberto: o clique já inicia a inserção nesse ponto
            abrirFormulario(null, null, coords);
            return;
        }

        // Painel já aberto (inserindo ou editando): só reposiciona o ponto
        coordsClicadas = coords;
        atualizarTextoCoords();
        mostrarMarcadorTemporario();
    });
}

function popularSelectBlocos() {
    const select = document.getElementById("form-bloco");
    if (!select) return;
    select.innerHTML = "";
    OPCOES_BLOCO.forEach(op => {
        const opt = document.createElement("option");
        opt.value = op.valor;
        opt.textContent = op.texto;
        select.appendChild(opt);
    });
}

// -----------------------------------------------------------------------
// Lista lateral do admin: mostra TODOS os pontos de interesse cadastrados,
// agrupados pelo mapa a que pertencem (Mapa Geral, Subsolo Edificações,
// Subsolo Mecânica), sem restrição de ala/andar/subponto — no admin faz
// sentido encontrar (e poder editar/reposicionar) qualquer local do
// sistema, mesmo um que pertença a uma planta diferente da aberta agora.
//
// Como são muitos pontos, há um campo próprio para filtrar a lista
// (#busca-lista-admin) e um contador "Mostrando X de Y". A busca do topo
// da barra lateral continua filtrando a lista também; quando os dois
// campos têm texto, o ponto precisa combinar com os dois.
// -----------------------------------------------------------------------
const GRUPOS_LISTA_ADMIN = [
    { ala: "todos", titulo: "Mapa Geral" },
    { ala: "edificacoes", titulo: "Subsolo Edificações" },
    { ala: "mecanica", titulo: "Subsolo Mecânica" },
    { ala: null, titulo: "Outros" }
];

const ROTULOS_TIPO_LISTA_ADMIN = {
    fisica: "Acessibilidade física",
    auditiva: "Acessibilidade auditiva",
    alerta: "Alerta",
    geral: "Ponto de interesse"
};

function termoNormalizado(idCampo) {
    const campo = document.getElementById(idCampo);
    return campo ? normalizarTexto(campo.value) : "";
}

function obterLugaresParaListaAdmin() {
    const termos = [termoNormalizado("busca-lista-admin"), termoNormalizado("search-input")]
        .filter(Boolean);

    if (termos.length === 0) return [...lugares];

    return lugares.filter((l) => {
        const nome = normalizarTexto(l.nome);
        return termos.every((t) => nome.includes(t));
    });
}

function criarItemListaAdmin(lugar) {
    const indice = lugares.indexOf(lugar);

    const item = document.createElement("div");
    item.className = "item-lugar-admin";

    const info = document.createElement("div");
    info.className = "item-lugar-admin-info";
    const nome = document.createElement("p");
    nome.textContent = lugar.nome;
    nome.title = lugar.nome;
    const tipo = document.createElement("span");
    tipo.textContent = ROTULOS_TIPO_LISTA_ADMIN[lugar.tipo] || "Ponto de interesse";
    info.appendChild(nome);
    info.appendChild(tipo);
    info.onclick = () => focarNoLugar(lugar);

    const btnReposicionar = document.createElement("button");
    btnReposicionar.type = "button";
    btnReposicionar.className = "btn-editar-local btn-reposicionar-local";
    btnReposicionar.setAttribute("aria-label", `Reposicionar ${lugar.nome} no mapa`);
    btnReposicionar.title = "Reposicionar no mapa";
    btnReposicionar.innerHTML = '<i class="fas fa-crosshairs" aria-hidden="true"></i>';
    btnReposicionar.onclick = (ev) => {
        ev.stopPropagation();
        iniciarReposicionar(lugar);
    };

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-editar-local";
    btnEditar.setAttribute("aria-label", `Editar ${lugar.nome}`);
    btnEditar.innerHTML = '<i class="fas fa-pencil-alt" aria-hidden="true"></i>';
    btnEditar.onclick = (ev) => {
        ev.stopPropagation();
        abrirFormulario(lugar, indice);
    };

    item.appendChild(info);
    item.appendChild(btnReposicionar);
    item.appendChild(btnEditar);
    return item;
}

function renderizarListaAdmin() {
    const container = document.getElementById("lista-lugares-admin");
    if (!container) return;
    container.innerHTML = "";

    const listaParaExibir = obterLugaresParaListaAdmin();

    const contador = document.getElementById("contador-lista-admin");
    if (contador) {
        contador.textContent = listaParaExibir.length === lugares.length
            ? `${lugares.length} pontos de interesse`
            : `Mostrando ${listaParaExibir.length} de ${lugares.length} pontos`;
    }

    if (listaParaExibir.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "lista-admin-vazia";
        vazio.textContent = "Nenhum ponto encontrado. Tente outro nome.";
        container.appendChild(vazio);
        return;
    }

    GRUPOS_LISTA_ADMIN.forEach((grupo) => {
        const doGrupo = listaParaExibir.filter((l) => {
            const ala = PlantasStorage.alaDoLugar(l);
            return grupo.ala === null
                ? !GRUPOS_LISTA_ADMIN.some((g) => g.ala !== null && g.ala === ala)
                : ala === grupo.ala;
        });
        if (doGrupo.length === 0) return;

        const titulo = document.createElement("h3");
        titulo.className = "grupo-lista-admin";
        titulo.textContent = `${grupo.titulo} (${doGrupo.length})`;
        container.appendChild(titulo);

        doGrupo.forEach((lugar) => container.appendChild(criarItemListaAdmin(lugar)));
    });
}

// -----------------------------------------------------------------------
// Rótulo do campo "Bloco / Setor". Quando o admin está inserindo um local
// direto dentro de um subsolo (Subsolo Mec. / Subsolo Edif.), o campo fica
// travado no bloco daquela ala — não dá pra escolher outro bloco enquanto
// se está fisicamente naquela planta, senão o local nasce com bloco_pai e
// andar inconsistentes entre si e nunca aparece em nenhuma aba do mapa.
// -----------------------------------------------------------------------
function atualizarLabelBloco(travado, nomeBlocoTravado) {
    const label = document.querySelector('label[for="form-bloco"]');
    if (!label) return;
    label.textContent = travado
        ? `Bloco / Setor (fixo: ${nomeBlocoTravado})`
        : "Bloco / Setor";
}

function abrirFormulario(lugar = null, indice = null, coordsForcadas = null) {
    cancelarReposicionar();
    indiceEmEdicao = indice;
    coordsClicadas = lugar ? { x: lugar.x, y: lugar.y } : coordsForcadas;

    document.getElementById("form-titulo").textContent = lugar ? "Atualizar Local" : "Inserir Local";
    document.getElementById("form-nome").value = lugar ? lugar.nome : "";
    atualizarTextoCoords();

    const selectBloco = document.getElementById("form-bloco");

    if (!lugar && alaAtual !== "todos") {
        // Inserindo direto num subsolo: trava o bloco pra bater com a ala aberta,
        // evitando bloco_pai/andar inconsistentes.
        selectBloco.value = alaAtual;
        selectBloco.disabled = true;
        const opcaoAtual = OPCOES_BLOCO.find(op => op.valor === alaAtual);
        atualizarLabelBloco(true, opcaoAtual ? opcaoAtual.texto : alaAtual);
    } else {
        selectBloco.value = lugar ? (lugar.bloco_pai || "") : "";
        selectBloco.disabled = false;
        atualizarLabelBloco(false);
    }

    document.getElementById("form-acessivel").checked = !!lugar && lugar.tipo === "fisica";
    document.getElementById("form-alerta").checked = !!lugar && lugar.tipo === "alerta";

    document.getElementById("btn-excluir-local").classList.toggle("oculto", lugar === null);
    document.getElementById("overlay-form").classList.remove("oculto");
    document.getElementById("form-nome").focus();

    mostrarMarcadorTemporario();
}

function fecharFormulario() {
    document.getElementById("overlay-form").classList.add("oculto");
    indiceEmEdicao = null;
    coordsClicadas = null;
    limparMarcadorTemporario();

    // Restaura o select pro estado padrão (destravado) pra próxima abertura
    const selectBloco = document.getElementById("form-bloco");
    selectBloco.disabled = false;
    atualizarLabelBloco(false);
}

function atualizarTextoCoords() {
    const el = document.getElementById("form-coords");
    el.textContent = coordsClicadas
        ? `X: ${coordsClicadas.x}px, Y: ${coordsClicadas.y}px`
        : "Clique no mapa para marcar a posição";
}

function mostrarMarcadorTemporario() {
    limparMarcadorTemporario();
    if (!coordsClicadas) return;
    marcadorTemporario = L.circleMarker([coordsClicadas.y, coordsClicadas.x], {
        radius: 9,
        color: "#ff5900",
        weight: 3,
        fillColor: "#fff",
        fillOpacity: 0.9
    }).addTo(mapa);
}

function limparMarcadorTemporario() {
    if (marcadorTemporario) {
        mapa.removeLayer(marcadorTemporario);
        marcadorTemporario = null;
    }
}

// ---------- Modal de confirmação genérico ----------
function abrirConfirmacao(titulo, texto, aoConfirmar) {
    const overlay = document.getElementById("overlay-confirmacao");
    const tituloEl = document.getElementById("confirm-titulo");
    const textoEl = document.getElementById("confirm-texto");
    const btnOk = document.getElementById("btn-confirmar-ok");
    const btnCancelar = document.getElementById("btn-confirmar-cancelar");

    tituloEl.textContent = titulo;
    textoEl.textContent = texto;

    elementoComFocoAntesDoModal = document.activeElement;

    overlay.classList.remove("oculto");
    overlay.setAttribute("aria-hidden", "false");
    btnCancelar.focus();

    function limpar() {
        overlay.classList.add("oculto");
        overlay.setAttribute("aria-hidden", "true");
        btnOk.removeEventListener("click", onConfirmar);
        btnCancelar.removeEventListener("click", onCancelar);
        overlay.removeEventListener("keydown", onKeydown);
        if (elementoComFocoAntesDoModal) elementoComFocoAntesDoModal.focus();
    }

    function onConfirmar() {
        limpar();
        aoConfirmar();
    }

    function onCancelar() {
        limpar();
    }

    function onKeydown(e) {
        if (e.key === "Escape") {
            onCancelar();
            return;
        }
        if (e.key === "Tab") {
            const focaveis = [btnCancelar, btnOk];
            const indice = focaveis.indexOf(document.activeElement);
            e.preventDefault();
            if (e.shiftKey) {
                focaveis[(indice - 1 + focaveis.length) % focaveis.length].focus();
            } else {
                focaveis[(indice + 1) % focaveis.length].focus();
            }
        }
    }

    btnOk.addEventListener("click", onConfirmar);
    btnCancelar.addEventListener("click", onCancelar);
    overlay.addEventListener("keydown", onKeydown);
}

// ---------- Salvar (com confirmação antes) ----------
function salvarLocal() {
    const nome = document.getElementById("form-nome").value.trim();

    if (!nome) {
        alert('Digite um nome pro local antes de salvar.');
        return;
    }
    if (!coordsClicadas) {
        alert('Clique em um ponto do mapa pra definir a posição.');
        return;
    }

    const acao = indiceEmEdicao !== null ? "atualizar" : "adicionar";
    abrirConfirmacao(
        indiceEmEdicao !== null ? "Atualizar local" : "Adicionar local",
        `Tem certeza que deseja ${acao} o local "${nome}"?`,
        confirmarSalvarLocal
    );
}

function confirmarSalvarLocal() {
    const nome = document.getElementById("form-nome").value.trim();
    const blocoPai = document.getElementById("form-bloco").value;
    const acessivel = document.getElementById("form-acessivel").checked;
    const alerta = document.getElementById("form-alerta").checked;
    const tipo = alerta ? "alerta" : (acessivel ? "fisica" : "geral");

    // Ao editar, o ponto mantém o andar em que já estava (mesmo que a busca
    // o tenha trazido de outro mapa); só pontos novos usam o mapa aberto.
    const lugarOriginal = indiceEmEdicao !== null ? lugares[indiceEmEdicao] : null;
    const alaAntes = lugarOriginal ? PlantasStorage.alaDoLugar(lugarOriginal) : null;

    const dados = {
        nome,
        tipo,
        categoria: blocoPai || "geral",
        andar: lugarOriginal ? lugarOriginal.andar : (alaAtual === "todos" ? "terreo" : "subsolo"),
        y: coordsClicadas.y,
        x: coordsClicadas.x,
        subponto: !!blocoPai
    };
    if (blocoPai) dados.bloco_pai = blocoPai;

    if (indiceEmEdicao !== null) {
        lugares[indiceEmEdicao] = { ...lugares[indiceEmEdicao], ...dados };
    } else {
        lugares.push(dados);
    }

    const alaDepois = PlantasStorage.alaDoLugar(
        indiceEmEdicao !== null ? lugares[indiceEmEdicao] : dados
    );

    fecharFormulario();
    renderizarListaAdmin();
    aplicarFiltrosCombinados();
    persistirPontos([alaAntes, alaDepois]);
}

// ---------- Excluir (com confirmação antes) ----------
function excluirLocal() {
    if (indiceEmEdicao === null) return;
    const nomeLocal = lugares[indiceEmEdicao].nome;

    abrirConfirmacao(
        "Excluir local",
        `Tem certeza que quer excluir "${nomeLocal}"? Essa ação não pode ser desfeita.`,
        confirmarExcluirLocal
    );
}

function confirmarExcluirLocal() {
    const alaDoExcluido = PlantasStorage.alaDoLugar(lugares[indiceEmEdicao]);
    lugares.splice(indiceEmEdicao, 1);
    fecharFormulario();
    renderizarListaAdmin();
    aplicarFiltrosCombinados();
    persistirPontos([alaDoExcluido]);
}

// ---------- Persistência dos pontos (IndexedDB) ----------
// Mensagem fora dos modais (a região aria-live fica na barra lateral)
function avisarAdmin(texto) {
    const el = document.getElementById("planta-status");
    if (el) el.textContent = texto;
}

// Salva a lista de pontos de cada mapa citado, para o mapa público enxergar
// as mudanças e para o "Voltar ao mapa anterior" poder restaurá-las.
async function persistirPontos(alas) {
    const unicas = [...new Set(alas.filter(Boolean))];
    try {
        for (const ala of unicas) {
            await PlantasStorage.salvarPontos(ala, lugares);
        }
    } catch (erro) {
        console.error("AccessMap: falha ao salvar os pontos de interesse.", erro);
        avisarAdmin("A alteração aparece na tela, mas não foi possível salvá-la neste navegador. Ela se perde ao recarregar a página.");
        return false;
    }
    return true;
}

// ---------- Reposicionar um ponto clicando no mapa ----------
function mostrarBannerReposicionar(texto) {
    const banner = document.getElementById("banner-reposicionar");
    document.getElementById("banner-reposicionar-texto").textContent = texto;
    banner.hidden = false;
}

function iniciarReposicionar(lugar) {
    cancelarReposicionar();
    if (!document.getElementById("overlay-form").classList.contains("oculto")) {
        fecharFormulario();
    }

    // Vai para o mapa em que esse ponto está (o clique só faz sentido nele)
    const ala = PlantasStorage.alaDoLugar(lugar) || alaAtual;
    if (ala !== alaAtual) {
        const botaoAla = document.querySelector(`#seletor-alas .btn-type[onclick*="'${ala}'"]`);
        if (botaoAla) filtrarAla(ala, botaoAla);
    }

    modoReposicionar = { lugar, ala, original: { x: lugar.x, y: lugar.y } };

    marcadorPosicaoAntiga = L.circleMarker([lugar.y, lugar.x], {
        radius: 11,
        color: "#555555",
        weight: 2,
        dashArray: "4 4",
        fillColor: "#999999",
        fillOpacity: 0.25,
        interactive: false
    }).addTo(mapa);
    marcadorPosicaoAntiga.bindTooltip("Posição antiga", { permanent: true, direction: "top", offset: [0, -8] });

    mapa.panTo([lugar.y, lugar.x]);
    document.getElementById("map").classList.add("modo-reposicionar");
    mostrarBannerReposicionar(
        `Reposicionando "${lugar.nome}": clique no mapa onde este local fica na imagem atual. ` +
        "O círculo tracejado mostra a posição antiga."
    );
    document.addEventListener("keydown", aoPressionarTeclaReposicionar);
}

function encerrarModoReposicionar() {
    modoReposicionar = null;
    coordsClicadas = null;
    limparMarcadorTemporario();
    if (marcadorPosicaoAntiga) {
        mapa.removeLayer(marcadorPosicaoAntiga);
        marcadorPosicaoAntiga = null;
    }
    document.getElementById("map").classList.remove("modo-reposicionar");
    document.getElementById("banner-reposicionar").hidden = true;
    document.removeEventListener("keydown", aoPressionarTeclaReposicionar);
}

function cancelarReposicionar() {
    if (modoReposicionar) encerrarModoReposicionar();
}

function aoPressionarTeclaReposicionar(e) {
    if (e.key !== "Escape") return;
    // Se a confirmação está aberta, o Escape fecha só ela
    const confirmacaoAberta = !document.getElementById("overlay-confirmacao").classList.contains("oculto");
    if (!confirmacaoAberta) cancelarReposicionar();
}

function aoClicarMapaReposicionando(e) {
    const planta = plantas[alaAtual];
    const coords = {
        x: Math.round(e.latlng.lng),
        y: Math.round(e.latlng.lat)
    };

    if (coords.x < 0 || coords.y < 0 || coords.x > planta.largura || coords.y > planta.altura) {
        mostrarBannerReposicionar(
            `Esse clique ficou fora da imagem do mapa. Clique dentro da imagem para posicionar "${modoReposicionar.lugar.nome}".`
        );
        return;
    }

    coordsClicadas = coords;
    mostrarMarcadorTemporario();

    const { lugar, original } = modoReposicionar;
    abrirConfirmacao(
        "Reposicionar local",
        `Mover "${lugar.nome}" para a posição clicada (X: ${coords.x}px, Y: ${coords.y}px)? ` +
        `A posição antiga (X: ${original.x}px, Y: ${original.y}px) será substituída.`,
        () => confirmarReposicionar(coords)
    );
}

async function confirmarReposicionar(coords) {
    if (!modoReposicionar) return;
    const { lugar, ala } = modoReposicionar;

    lugar.x = coords.x;
    lugar.y = coords.y;

    encerrarModoReposicionar();
    renderizarListaAdmin();
    aplicarFiltrosCombinados();
    focarNoLugar(lugar);

    const salvou = await persistirPontos([ala]);
    if (salvou) {
        avisarAdmin(`"${lugar.nome}" foi movido para X: ${coords.x}px, Y: ${coords.y}px.`);
    }
}

function ligarEventosAdmin() {
    document.getElementById("btn-cancelar-reposicionar").onclick = cancelarReposicionar;
    document.getElementById("btn-novo-local").onclick = () => abrirFormulario();
    document.getElementById("btn-fechar-form").onclick = fecharFormulario;
    document.getElementById("btn-salvar-local").onclick = salvarLocal;
    document.getElementById("btn-excluir-local").onclick = excluirLocal;

    document.getElementById("overlay-confirmacao").addEventListener("click", (e) => {
        if (e.target.id === "overlay-confirmacao") {
            document.getElementById("btn-confirmar-cancelar").click();
        }
    });

    // A busca já dispara aplicarFiltrosCombinados() a cada tecla (via
    // listener registrado em mapa.js); aqui só garantimos que a lista
    // lateral do admin também reaja em tempo real ao que for digitado.
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", renderizarListaAdmin);
    }

    // Campo próprio para filtrar só a lista de pontos (não mexe no mapa)
    const buscaLista = document.getElementById("busca-lista-admin");
    if (buscaLista) {
        buscaLista.addEventListener("input", renderizarListaAdmin);
    }
}

// O mapa agora é criado de forma assíncrona (mapa.js); espera ele ficar pronto.
mapaPronto.then(iniciarAdmin);

/* =========================================================
   ACESSIBILIDADE: FONTE E CONTRASTE
   ========================================================= */
let nivelFonte = 0;
const maxNivel = 3;
const minNivel = -2;

function mudarFonte(direcao) {
    const novoNivel = nivelFonte + direcao;

    if (novoNivel > maxNivel || novoNivel < minNivel) return;

    nivelFonte = novoNivel;
    const htmlElement = document.documentElement;

    switch (nivelFonte) {
        case 0:
            htmlElement.style.fontSize = "100%";
            break;
        case 1:
            htmlElement.style.fontSize = "110%";
            break;
        case 2:
            htmlElement.style.fontSize = "120%";
            break;
        case 3:
            htmlElement.style.fontSize = "130%";
            break;
        case -1:
            htmlElement.style.fontSize = "90%";
            break;
        case -2:
            htmlElement.style.fontSize = "80%";
            break;
    }
}

function toggleContraste() {
    document.body.classList.toggle("alto-contraste");

    const estadoAtivo = document.body.classList.contains("alto-contraste");
    localStorage.setItem("altoContrasteState", estadoAtivo);
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("altoContrasteState") === "true") {
        document.body.classList.add("alto-contraste");
    }
});