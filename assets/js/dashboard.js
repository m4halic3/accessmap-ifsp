// dashboard.js — painel do admin (AccessMap)
// Lê e modera as colaborações enviadas pelo formulário da página principal,
// guardadas no banco de dados (API /api/colaboracoes, ver api.js).
// A lista é carregada uma vez e os filtros/ordenação são aplicados aqui.

let categoriaAtual = null;
let respostas = [];          // colaborações carregadas do servidor
let carregando = true;
let erroCarregamento = null;

async function carregarRespostas() {
    try {
        respostas = await AccessMapApi.listarColaboracoes();
        erroCarregamento = null;
    } catch (erro) {
        erroCarregamento = erro.message;
    }
    carregando = false;
    renderizarRespostas();
}

// Guarda a última resposta excluída para permitir "Desfazer"
let ultimaExcluida = null;
let timerToast = null;

async function removerResposta(id) {
    const indice = respostas.findIndex(r => r.id === id);
    if (indice === -1) return null;
    await AccessMapApi.excluirColaboracao(id);
    const [removida] = respostas.splice(indice, 1);
    return { resposta: removida, indice };
}

async function desfazerExclusao() {
    if (!ultimaExcluida) return;
    const { resposta, indice } = ultimaExcluida;
    try {
        await AccessMapApi.restaurarColaboracao(resposta.id);
    } catch (erro) {
        anunciar(`Não foi possível desfazer: ${erro.message}`);
        mostrarToast(`Não foi possível desfazer: ${erro.message}`);
        return;
    }
    respostas.splice(Math.min(indice, respostas.length), 0, resposta);
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

    article.querySelector('.btn-excluir-resposta').addEventListener('click', async (e) => {
        // Mantém o foco num lugar previsível depois que o card some
        const proximo = article.nextElementSibling?.querySelector('.btn-excluir-resposta')
            || article.previousElementSibling?.querySelector('.btn-excluir-resposta');

        e.currentTarget.disabled = true;
        try {
            ultimaExcluida = await removerResposta(resposta.id);
        } catch (erro) {
            e.currentTarget.disabled = false;
            mostrarToast(`Não foi possível excluir: ${erro.message}`);
            anunciar(`Não foi possível excluir: ${erro.message}`);
            return;
        }
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

    const todas = respostas;
    let filtradas = todas.filter(r => {
        const bateLocal = !termoLocal || normalizarTexto(r.local).includes(termoLocal);
        const bateRelato = !termoRelato || normalizarTexto(r.relato).includes(termoRelato);
        const bateCategoria = !categoriaAtual || r.categoria === categoriaAtual;
        return bateLocal && bateRelato && bateCategoria;
    });

    if (ordenacao === 'antigos') {
        filtradas.sort((a, b) => new Date(a.data) - new Date(b.data));
    } else if (ordenacao === 'local') {
        filtradas.sort((a, b) => a.local.localeCompare(b.local, 'pt-BR'));
    } else {
        filtradas.sort((a, b) => new Date(b.data) - new Date(a.data));
    }

    lista.querySelectorAll('.resposta-card').forEach(card => card.remove());
    filtradas.forEach(r => lista.insertBefore(criarCard(r), vazio));

    if (vazio) {
        vazio.hidden = filtradas.length > 0;
        if (carregando) {
            vazio.textContent = 'Carregando respostas...';
        } else if (erroCarregamento) {
            vazio.textContent = `Não foi possível carregar as respostas. ${erroCarregamento}`;
        } else {
            vazio.textContent = todas.length === 0
                ? 'Ainda não há respostas. Elas aparecem aqui quando alguém envia o formulário de colaboração da página inicial.'
                : 'Nenhuma resposta encontrada para os filtros selecionados. Tente limpar os filtros.';
        }
    }
    if (contador) {
        const filtrando = filtradas.length !== todas.length;
        contador.textContent = filtrando
            ? `${filtradas.length} de ${todas.length} respostas`
            : `${filtradas.length} resposta${filtradas.length === 1 ? '' : 's'}`;
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

    // Respostas novas aparecem ao voltar para a aba, sem precisar recarregar
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') carregarRespostas();
    });

    renderizarRespostas();
    carregarRespostas();
}

window.addEventListener('DOMContentLoaded', iniciarDashboard);
