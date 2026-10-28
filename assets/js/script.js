/* =========================================================
   PÁGINA INICIAL (index.html): MENU, CARROSSEL E FORMULÁRIO
   (fonte/contraste/VLibras ficam em acessibilidade.js)
   ========================================================= */

/* =========================================================
   NAVEGAÇÃO / MENU MOBILE
   ========================================================= */
function menuEstaAberto() {
    const nav = document.getElementById("nav");
    return !!nav && nav.classList.contains("change");
}

function menuOnClick() {
    const menuBar = document.getElementById("menu-bar");
    const nav = document.getElementById("nav");
    const menuBg = document.getElementById("menu-bg");
    if (!menuBar || !nav) return;

    const abrir = !menuEstaAberto();

    menuBar.classList.toggle("change", abrir);
    nav.classList.toggle("change", abrir);
    if (menuBg) menuBg.classList.toggle("change-bg", abrir);

    menuBar.setAttribute("aria-expanded", String(abrir));
    menuBar.setAttribute("aria-label", abrir ? "Fechar menu de navegação" : "Abrir menu de navegação");

    if (abrir) {
        const primeiroLink = nav.querySelector("a");
        if (primeiroLink) primeiroLink.focus();
    }
}

function fecharMenuSeAberto() {
    if (menuEstaAberto()) menuOnClick();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuEstaAberto()) {
        menuOnClick();
        const menuBar = document.getElementById("menu-bar");
        if (menuBar) menuBar.focus();
    }
});

/* =========================================================
   CARROSSEL
   ========================================================= */
const INTERVALO_CARROSSEL = 6000;
const reduzirMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let indexAtivo = 0;
let isMoving = false;
let autoPlay = null;
// Quem prefere menos movimento começa com o carrossel parado
let pausadoPeloUsuario = reduzirMovimento;
let pausadoPorInteracao = false;

const slider = document.getElementById("slider");
const slides = slider ? slider.querySelectorAll(".slide") : [];
const bolinhas = document.querySelectorAll(".dot");
const totalSlides = slides.length;

function atualizarCarrossel() {
    if (slider) {
        slider.style.transform = `translateX(-${indexAtivo * 100}%)`;
    }
    slides.forEach((slide, i) => {
        const ativo = i === indexAtivo;
        slide.setAttribute("aria-hidden", String(!ativo));
    });
    bolinhas.forEach((dot, i) => {
        const ativo = i === indexAtivo;
        dot.classList.toggle("active", ativo);
        if (ativo) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
    });
}

function irParaSlide(n) {
    if (totalSlides === 0) return;
    indexAtivo = (n + totalSlides) % totalSlides;
    atualizarCarrossel();
}

function btnMove(direcao) {
    if (isMoving) return;
    isMoving = true;
    irParaSlide(indexAtivo + direcao);
    reiniciarTimer();
    setTimeout(() => { isMoving = false; }, 600);
}

function jumpToSlide(n) {
    if (indexAtivo === n) return;
    irParaSlide(n);
    reiniciarTimer();
}

function reiniciarTimer() {
    clearInterval(autoPlay);
    autoPlay = null;
    if (totalSlides < 2 || pausadoPeloUsuario || pausadoPorInteracao) return;
    autoPlay = setInterval(() => irParaSlide(indexAtivo + 1), INTERVALO_CARROSSEL);
}

function atualizarBotaoPausa() {
    const btn = document.getElementById("btn-pausar-carrossel");
    if (!btn) return;
    btn.setAttribute("aria-pressed", String(pausadoPeloUsuario));
    btn.setAttribute("aria-label", pausadoPeloUsuario ? "Retomar troca automática dos slides" : "Pausar troca automática dos slides");
    btn.innerHTML = pausadoPeloUsuario
        ? '<i class="fas fa-play" aria-hidden="true"></i>'
        : '<i class="fas fa-pause" aria-hidden="true"></i>';
}

function alternarPausaCarrossel() {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    atualizarBotaoPausa();
    reiniciarTimer();
}

function iniciarCarrossel() {
    const container = document.querySelector(".carousel-container");
    if (!container || totalSlides === 0) return;

    // Pausa enquanto o mouse está em cima ou o foco está dentro (WCAG 2.2.2)
    const pausar = () => { pausadoPorInteracao = true; reiniciarTimer(); };
    const retomar = () => { pausadoPorInteracao = false; reiniciarTimer(); };
    container.addEventListener("mouseenter", pausar);
    container.addEventListener("mouseleave", retomar);
    container.addEventListener("focusin", pausar);
    container.addEventListener("focusout", (e) => {
        if (!container.contains(e.relatedTarget)) retomar();
    });

    // Setas do teclado trocam o slide quando o foco está no carrossel
    container.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); btnMove(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); btnMove(-1); }
    });

    const btnPausa = document.getElementById("btn-pausar-carrossel");
    if (btnPausa) btnPausa.addEventListener("click", alternarPausaCarrossel);

    atualizarBotaoPausa();
    atualizarCarrossel();
    reiniciarTimer();
}

