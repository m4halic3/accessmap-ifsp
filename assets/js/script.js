/* =========================================================
   NAVEGAÇÃO / MENU MOBILE
   ========================================================= */
function menuOnClick() {
    const menuBar = document.getElementById("menu-bar");
    const nav = document.getElementById("nav");
    const menuBg = document.getElementById("menu-bg");

    if (menuBar) menuBar.classList.toggle("change");
    if (nav) nav.classList.toggle("change");
    if (menuBg) menuBg.classList.toggle("change-bg");
}

/* =========================================================
   CARROSSEL
   ========================================================= */
let indexAtivo = 0;
let isMoving = false;
const slider = document.getElementById("slider");
const bolinhas = document.querySelectorAll(".dot");
const totalSlides = bolinhas.length;

function atualizarCarrossel() {
    if (slider) {
        slider.style.transform = `translateX(-${indexAtivo * 100}%)`;
    }
    bolinhas.forEach((dot, i) => {
        dot.classList.toggle("active", i === indexAtivo);
    });
}

function btnMove(direcao) {
    if (isMoving) return;

    isMoving = true;
    indexAtivo += direcao;

    if (indexAtivo >= totalSlides) {
        indexAtivo = 0;
    } else if (indexAtivo < 0) {
        indexAtivo = totalSlides - 1;
    }

    atualizarCarrossel();
    reiniciarTimer();

    setTimeout(() => {
        isMoving = false;
    }, 1200);
}

function jumpToSlide(n) {
    if (isMoving || indexAtivo === n) return;

    isMoving = true;
    indexAtivo = n;
    atualizarCarrossel();
    reiniciarTimer();

    setTimeout(() => {
        isMoving = false;
    }, 1200);
}

let autoPlay = setInterval(() => {
    btnMove(1);
}, 5000);

function reiniciarTimer() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        btnMove(1);
    }, 5000);
}

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

/* =========================================================
   MODAL - GUIA DO USUÁRIO
   ========================================================= */
function abrirGuiaUsuario() {
    const modal = document.getElementById("modal-guia");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }
}

function fecharGuiaUsuario() {
    const modal = document.getElementById("modal-guia");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

window.onclick = function (event) {
    const modal = document.getElementById("modal-guia");
    if (event.target === modal) {
        fecharGuiaUsuario();
    }
};

/* =========================================================
   FORMULÁRIO DE COLABORAÇÃO
   -----------------------------------------------------------
   Salva as respostas no localStorage (chave 'accessmap_respostas'),
   a mesma lida pelo dashboard.js na área administrativa.
   Quando existir back-end, troque por uma chamada de API (fetch/POST).
   ========================================================= */

const CHAVE_RESPOSTAS_FORM = 'accessmap_respostas';
let categoriaSelecionada = null;

function selecionarCategoria(botao) {
    const categoria = botao.dataset.categoria;

    document.querySelectorAll('.btn-type[data-categoria]').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('selecionado');
    });

    categoriaSelecionada = categoria;
    botao.setAttribute('aria-pressed', 'true');
    botao.classList.add('selecionado');
}

function lerRespostasForm() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_RESPOSTAS_FORM)) || [];
    } catch {
        return [];
    }
}

function salvarNovaResposta(resposta) {
    const lista = lerRespostasForm();
    lista.push(resposta);
    localStorage.setItem(CHAVE_RESPOSTAS_FORM, JSON.stringify(lista));
}

function exibirFeedbackForm(mensagem, tipo) {
    const msg = document.getElementById('msg-contato');
    if (!msg) {
        alert(mensagem);
        return;
    }
    msg.textContent = mensagem;
    msg.className = 'msg-feedback ' + (tipo === 'erro' ? 'msg-erro' : 'msg-sucesso');
    msg.style.display = 'block';

    setTimeout(() => {
        msg.style.display = 'none';
    }, 4000);
}

function tratarEnvioFormulario(e) {
    e.preventDefault();

    const local = document.getElementById('local-ocorrencia').value.trim();
    const relato = document.getElementById('relato-sugestao').value.trim();

    if (!local || !relato) {
        exibirFeedbackForm('Preencha todos os campos obrigatórios.', 'erro');
        return;
    }

    if (!categoriaSelecionada) {
        exibirFeedbackForm('Selecione uma categoria de acessibilidade.', 'erro');
        return;
    }

    const novaResposta = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        local: local,
        categoria: categoriaSelecionada,
        relato: relato,
        data: new Date().toISOString()
    };

    salvarNovaResposta(novaResposta);

    exibirFeedbackForm('Colaboração enviada com sucesso! Obrigado por ajudar o AccessMap.', 'sucesso');

    document.getElementById('form-contato').reset();
    document.querySelectorAll('.btn-type[data-categoria]').forEach(btn => {
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('selecionado');
    });
    categoriaSelecionada = null;
}

document.addEventListener('DOMContentLoaded', () => {
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', tratarEnvioFormulario);
    }

    document.querySelectorAll('.btn-type[data-categoria]').forEach(botao => {
        botao.addEventListener('click', () => selecionarCategoria(botao));
    });
});