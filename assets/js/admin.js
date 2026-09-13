/* ==========================================================================
   ADMIN — Inserir / Atualizar / Excluir locais
   --------------------------------------------------------------------------
   Este arquivo DEPENDE de dados-lugares.js e mapa.js já terem sido
   carregados antes dele na página, nessa ordem:
   <script src="assets/js/dados-lugares.js">
   <script src="assets/js/mapa.js">
   <script src="assets/js/admin.js">

   Ele reaproveita as variáveis e funções globais que mapa.js/dados-lugares.js
   já definem: `lugares`, `mapa`, `alaAtual`, `filtroAtual`,
   `primeiraInicializacao`, `aplicarFiltrosCombinados()`, `focarNoLugar()`.

   admin.html é a MESMA tela de mapa.html (mesmo mapa, mesmos filtros,
   mesma lista lateral). A diferença é só que aqui o modo admin está
   sempre ativo (data-admin="sempre"), o que faz este arquivo:
   - trocar a renderização da lista lateral para renderizarListaAdmin()
     (com o lápis de editar ao lado de cada local);
   - liberar o botão "Adicionar novo local";
   - abrir o formulário de inserir/editar ao clicar no lápis;
   - exigir confirmação antes de salvar ou excluir qualquer local.

   Antes de qualquer inserção, atualização ou exclusão de local, o admin
   passa por uma confirmação (abrirConfirmacao), como uma segunda etapa
   explícita antes de alterar os dados.
   ========================================================================== */

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
        coordsClicadas = {
            x: Math.round(e.latlng.lng),
            y: Math.round(e.latlng.lat)
        };
        const painelAberto = !document.getElementById("overlay-form").classList.contains("oculto");
        if (painelAberto) {
            document.getElementById("form-coords").textContent =
                `X: ${coordsClicadas.x}px, Y: ${coordsClicadas.y}px (clique em "Auto" pra confirmar)`;
        }
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

function abrirFormulario(lugar = null, indice = null) {
    indiceEmEdicao = indice;
    coordsClicadas = lugar ? { x: lugar.x, y: lugar.y } : null;

    document.getElementById("form-titulo").textContent = lugar ? "Atualizar Local" : "Inserir Local";
    document.getElementById("form-nome").value = lugar ? lugar.nome : "";
    document.getElementById("form-coords").textContent = lugar
        ? `X: ${lugar.x}px, Y: ${lugar.y}px`
        : "X: —, Y: —";
    document.getElementById("form-bloco").value = lugar ? (lugar.bloco_pai || "") : "";
    document.getElementById("form-acessivel").checked = !!lugar && lugar.tipo === "fisica";
    document.getElementById("form-alerta").checked = !!lugar && lugar.tipo === "alerta";

    document.getElementById("btn-excluir-local").classList.toggle("oculto", lugar === null);
    document.getElementById("overlay-form").classList.remove("oculto");
    document.getElementById("form-nome").focus();
}

function fecharFormulario() {
    document.getElementById("overlay-form").classList.add("oculto");
    indiceEmEdicao = null;
    coordsClicadas = null;
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
        alert('Clique em um ponto do mapa e depois em "Auto" pra definir a posição.');
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

    document.getElementById("btn-auto-coords").onclick = () => {
        if (!coordsClicadas) {
            alert("Clique em um ponto do mapa primeiro.");
            return;
        }
        document.getElementById("form-coords").textContent =
            `X: ${coordsClicadas.x}px, Y: ${coordsClicadas.y}px`;
    };

    document.getElementById("overlay-form").addEventListener("click", (e) => {
        if (e.target.id === "overlay-form") fecharFormulario();
    });
}

window.addEventListener("load", iniciarAdmin);