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
    // Pega o valor digitado e converte para minúsculo
    let input = document.getElementById('search-input').value.toLowerCase();
    
    // Pega todos os cards de lugares na lista
    let lista = document.getElementById('lista-lugares');
    let itens = lista.getElementsByClassName('item-lugar');

    for (let i = 0; i < itens.length; i++) {
        // Pega o nome do lugar (geralmente dentro da tag <p> no seu SCSS)
        let nomeLugar = itens[i].getElementsByTagName('p')[0].innerText.toLowerCase();
        
        // Verifica se o texto pesquisado está contido no nome do lugar
        if (nomeLugar.includes(input)) {
            itens[i].style.display = ""; // Mostra o item
        } else {
            itens[i].style.display = "none"; // Esconde o item
        }
    }
}