/* =========================================================
   FORMULÁRIO DE COLABORAÇÃO
   -----------------------------------------------------------
   Envia o relato para o servidor (POST /api/colaboracoes), que o
   grava na tabela `colaboracao`; o dashboard.js lê de lá.
   O servidor repete as validações abaixo.
   ========================================================= */
const TAMANHO_MINIMO_RELATO = 10;
let categoriaSelecionada = null;
let timerFeedback = null;

function selecionarCategoria(botao) {
    categoriaSelecionada = botao.dataset.categoria;

    document.querySelectorAll("#form-contato .btn-type[data-categoria]").forEach(btn => {
        const ativo = btn === botao;
        btn.setAttribute("aria-pressed", String(ativo));
        btn.classList.toggle("selecionado", ativo);
    });

    const grupo = document.getElementById("grupo-categoria");
    if (grupo) grupo.removeAttribute("aria-invalid");
}

function exibirFeedbackForm(mensagem, tipo) {
    const msg = document.getElementById("msg-contato");
    if (!msg) return;

    clearTimeout(timerFeedback);
    msg.textContent = mensagem;
    msg.className = "msg-feedback " + (tipo === "erro" ? "msg-erro" : "msg-sucesso");
    msg.hidden = false;

    // Só a mensagem de sucesso some sozinha; o erro fica até ser corrigido
    if (tipo !== "erro") {
        timerFeedback = setTimeout(() => { msg.hidden = true; }, 6000);
    }
}

function marcarCampoInvalido(campo, invalido) {
    if (!campo) return;
    if (invalido) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
}

async function tratarEnvioFormulario(e) {
    e.preventDefault();

    const campoLocal = document.getElementById("local-ocorrencia");
    const campoRelato = document.getElementById("relato-sugestao");
    const local = campoLocal.value.trim();
    const relato = campoRelato.value.trim();

    marcarCampoInvalido(campoLocal, !local);
    marcarCampoInvalido(campoRelato, relato.length < TAMANHO_MINIMO_RELATO);

    if (!local) {
        exibirFeedbackForm("Informe o local da ocorrência.", "erro");
        campoLocal.focus();
        return;
    }

    if (!categoriaSelecionada) {
        exibirFeedbackForm("Selecione uma categoria de acessibilidade (Física ou Auditiva).", "erro");
        const grupo = document.getElementById("grupo-categoria");
        if (grupo) grupo.setAttribute("aria-invalid", "true");
        const primeiroBotao = document.querySelector("#form-contato .btn-type[data-categoria]");
        if (primeiroBotao) primeiroBotao.focus();
        return;
    }

    if (relato.length < TAMANHO_MINIMO_RELATO) {
        exibirFeedbackForm(`Descreva o problema com pelo menos ${TAMANHO_MINIMO_RELATO} caracteres.`, "erro");
        campoRelato.focus();
        return;
    }

    const btnEnviar = e.target.querySelector('button[type="submit"]');
    const textoBotao = btnEnviar ? btnEnviar.innerHTML : "";
    if (btnEnviar) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = "Enviando...";
    }

    try {
        await AccessMapApi.enviarColaboracao({ local, categoria: categoriaSelecionada, relato });
    } catch (erro) {
        console.error("AccessMap: não foi possível enviar a colaboração.", erro);
        exibirFeedbackForm(erro.message, "erro");
        return;
    } finally {
        if (btnEnviar) {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = textoBotao;
        }
    }

    exibirFeedbackForm("Colaboração enviada com sucesso! Obrigado por ajudar o AccessMap.", "sucesso");

    document.getElementById("form-contato").reset();
    document.querySelectorAll("#form-contato .btn-type[data-categoria]").forEach(btn => {
        btn.setAttribute("aria-pressed", "false");
        btn.classList.remove("selecionado");
    });
    categoriaSelecionada = null;
}

document.addEventListener("DOMContentLoaded", () => {
    const menuBar = document.getElementById("menu-bar");
    if (menuBar) {
        // É um <div role="button">: precisa responder a Enter e Espaço
        menuBar.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                menuOnClick();
            }
        });
    }

    const formContato = document.getElementById("form-contato");
    if (formContato) {
        formContato.addEventListener("submit", tratarEnvioFormulario);

        // Ao corrigir um campo, tira a marcação de erro
        formContato.querySelectorAll("input, textarea").forEach(campo => {
            campo.addEventListener("input", () => marcarCampoInvalido(campo, false));
        });
    }

    document.querySelectorAll("#form-contato .btn-type[data-categoria]").forEach(botao => {
        botao.addEventListener("click", () => selecionarCategoria(botao));
    });

    iniciarCarrossel();
});
