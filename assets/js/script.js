function menuOnClick() {
    const menuBar = document.getElementById("menu-bar");
    const nav = document.getElementById("nav");
    const menuBg = document.getElementById("menu-bg");

    if (menuBar) menuBar.classList.toggle("change");
    if (nav) nav.classList.toggle("change");
    if (menuBg) menuBg.classList.toggle("change-bg");
}

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

/*Parte Login*/

function toggleAuth() {
  const login = document.getElementById("loginCard");
  const signup = document.getElementById("signupCard");

  login.classList.toggle("active");
  signup.classList.toggle("active");
}

function pesquisarLugares() {
    let input = document.getElementById('search-input').value.toLowerCase();
    let lista = document.getElementById('lista-lugares');
    let itens = lista.getElementsByClassName('item-lugar');

    for (let i = 0; i < itens.length; i++) {
        let nomeLugar = itens[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        
        if (nomeLugar.includes(input)) {
            itens[i].style.display = ""; 
        } else {
            itens[i].style.display = "none"; 
        }
    }
}

/* ==========================================================================
   SISTEMA DE ACESSIBILIDADE NATIVA (Fontes e Alto Contraste)
   ========================================================================== */

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
            htmlElement.style.fontSize = "80%" ;
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

/* ==========================================================================
   CONTROLE DO MODAL DE AJUDA / GUIA DO USUÁRIO
   ========================================================================== */

function abrirGuiaUsuario() {
    const modal = document.getElementById("modal-guia");
    if (modal) {
        modal.style.display = "flex";
        document.body.style.overflow = "hidden"; // Trava o scroll do fundo
    }
}

function fecharGuiaUsuario() {
    const modal = document.getElementById("modal-guia");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Libera o scroll do fundo
    }
}

// Fecha o modal caso o usuário clique fora da caixa de conteúdo técnico
window.onclick = function(event) {
    const modal = document.getElementById("modal-guia");
    if (event.target === modal) {
        fecharGuiaUsuario();
    }
};

/* ==========================================================================
   FUNCIONALIDADE DE SWIPE PARA MOBILE
   ========================================================================== */

let touchStartX = 0;
let touchEndX = 0;

// Seleciona o container do carrossel
const carouselContainer = document.querySelector('.carousel-container');

if (carouselContainer) {
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const threshold = 50; // Distância mínima (em px) para disparar a troca
    
    if (touchEndX < touchStartX - threshold) {
        // Arrastou para a esquerda: Próximo slide
        btnMove(1); 
    } else if (touchEndX > touchStartX + threshold) {
        // Arrastou para a direita: Slide anterior
        btnMove(-1);
    }
}