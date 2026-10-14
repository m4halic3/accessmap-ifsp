/* =========================================================
   ADMIN - INSERIR / EDITAR / EXCLUIR LOCAIS DO MAPA
   -----------------------------------------------------------
   Depende de mapa.js (carregado antes): usa `lugares`, `mapa`,
   `alaAtual`, `mapaPronto` e as funções de filtro/foco de lá.
   As alterações são salvas com salvarLugares() (localStorage).
   ========================================================= */
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
let elementoComFocoAntesDoPainel = null;
let marcadorTemporario = null;

function painelFormAberto() {
    return !document.getElementById("painel-form").classList.contains("oculto");
}

function iniciarAdmin() {
    if (!modoAdmin) return;

    popularSelectBlocos();
    renderizarListaAdmin();
    ligarEventosAdmin();
    atualizarBotaoRestaurarLocais();

    primeiraInicializacao = false;
    aplicarFiltrosCombinados();

    mapa.on("click", (e) => {
        const coords = {
            x: Math.round(e.latlng.lng),
            y: Math.round(e.latlng.lat)
        };

        if (!painelFormAberto()) {
            // Nenhum formulário aberto: o clique já inicia a inserção nesse ponto
            abrirFormulario(null, null, coords);
            return;
        }

        // Painel já aberto (inserindo ou editando): só reposiciona o ponto
        coordsClicadas = coords;
        atualizarTextoCoords();
        mostrarMarcadorTemporario();
        mostrarErroForm("");
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

// Planta em que o local aparece (subsolos têm planta própria)
function alaDoLugarAdmin(lugar) {
    return lugar.andar === "subsolo" && plantas[lugar.bloco_pai] ? lugar.bloco_pai : "todos";
}

// Troca para a planta certa (se precisar) e foca o local
function irParaLugar(lugar) {
    const ala = alaDoLugarAdmin(lugar);
    if (ala !== alaAtual) filtrarAla(ala);
    focarNoLugar(lugar);
}

// -----------------------------------------------------------------------
// Lista lateral do admin: sem busca mostra só os locais principais
// (subponto: false), para não poluir a barra lateral com centenas de
// salas. Com busca, procura em TODO o array `lugares`, de qualquer
// planta — no admin faz sentido poder encontrar e editar qualquer local.
// -----------------------------------------------------------------------
function obterLugaresParaListaAdmin() {
    const termo = termoDeBuscaAtual();
    if (termo) {
        return lugares.filter(l => normalizarBusca(l.nome).includes(termo));
    }
    return lugares.filter(l => l.subponto === false);
}

function renderizarListaAdmin() {
    const container = document.getElementById("lista-lugares-admin");
    if (!container) return;
    container.innerHTML = "";

    const listaParaExibir = obterLugaresParaListaAdmin();

    if (listaParaExibir.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "lista-vazia-admin";
        vazio.textContent = "Nenhum local encontrado. Para cadastrar um novo, clique no ponto desejado do mapa.";
        container.appendChild(vazio);
        return;
    }

    listaParaExibir.forEach((lugar) => {
        const indice = lugares.indexOf(lugar);

        const item = document.createElement("div");
        item.className = "item-lugar-admin";

        const info = document.createElement("button");
        info.type = "button";
        info.className = "item-lugar-admin-info com-selo";
        info.setAttribute("aria-label", `Ver ${lugar.nome} no mapa`);
        info.innerHTML = `${seloDoLugar(lugar)}<span class="item-lugar-texto"><p>${escaparHtml(lugar.nome)}</p><span>${descricaoDoTipo(lugar)}</span></span>`;
        info.addEventListener("click", () => irParaLugar(lugar));

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn-editar-local";
        btnEditar.setAttribute("aria-label", `Editar ${lugar.nome}`);
        btnEditar.title = "Editar";
        btnEditar.innerHTML = '<i class="fas fa-pencil-alt" aria-hidden="true"></i>';
        btnEditar.addEventListener("click", () => {
            irParaLugar(lugar);
            abrirFormulario(lugar, indice);
        });

        item.appendChild(info);
        item.appendChild(btnEditar);
        container.appendChild(item);
    });
}

// -----------------------------------------------------------------------
// Rótulo do campo "Bloco / Setor". Ao inserir um local direto num
// subsolo, o campo fica travado no bloco daquela ala — senão o local
// nasce com bloco_pai e andar inconsistentes e não aparece em nenhuma aba.
// -----------------------------------------------------------------------
function atualizarLabelBloco(travado, nomeBlocoTravado) {
    const label = document.querySelector('label[for="form-bloco"]');
    if (!label) return;
    label.textContent = travado
        ? `Bloco / Setor (fixo: ${nomeBlocoTravado})`
        : "Bloco / Setor";
}

function marcarTipo(tipo) {
    const radio = document.querySelector(`input[name="form-tipo"][value="${tipo}"]`)
        || document.querySelector('input[name="form-tipo"][value="geral"]');
    radio.checked = true;
}

function tipoSelecionado() {
    const marcado = document.querySelector('input[name="form-tipo"]:checked');
    return marcado ? marcado.value : "geral";
}

function abrirFormulario(lugar = null, indice = null, coordsForcadas = null) {
    if (!painelFormAberto()) elementoComFocoAntesDoPainel = document.activeElement;

    indiceEmEdicao = indice;
    coordsClicadas = lugar ? { x: lugar.x, y: lugar.y } : coordsForcadas;

    document.getElementById("form-titulo").textContent = lugar ? "Atualizar local" : "Inserir local";
    document.getElementById("form-nome").value = lugar ? lugar.nome : "";
    document.getElementById("btn-salvar-local").textContent = lugar ? "Salvar alterações" : "Adicionar local";
    atualizarTextoCoords();
    mostrarErroForm("");

    const selectBloco = document.getElementById("form-bloco");

    if (!lugar && alaAtual !== "todos") {
        selectBloco.value = alaAtual;
        selectBloco.disabled = true;
        const opcaoAtual = OPCOES_BLOCO.find(op => op.valor === alaAtual);
        atualizarLabelBloco(true, opcaoAtual ? opcaoAtual.texto : alaAtual);
    } else {
        selectBloco.value = lugar ? (lugar.bloco_pai || "") : "";
        selectBloco.disabled = false;
        atualizarLabelBloco(false);
    }

    marcarTipo(lugar ? lugar.tipo : "geral");

    document.getElementById("btn-excluir-local").classList.toggle("oculto", lugar === null);
    document.getElementById("painel-form").classList.remove("oculto");
    document.getElementById("form-nome").focus();

    // O painel muda a largura do mapa; o Leaflet precisa recalcular
    mapa.invalidateSize();
    mostrarMarcadorTemporario();
}

function fecharFormulario() {
    document.getElementById("painel-form").classList.add("oculto");
    indiceEmEdicao = null;
    coordsClicadas = null;
    limparMarcadorTemporario();
    mostrarErroForm("");
    mapa.invalidateSize();

    const selectBloco = document.getElementById("form-bloco");
    selectBloco.disabled = false;
    atualizarLabelBloco(false);

    const destino = elementoComFocoAntesDoPainel;
    elementoComFocoAntesDoPainel = null;
    if (destino && document.body.contains(destino) && typeof destino.focus === "function") {
        destino.focus();
    } else {
        document.getElementById("btn-novo-local").focus();
    }
}

function atualizarTextoCoords() {
    const el = document.getElementById("form-coords");
    el.textContent = coordsClicadas
        ? `X: ${coordsClicadas.x}px, Y: ${coordsClicadas.y}px`
        : "Clique no mapa para marcar a posição";
    el.closest(".coord-row").classList.toggle("sem-coords", !coordsClicadas);
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

function mostrarErroForm(texto, campo) {
    const el = document.getElementById("form-erro");
    el.textContent = texto;
    el.hidden = !texto;

    const nome = document.getElementById("form-nome");
    if (campo === "nome") {
        nome.setAttribute("aria-invalid", "true");
        nome.focus();
    } else {
        nome.removeAttribute("aria-invalid");
    }
}

// Mensagem fora do painel (anunciada por leitores de tela via aria-live)
function mostrarStatusAdmin(texto) {
    const status = document.getElementById("admin-status");
    if (!status) return;
    status.textContent = "";
    // pequeno atraso para o leitor de tela anunciar mesmo se o texto repetir
    setTimeout(() => { status.textContent = texto; }, 50);
}

// ---------- Modal de confirmação genérico ----------
// opcoes: { rotulo: texto do botão de confirmar, perigo: true para ação destrutiva }
function abrirConfirmacao(titulo, texto, aoConfirmar, opcoes = {}) {
    const overlay = document.getElementById("overlay-confirmacao");
    const tituloEl = document.getElementById("confirm-titulo");
    const textoEl = document.getElementById("confirm-texto");
    const btnOk = document.getElementById("btn-confirmar-ok");
    const btnCancelar = document.getElementById("btn-confirmar-cancelar");

    tituloEl.textContent = titulo;
    textoEl.textContent = texto;
    btnOk.textContent = opcoes.rotulo || "Confirmar";
    btnOk.classList.toggle("btn-confirm-ok--perigo", !!opcoes.perigo);

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
        overlay.removeEventListener("click", onCliqueFora);
        if (elementoComFocoAntesDoModal && document.body.contains(elementoComFocoAntesDoModal)) {
            elementoComFocoAntesDoModal.focus();
        }
    }

    function onConfirmar() {
        limpar();
        aoConfirmar();
    }

    function onCancelar() {
        limpar();
    }

    function onCliqueFora(e) {
        if (e.target === overlay) onCancelar();
    }

    function onKeydown(e) {
        if (e.key === "Escape") {
            e.stopPropagation();
            onCancelar();
            return;
        }
        if (e.key === "Tab") {
            const focaveis = [btnCancelar, btnOk];
            const indice = focaveis.indexOf(document.activeElement);
            e.preventDefault();
            const passo = e.shiftKey ? -1 : 1;
            focaveis[(indice + passo + focaveis.length) % focaveis.length].focus();
        }
    }

    btnOk.addEventListener("click", onConfirmar);
    btnCancelar.addEventListener("click", onCancelar);
    overlay.addEventListener("keydown", onKeydown);
    overlay.addEventListener("click", onCliqueFora);
}

// ---------- Salvar (com confirmação antes) ----------
function salvarLocal() {
    const nome = document.getElementById("form-nome").value.trim();

    if (!nome) {
        mostrarErroForm("Digite um nome para o local.", "nome");
        return;
    }
    if (!coordsClicadas) {
        mostrarErroForm("Clique no mapa para marcar a posição do local.");
        return;
    }
    const duplicado = lugares.some((l, i) =>
        i !== indiceEmEdicao && normalizarTexto(l.nome) === normalizarTexto(nome));
    if (duplicado) {
        mostrarErroForm(`Já existe um local chamado "${nome}". Use um nome diferente.`, "nome");
        return;
    }
    mostrarErroForm("");

    const editando = indiceEmEdicao !== null;
    abrirConfirmacao(
        editando ? "Salvar alterações" : "Adicionar local",
        editando
            ? `Salvar as alterações em "${nome}"?`
            : `Adicionar "${nome}" ao mapa?`,
        confirmarSalvarLocal,
        { rotulo: editando ? "Salvar" : "Adicionar" }
    );
}

function confirmarSalvarLocal() {
    const nome = document.getElementById("form-nome").value.trim();
    const blocoPai = document.getElementById("form-bloco").value;
    const tipo = tipoSelecionado();
    const editando = indiceEmEdicao !== null;

    let lugarSalvo;

    if (editando) {
        const original = lugares[indiceEmEdicao];
        const blocoMudou = (original.bloco_pai || "") !== blocoPai;
        lugarSalvo = {
            ...original,
            nome,
            tipo,
            x: coordsClicadas.x,
            y: coordsClicadas.y,
            // Só recalcula categoria/subponto se o bloco mudou, para não
            // perder categorias específicas (estacionamento, rampa, ...)
            categoria: blocoMudou ? (blocoPai || "geral") : original.categoria,
            subponto: blocoMudou ? !!blocoPai : original.subponto
        };
        if (blocoPai) lugarSalvo.bloco_pai = blocoPai;
        else delete lugarSalvo.bloco_pai;
        lugares[indiceEmEdicao] = lugarSalvo;
    } else {
        lugarSalvo = {
            nome,
            tipo,
            categoria: blocoPai || "geral",
            andar: getAndarDaAla(),
            y: coordsClicadas.y,
            x: coordsClicadas.x,
            subponto: !!blocoPai
        };
        if (blocoPai) lugarSalvo.bloco_pai = blocoPai;
        lugares.push(lugarSalvo);
    }

    const salvou = salvarLugares();

    fecharFormulario();
    renderizarListaAdmin();
    atualizarBotaoRestaurarLocais();
    aplicarFiltrosCombinados();
    irParaLugar(lugarSalvo);

    mostrarStatusAdmin(salvou
        ? `"${nome}" foi ${editando ? "atualizado" : "adicionado"} e salvo neste navegador.`
        : `"${nome}" foi ${editando ? "atualizado" : "adicionado"}, mas o navegador não deixou salvar: a alteração some ao recarregar a página.`);
}

// ---------- Excluir (com confirmação antes) ----------
function excluirLocal() {
    if (indiceEmEdicao === null) return;
    const nomeLocal = lugares[indiceEmEdicao].nome;

    abrirConfirmacao(
        "Excluir local",
        `Tem certeza que quer excluir "${nomeLocal}"? Essa ação não pode ser desfeita.`,
        confirmarExcluirLocal,
        { rotulo: "Excluir", perigo: true }
    );
}

function confirmarExcluirLocal() {
    const [removido] = lugares.splice(indiceEmEdicao, 1);
    const salvou = salvarLugares();

    fecharFormulario();
    renderizarListaAdmin();
    atualizarBotaoRestaurarLocais();
    aplicarFiltrosCombinados();

    mostrarStatusAdmin(salvou
        ? `"${removido.nome}" foi excluído.`
        : `"${removido.nome}" foi excluído, mas o navegador não deixou salvar: ele volta ao recarregar a página.`);
}

// ---------- Restaurar a lista original de locais ----------
function atualizarBotaoRestaurarLocais() {
    const btn = document.getElementById("btn-restaurar-locais");
    if (btn) btn.hidden = !temLugaresPersonalizados();
}

function pedirRestaurarLocais() {
    abrirConfirmacao(
        "Restaurar locais originais",
        "Todos os locais adicionados, editados ou excluídos neste navegador voltarão à lista original do projeto. Continuar?",
        () => {
            if (painelFormAberto()) fecharFormulario();
            restaurarLugaresOriginais();
            renderizarListaAdmin();
            atualizarBotaoRestaurarLocais();
            aplicarFiltrosCombinados();
            mostrarStatusAdmin("A lista original de locais foi restaurada.");
        },
        { rotulo: "Restaurar", perigo: true }
    );
}

function ligarEventosAdmin() {
    document.getElementById("btn-novo-local").addEventListener("click", () => abrirFormulario());
    document.getElementById("btn-fechar-form").addEventListener("click", fecharFormulario);
    document.getElementById("btn-excluir-local").addEventListener("click", excluirLocal);
    document.getElementById("btn-restaurar-locais").addEventListener("click", pedirRestaurarLocais);

    // Enviar o formulário (botão "Salvar" ou Enter no campo de nome)
    document.getElementById("form-local").addEventListener("submit", (e) => {
        e.preventDefault();
        salvarLocal();
    });

    // Esc fecha o painel
    document.getElementById("painel-form").addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            e.preventDefault();
            fecharFormulario();
        }
    });

    // A busca já atualiza o mapa (listener em mapa.js); aqui a lista do admin
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", renderizarListaAdmin);
    }
}

mapaPronto.then(iniciarAdmin);
