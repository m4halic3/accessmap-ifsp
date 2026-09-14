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

    mapa.on("click", (e) => {
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

function renderizarListaAdmin() {
    const container = document.getElementById("lista-lugares-admin");
    if (!container) return;
    container.innerHTML = "";

    lugares.forEach((lugar, indice) => {
        const item = document.createElement("div");
        item.className = "item-lugar-admin";

        const info = document.createElement("div");
        info.className = "item-lugar-admin-info";
        info.innerHTML = `<p>${lugar.nome}</p><span>Ponto de Interesse</span>`;
        info.onclick = () => focarNoLugar(lugar);

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
        item.appendChild(btnEditar);
        container.appendChild(item);
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

    const dados = {
        nome,
        tipo,
        categoria: blocoPai || "geral",
        andar: alaAtual === "todos" ? "terreo" : "subsolo",
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

    fecharFormulario();
    renderizarListaAdmin();
    aplicarFiltrosCombinados();
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
    lugares.splice(indiceEmEdicao, 1);
    fecharFormulario();
    renderizarListaAdmin();
    aplicarFiltrosCombinados();
}

function ligarEventosAdmin() {
    document.getElementById("btn-novo-local").onclick = () => abrirFormulario();
    document.getElementById("btn-fechar-form").onclick = fecharFormulario;
    document.getElementById("btn-salvar-local").onclick = salvarLocal;
    document.getElementById("btn-excluir-local").onclick = excluirLocal;

    document.getElementById("overlay-confirmacao").addEventListener("click", (e) => {
        if (e.target.id === "overlay-confirmacao") {
            document.getElementById("btn-confirmar-cancelar").click();
        }
    });
}

window.addEventListener("load", iniciarAdmin);

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