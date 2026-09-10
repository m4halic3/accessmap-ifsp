/* ==========================================================================
   ADMIN — Inserir / Atualizar / Excluir locais
   --------------------------------------------------------------------------
   Este arquivo DEPENDE do mapa.js já ter sido carregado antes dele na
   página (precisa vir depois de <script src="assets/js/mapa.js">).
   Ele reaproveita as variáveis e funções globais que o mapa.js já define:
   `lugares`, `mapa`, `alaAtual`, `filtroAtual`, `primeiraInicializacao`,
   `aplicarFiltrosCombinados()`, `focarNoLugar()`.

   Funciona em dois contextos:
   - admin-locais.html: o painel de admin fica sempre ativo
     (a página tem <body data-admin="sempre">).
   - mapa.html (página pública): o painel só aparece se a URL tiver
     ?admin=1 (ex: mapa.html?admin=1) — pensado como um jeito simples de
     alternar entre "modo visitante" e "modo admin" sem precisar de login
     de verdade ainda. Quando isso existir de verdade (backend/login),
     é só trocar essa checagem por algo como "usuarioLogado.isAdmin".
   ========================================================================== */

const modoAdmin =
    document.body.dataset.admin === "sempre" ||
    new URLSearchParams(window.location.search).get("admin") === "1";

// Mapeia o valor salvo em bloco_pai para o texto mostrado no <select>
const OPCOES_BLOCO = [
    { valor: "", texto: "Nenhum (área externa)" },
    { valor: "informatica", texto: "Bloco A" },
    { valor: "mecanica", texto: "Bloco B" },
    { valor: "edificacoes", texto: "Bloco C" },
    { valor: "administrativo", texto: "Bloco D" }
];

let indiceEmEdicao = null; // índice em `lugares` sendo editado; null = criando um novo
let coordsClicadas = null; // { x, y } do último clique no mapa, em modo admin

function iniciarAdmin() {
    if (!modoAdmin) return; // nada do admin roda pro visitante comum

    document.querySelectorAll(".somente-admin").forEach(el => el.classList.remove("somente-admin-oculto"));
    const decoracao = document.querySelector(".sidebar-decoracao");
    if (decoracao) decoracao.style.display = "none";

    popularSelectBlocos();
    renderizarListaAdmin();
    ligarEventosAdmin();

    // Mostra todos os pontos de cara — o admin precisa ver tudo pra gerenciar,
    // diferente do visitante comum que só vê algo depois de buscar/filtrar.
    primeiraInicializacao = false;
    aplicarFiltrosCombinados();

    // Escuta cliques no mapa pra capturar a coordenada em modo admin
    // (o mapa.js já tem o dele próprio pra console.log — os dois convivem numa boa).
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

    const blocoPai = document.getElementById("form-bloco").value;
    const acessivel = document.getElementById("form-acessivel").checked;
    const alerta = document.getElementById("form-alerta").checked;
    // "Alerta" e "Acessível" são simplificações do campo `tipo` original
    // (que também tem "auditiva") — dá pra trocar os checkboxes por um
    // <select> com as 3 opções depois, se precisar cobrir isso também.
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

function excluirLocal() {
    if (indiceEmEdicao === null) return;
    const nomeLocal = lugares[indiceEmEdicao].nome;
    if (!confirm(`Tem certeza que quer excluir "${nomeLocal}"? Essa ação não pode ser desfeita.`)) return;

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

    // Fecha o formulário clicando fora do card, sem fechar sem querer
    // ao clicar dentro dele
    document.getElementById("overlay-form").addEventListener("click", (e) => {
        if (e.target.id === "overlay-form") fecharFormulario();
    });
}

// mapa.js usa `window.onload = initMap`. Aqui usamos addEventListener
// (em vez de reatribuir window.onload) justamente pra não sobrescrever
// esse listener — os dois rodam, initMap primeiro, iniciarAdmin depois.
window.addEventListener("load", iniciarAdmin);