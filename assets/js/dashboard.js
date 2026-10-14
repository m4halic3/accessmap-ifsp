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

// Guarda a última resposta excluída para permitir "Desfazer"
let ultimaExcluida = null;
let timerToast = null;

function removerResposta(id) {
    const lista = lerRespostas();
    const indice = lista.findIndex(r => r.id === id);
    if (indice === -1) return null;
    const [removida] = lista.splice(indice, 1);
    salvarRespostas(lista);
    return { resposta: removida, indice };
}

function desfazerExclusao() {
    if (!ultimaExcluida) return;
    const lista = lerRespostas();
    lista.splice(Math.min(ultimaExcluida.indice, lista.length), 0, ultimaExcluida.resposta);
    salvarRespostas(lista);
    ultimaExcluida = null;
    esconderToast();
    renderizarRespostas();
    anunciar('Exclusão desfeita.');
}

function mostrarToast(texto) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    document.getElementById('toast-texto').textContent = texto;
    toast.hidden = false;
    clearTimeout(timerToast);
    timerToast = setTimeout(esconderToast, 8000);
}

function esconderToast() {
    const toast = document.getElementById('toast');
    if (toast) toast.hidden = true;
    clearTimeout(timerToast);
}

// Mensagem só para leitores de tela (região aria-live)
function anunciar(texto) {
    const regiao = document.getElementById('anuncio-dashboard');
    if (!regiao) return;
    regiao.textContent = '';
    setTimeout(() => { regiao.textContent = texto; }, 50);
}

function normalizarTexto(txt) {
    return txt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function formatarData(isoString) {
    const data = new Date(isoString);
    if (Number.isNaN(data.getTime())) return 'Data desconhecida';
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function rotuloCategoria(categoria) {
    return categoria === 'fisica' ? 'Física' : 'Auditiva';
}

function categoriaSegura(categoria) {
    return categoria === 'fisica' ? 'fisica' : 'auditiva';
}

function escaparHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function criarCard(resposta) {
    const article = document.createElement('article');
    article.className = 'resposta-card';
    article.dataset.categoria = categoriaSegura(resposta.categoria);
    article.dataset.id = resposta.id;

    article.innerHTML = `
        <div class="resposta-card-header">
            <span class="resposta-local">
                <i class="fas fa-map-pin" aria-hidden="true"></i>
                ${escaparHtml(resposta.local)}
            </span>
            <span class="resposta-tag tag-${categoriaSegura(resposta.categoria)}">${rotuloCategoria(resposta.categoria)}</span>
        </div>
        <p class="resposta-texto">${escaparHtml(resposta.relato)}</p>
        <div class="resposta-card-footer">
            <span class="resposta-data">
                <i class="fas fa-clock" aria-hidden="true"></i>
                <time datetime="${escaparHtml(String(resposta.data))}">${formatarData(resposta.data)}</time>
            </span>
            <button type="button" class="btn-excluir-resposta" aria-label="Excluir a resposta sobre ${escaparHtml(resposta.local)}" title="Excluir">
                <i class="fas fa-trash" aria-hidden="true"></i>
            </button>
        </div>
    `;

    article.querySelector('.btn-excluir-resposta').addEventListener('click', () => {
        // Mantém o foco num lugar previsível depois que o card some
        const proximo = article.nextElementSibling?.querySelector('.btn-excluir-resposta')
            || article.previousElementSibling?.querySelector('.btn-excluir-resposta');

        ultimaExcluida = removerResposta(resposta.id);
        renderizarRespostas();

        if (ultimaExcluida) {
            mostrarToast(`Resposta sobre "${resposta.local}" excluída.`);
            anunciar(`Resposta sobre ${resposta.local} excluída. Use o botão Desfazer para recuperar.`);
        }

        const destino = proximo && document.body.contains(proximo)
            ? proximo
            : document.getElementById('toast-desfazer');
        if (destino) destino.focus();
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

    const todas = lerRespostas();
    let respostas = todas.filter(r => {
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

    if (vazio) {
        vazio.hidden = respostas.length > 0;
        vazio.textContent = todas.length === 0
            ? 'Ainda não há respostas. Elas aparecem aqui quando alguém envia o formulário de colaboração da página inicial.'
            : 'Nenhuma resposta encontrada para os filtros selecionados. Tente limpar os filtros.';
    }
    if (contador) {
        const filtrando = respostas.length !== todas.length;
        contador.textContent = filtrando
            ? `${respostas.length} de ${todas.length} respostas`
            : `${respostas.length} resposta${respostas.length === 1 ? '' : 's'}`;
    }
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

    document.getElementById('toast-desfazer')?.addEventListener('click', desfazerExclusao);
    document.getElementById('toast-fechar')?.addEventListener('click', esconderToast);

    // Respostas enviadas em outra aba aparecem sem precisar recarregar
    window.addEventListener('storage', (e) => {
        if (e.key === CHAVE_RESPOSTAS) renderizarRespostas();
    });

    renderizarRespostas();
}

window.addEventListener('DOMContentLoaded', iniciarDashboard);
