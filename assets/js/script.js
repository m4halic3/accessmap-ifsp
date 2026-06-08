/* ==========================================================================
   MENU MOBILE
   ========================================================================== */
function menuOnClick() {
    const menuBar = document.getElementById("menu-bar");
    const nav = document.getElementById("nav");
    const menuBg = document.getElementById("menu-bg");

    if (menuBar) menuBar.classList.toggle("change");
    if (nav) nav.classList.toggle("change");
    if (menuBg) menuBg.classList.toggle("change-bg");
}

/* ==========================================================================
   CARROSSEL E SWIPE MOBILE
   ========================================================================== */
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

// Autoplay
let autoPlay = setInterval(() => { btnMove(1); }, 5000);

function reiniciarTimer() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => { btnMove(1); }, 5000);
}

// Lógica de Swipe Otimizada
let touchStartX = 0;
let touchEndX = 0;
const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) { // Distância mínima de 50px
            btnMove(diff > 0 ? 1 : -1);
        }
    }, { passive: true });
}

/* ==========================================================================
   LOGIN, PESQUISA E ACESSIBILIDADE
   ========================================================================== */
function toggleAuth() {
  const login = document.getElementById("loginCard");
  const signup = document.getElementById("signupCard");
  if (login && signup) {
      login.classList.toggle("active");
      signup.classList.toggle("active");
  }
}

function pesquisarLugares() {
    let input = document.getElementById('search-input')?.value.toLowerCase();
    let lista = document.getElementById('lista-lugares');
    if (!lista) return;
    let itens = lista.getElementsByClassName('item-lugar');

    for (let i = 0; i < itens.length; i++) {
        let nomeLugar = itens[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        itens[i].style.display = nomeLugar.includes(input) ? "" : "none";
    }
}

// Acessibilidade
let nivelFonte = 0; 
function mudarFonte(direcao) {
    const novoNivel = nivelFonte + direcao;
    if (novoNivel > 3 || novoNivel < -2) return;
    nivelFonte = novoNivel;
    document.documentElement.style.fontSize = (100 + (nivelFonte * 10)) + "%";
}

function toggleContraste() {
    document.body.classList.toggle("alto-contraste");
    localStorage.setItem("altoContrasteState", document.body.classList.contains("alto-contraste"));
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("altoContrasteState") === "true") {
        document.body.classList.add("alto-contraste");
    }
});

/* ==========================================================================
   MODAL DE AJUDA
   ========================================================================== */
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

window.onclick = function(event) {
    const modal = document.getElementById("modal-guia");
    if (event.target === modal) fecharGuiaUsuario();
};