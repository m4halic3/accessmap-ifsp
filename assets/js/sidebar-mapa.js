/* =========================================================
   BARRA LATERAL DO MAPA EM TELAS PEQUENAS (painel deslizante)
   -----------------------------------------------------------
   Até 992 px de largura (celular e tablet), o mapa ocupa a tela
   inteira e a barra lateral vira um painel na parte de baixo,
   como em aplicativos de mapa:
     • recolhido: mostra só a busca e a escolha da planta;
     • expandido: mostra também filtros, legenda e a lista.
   Escolher um local (na lista ou com Enter na busca) recolhe o
   painel para o mapa ficar visível. No computador nada muda.
   Usado em mapa.html e admin.html (depois de mapa.js).
   ========================================================= */
(function () {
    "use strict";

    const telaPequena = window.matchMedia("(max-width: 992px)");
    const sidebar = document.querySelector(".container-mapa .sidebar");
    const alca = document.getElementById("btn-alca-sidebar");
    if (!sidebar || !alca) return;

    const textoAlca = alca.querySelector(".alca-texto");
    let alturaRecolhida = 0;

    // Para o mapa.js enquadrar a planta só na área visível (acima do painel)
    window.alturaPainelInferior = () => (telaPequena.matches ? alturaRecolhida : 0);

    function estaExpandida() {
        return sidebar.classList.contains("sidebar-expandida");
    }

    function definirExpandida(expandir) {
        if (!telaPequena.matches) expandir = false;
        sidebar.classList.toggle("sidebar-expandida", expandir);
        document.body.classList.toggle("painel-mapa-expandido", expandir);
        alca.setAttribute("aria-expanded", String(expandir));
        if (textoAlca) textoAlca.textContent = expandir ? "Recolher" : "Ver locais e filtros";
        if (!expandir) sidebar.scrollTop = 0;
    }

    // Altura do painel recolhido: até o fim dos botões de planta
    function medirAlturaRecolhida() {
        if (!telaPequena.matches) {
            alturaRecolhida = 0;
            sidebar.style.removeProperty("--altura-recolhida");
            return;
        }
        const limite = document.getElementById("seletor-alas");
        if (!limite) return;
        const topo = sidebar.getBoundingClientRect().top;
        const fim = limite.getBoundingClientRect().bottom;
        const altura = Math.ceil(fim - topo + sidebar.scrollTop + 16);
        if (altura === alturaRecolhida) return;
        alturaRecolhida = altura;
        sidebar.style.setProperty("--altura-recolhida", `${altura}px`);

        // Se a pessoa ainda não mexeu no zoom, reenquadra a planta acima do painel
        if (typeof mapa !== "undefined" && mapa && typeof zoomEnquadrado !== "undefined" &&
            mapa.getZoom() <= zoomEnquadrado + 0.01) {
            enquadrarPlanta();
        }
    }

    function aoMudarLayout() {
        definirExpandida(false);
        medirAlturaRecolhida();
        // O tamanho do mapa muda entre os layouts: o Leaflet precisa recalcular
        if (typeof mapa !== "undefined" && mapa) {
            mapa.invalidateSize();
            enquadrarPlanta();
        }
    }

    // Tocar na alça alterna; arrastar para cima expande e para baixo recolhe
    const DISTANCIA_ARRASTO = 30; // px
    let inicioArrasto = null;
    let arrastou = false;

    alca.addEventListener("pointerdown", (e) => {
        if (!telaPequena.matches) return;
        inicioArrasto = e.clientY;
        arrastou = false;
        alca.setPointerCapture(e.pointerId);
    });

    alca.addEventListener("pointermove", (e) => {
        if (inicioArrasto === null) return;
        const deslocamento = e.clientY - inicioArrasto;
        if (Math.abs(deslocamento) < DISTANCIA_ARRASTO) return;
        arrastou = true;
        definirExpandida(deslocamento < 0);
        inicioArrasto = null;
    });

    const fimArrasto = () => { inicioArrasto = null; };
    alca.addEventListener("pointerup", fimArrasto);
    alca.addEventListener("pointercancel", fimArrasto);

    alca.addEventListener("click", () => {
        if (arrastou) {
            arrastou = false; // o arrasto já resolveu; ignora o clique que vem junto
            return;
        }
        definirExpandida(!estaExpandida());
    });

    // Esc recolhe
    sidebar.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && estaExpandida()) {
            definirExpandida(false);
            alca.focus();
        }
    });

    // Ao digitar na busca, o painel sobe para mostrar os resultados;
    // ao apertar Enter (vai até o local), ele desce para mostrar o mapa
    const busca = document.getElementById("search-input");
    if (busca) {
        busca.addEventListener("input", () => {
            if (busca.value.trim()) definirExpandida(true);
        });
        busca.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                definirExpandida(false);
                busca.blur(); // fecha o teclado do celular
            }
        });
    }

    // Escolher um local na lista recolhe o painel
    sidebar.addEventListener("click", (e) => {
        if (!telaPequena.matches) return;
        if (e.target.closest(".item-lugar, .item-lugar-admin-info, .btn-editar-local")) {
            definirExpandida(false);
        }
    });

    // A altura recolhida depende do título (muda com a planta) e da fonte (A+/A-)
    if ("ResizeObserver" in window) {
        const observador = new ResizeObserver(medirAlturaRecolhida);
        // tudo o que fica acima do fim dos botões de planta
        [alca, ...sidebar.querySelectorAll("#titulo-resultados, #contador-resultados, .search-container, #seletor-alas")]
            .forEach(el => observador.observe(el));
    }
    document.addEventListener("accessmap:fonte", medirAlturaRecolhida);
    window.addEventListener("resize", medirAlturaRecolhida);
    telaPequena.addEventListener("change", aoMudarLayout);

    definirExpandida(false);
    medirAlturaRecolhida();
    window.addEventListener("load", medirAlturaRecolhida);
    // As fontes da web mudam a altura do título: mede de novo quando carregam
    if (document.fonts) {
        document.fonts.addEventListener("loadingdone", medirAlturaRecolhida);
        document.fonts.ready.then(medirAlturaRecolhida);
    }
})();
