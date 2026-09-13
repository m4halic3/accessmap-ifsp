// dashboard.js — painel do admin (AccessMap)
// Lê e escreve em localStorage (chave 'accessmap_respostas'), a mesma
// usada pelo formulário de colaboração da página principal (index.html).
// Quando existir um backend, troque lerRespostas()/salvarRespostas()/
// removerResposta() pelas chamadas à API correspondente.

const CHAVE_RESPOSTAS = 'accessmap_respostas';
let categoriaAtual = null;

function lerRespostas() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_RESPOSTAS)) || [];
    } catch {
        return [];
    }
}

function salvarRespostas(lista) {
    localStorage.setItem(CHAVE_RESPOSTAS, JSON.stringify(lista));
}

function removerResposta(id) {
    salvarRespostas(lerRespostas().filter(r => r.id !== id));
}

function normalizarTexto(txt) {
    return txt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatarData(isoString) {
    return new Date(isoString).toLocaleDateString('pt-BR');
}

function rotuloCategoria(categoria) {
    return categoria === 'fisica' ? 'Física' : 'Auditiva';
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function criarCard(resposta) {
    const article = document.createElement('article');
    article.className = 'resposta-card';
    article.dataset.categoria = resposta.categoria;
    article.dataset.id = resposta.id;

    article.innerHTML = `
        <div class="resposta-card-header">
            <span class="resposta-local">
                <i class="fas fa-map-pin" aria-hidden="true"></i>
                ${escaparHtml(resposta.local)}
            </span>
            <span class="resposta-tag tag-${resposta.categoria}">${rotuloCategoria(resposta.categoria)}</span>
        </div>
        <p class="resposta-texto">${escaparHtml(resposta.relato)}</p>
        <div class="resposta-card-footer">
            <span class="resposta-data">
                <i class="fas fa-clock" aria-hidden="true"></i>
                ${formatarData(resposta.data)}
            </span>
            <button type="button" class="btn-excluir-resposta" aria-label="Excluir esta resposta">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    `;

    article.querySelector('.btn-excluir-resposta').addEventListener('click', () => {
        removerResposta(resposta.id);
        renderizarRespostas();
    });

    return article;
}

function renderizarRespostas() {
    const lista = document.getElementById('respostas-lista');
    const vazio = document.getElementById('respostas-vazio');
    const contador = document.getElementById('contador-respostas');
    if (!lista) return;

    const termoLocal = normalizarTexto(document.getElementById('filtro-local')?.value || '');
    const termoRelato = normalizarTexto(document.getElementById('filtro-relato')?.value || '');
    const ordenacao = document.getElementById('filtro-ordenacao')?.value || 'recentes';

    let respostas = lerRespostas().filter(r => {
        const bateLocal = !termoLocal || normalizarTexto(r.local).includes(termoLocal);
        const bateRelato = !termoRelato || normalizarTexto(r.relato).includes(termoRelato);
        const bateCategoria = !categoriaAtual || r.categoria === categoriaAtual;
        return bateLocal && bateRelato && bateCategoria;
    });

    if (ordenacao === 'antigos') {
        respostas.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenacao === 'local') {
        respostas.sort((a, b) => a.local.localeCompare(b.local, 'pt-BR'));
    } else {
        respostas.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    lista.querySelectorAll('.resposta-card').forEach(card => card.remove());
    respostas.forEach(r => lista.insertBefore(criarCard(r), vazio));

    if (vazio) vazio.hidden = respostas.length > 0;
    if (contador) contador.textContent = `${respostas.length} resposta${respostas.length === 1 ? '' : 's'}`;
}

function alternarCategoria(botao) {
    const categoria = botao.dataset.categoria;

    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
    });

    if (categoriaAtual === categoria) {
        categoriaAtual = null;
    } else {
        categoriaAtual = categoria;
        botao.setAttribute('aria-pressed', 'true');
    }

    renderizarRespostas();
}

function limparFiltros() {
    const filtroLocal = document.getElementById('filtro-local');
    const filtroRelato = document.getElementById('filtro-relato');
    const filtroOrdenacao = document.getElementById('filtro-ordenacao');

    if (filtroLocal) filtroLocal.value = '';
    if (filtroRelato) filtroRelato.value = '';
    if (filtroOrdenacao) filtroOrdenacao.value = 'recentes';

    categoriaAtual = null;
    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
    });

    renderizarRespostas();
}

function iniciarDashboard() {
    document.getElementById('filtro-local')?.addEventListener('input', renderizarRespostas);
    document.getElementById('filtro-relato')?.addEventListener('input', renderizarRespostas);
    document.getElementById('filtro-ordenacao')?.addEventListener('change', renderizarRespostas);
    document.getElementById('btn-limpar-filtros')?.addEventListener('click', limparFiltros);

    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.addEventListener('click', () => alternarCategoria(btn));
    });

    renderizarRespostas();
}

window.addEventListener('DOMContentLoaded', iniciarDashboard);

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
