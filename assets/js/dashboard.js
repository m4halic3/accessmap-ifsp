// dashboard.js — filtros da tela de respostas do admin (AccessMap)
// Trabalha em cima dos cards já renderizados no HTML (.resposta-card),
// sem depender de backend. Quando houver uma API de respostas, basta
// trocar a leitura de `document.querySelectorAll('.resposta-card')`
// pelos dados vindos do servidor e re-renderizar os cards antes de
// chamar aplicarFiltros().

let categoriaAtual = null;

function normalizarTexto(txt) {
    return txt
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function aplicarFiltros() {
    const termoLocal = normalizarTexto(document.getElementById('filtro-local')?.value || '');
    const termoRelato = normalizarTexto(document.getElementById('filtro-relato')?.value || '');
    const ordenacao = document.getElementById('filtro-ordenacao')?.value || 'recentes';

    const lista = document.getElementById('respostas-lista');
    const vazio = document.getElementById('respostas-vazio');
    const contador = document.getElementById('contador-respostas');
    if (!lista) return;

    const cards = Array.from(lista.querySelectorAll('.resposta-card'));
    let visiveis = 0;

    cards.forEach(card => {
        const local = normalizarTexto(card.querySelector('.resposta-local')?.textContent || '');
        const relato = normalizarTexto(card.querySelector('.resposta-texto')?.textContent || '');
        const categoria = card.dataset.categoria;

        const bateLocal = !termoLocal || local.includes(termoLocal);
        const bateRelato = !termoRelato || relato.includes(termoRelato);
        const bateCategoria = !categoriaAtual || categoria === categoriaAtual;

        const visivel = bateLocal && bateRelato && bateCategoria;
        card.hidden = !visivel;
        if (visivel) visiveis++;
    });

    // Ordenação simples pela ordem atual dos cards no DOM
    if (ordenacao === 'antigos') {
        [...cards].reverse().forEach(card => lista.insertBefore(card, vazio));
    } else if (ordenacao === 'local') {
        [...cards]
            .sort((a, b) => {
                const la = a.querySelector('.resposta-local')?.textContent.trim() || '';
                const lb = b.querySelector('.resposta-local')?.textContent.trim() || '';
                return la.localeCompare(lb, 'pt-BR');
            })
            .forEach(card => lista.insertBefore(card, vazio));
    }

    if (vazio) vazio.hidden = visiveis > 0;
    if (contador) contador.textContent = `${visiveis} resposta${visiveis === 1 ? '' : 's'}`;
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

    aplicarFiltros();
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

    aplicarFiltros();
}

function excluirResposta(botao) {
    const card = botao.closest('.resposta-card');
    if (card) {
        card.remove();
        aplicarFiltros();
    }
}

function iniciarDashboard() {
    document.getElementById('filtro-local')?.addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-relato')?.addEventListener('input', aplicarFiltros);
    document.getElementById('filtro-ordenacao')?.addEventListener('change', aplicarFiltros);
    document.getElementById('btn-limpar-filtros')?.addEventListener('click', limparFiltros);

    document.querySelectorAll('.filtro-categoria').forEach(btn => {
        btn.addEventListener('click', () => alternarCategoria(btn));
    });

    document.querySelectorAll('.btn-excluir-resposta').forEach(btn => {
        btn.addEventListener('click', () => excluirResposta(btn));
    });

    aplicarFiltros();
}

window.addEventListener('DOMContentLoaded', iniciarDashboard);