/* =========================================================
   ACESSIBILIDADE: FONTE, CONTRASTE E VLIBRAS
   -----------------------------------------------------------
   Script compartilhado por todas as páginas. As preferências
   (tamanho da fonte e alto contraste) ficam no localStorage,
   então valem ao navegar entre as páginas do AccessMap.
   ========================================================= */
const CHAVE_FONTE = "accessmap_nivel_fonte";
const CHAVE_CONTRASTE = "altoContrasteState";

const NIVEIS_FONTE = { "-2": "80%", "-1": "90%", "0": "100%", "1": "110%", "2": "120%", "3": "130%" };
const MAX_NIVEL_FONTE = 3;
const MIN_NIVEL_FONTE = -2;

let nivelFonte = 0;

function lerPreferencia(chave) {
    try {
        return localStorage.getItem(chave);
    } catch (_) {
        return null; // navegação privada ou armazenamento bloqueado
    }
}

function salvarPreferencia(chave, valor) {
    try {
        localStorage.setItem(chave, valor);
    } catch (_) {
        // Sem armazenamento a preferência vale só para esta página
    }
}

function aplicarFonte() {
    document.documentElement.style.fontSize = NIVEIS_FONTE[nivelFonte];

    // Desabilita o botão quando chega no limite, para dar retorno visual
    const btnAumentar = document.getElementById("btn-aumentar");
    const btnDiminuir = document.getElementById("btn-diminuir");
    if (btnAumentar) btnAumentar.disabled = nivelFonte >= MAX_NIVEL_FONTE;
    if (btnDiminuir) btnDiminuir.disabled = nivelFonte <= MIN_NIVEL_FONTE;
}

function mudarFonte(direcao) {
    const novoNivel = nivelFonte + direcao;
    if (novoNivel > MAX_NIVEL_FONTE || novoNivel < MIN_NIVEL_FONTE) return;

    nivelFonte = novoNivel;
    salvarPreferencia(CHAVE_FONTE, String(nivelFonte));
    aplicarFonte();
    // Avisa quem depende do tamanho do texto (ex.: nomes no mapa)
    document.dispatchEvent(new CustomEvent("accessmap:fonte"));
}

function aplicarContraste(ativo) {
    document.body.classList.toggle("alto-contraste", ativo);
    const btn = document.getElementById("btn-contraste");
    if (btn) btn.setAttribute("aria-pressed", String(ativo));
}

function toggleContraste() {
    const ativo = !document.body.classList.contains("alto-contraste");
    aplicarContraste(ativo);
    salvarPreferencia(CHAVE_CONTRASTE, String(ativo));
}

// A fonte é aplicada já no carregamento do script, para não "piscar"
const nivelSalvo = parseInt(lerPreferencia(CHAVE_FONTE), 10);
if (!Number.isNaN(nivelSalvo) && NIVEIS_FONTE[nivelSalvo]) {
    nivelFonte = nivelSalvo;
    document.documentElement.style.fontSize = NIVEIS_FONTE[nivelFonte];
}

// No celular, A+ / A- / contraste ficam agrupados atrás de um único botão
// "Acessibilidade" (ocupam menos espaço sobre o conteúdo). No computador o
// botão fica escondido pelo CSS e os três aparecem como sempre.
function montarMenuAcessibilidade() {
    const widget = document.querySelector(".widget-acessibilidade-nativo");
    if (!widget || document.getElementById("btn-acessibilidade-menu")) return;

    const botoes = [...widget.querySelectorAll("button")];
    const grupo = document.createElement("div");
    grupo.className = "widget-acessibilidade-opcoes";
    grupo.id = "widget-acessibilidade-opcoes";
    botoes.forEach(b => grupo.appendChild(b));

    const menu = document.createElement("button");
    menu.type = "button";
    menu.id = "btn-acessibilidade-menu";
    menu.className = "btn-acessibilidade-menu";
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-controls", grupo.id);
    menu.setAttribute("aria-label", "Opções de acessibilidade: tamanho do texto e contraste");
    menu.innerHTML = '<i class="fas fa-universal-access" aria-hidden="true"></i>';

    const alternar = (abrir) => {
        widget.classList.toggle("widget-aberto", abrir);
        menu.setAttribute("aria-expanded", String(abrir));
    };
    menu.addEventListener("click", () => alternar(!widget.classList.contains("widget-aberto")));
    widget.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && widget.classList.contains("widget-aberto")) {
            alternar(false);
            menu.focus();
        }
    });
    // Toque fora fecha o menu
    document.addEventListener("click", (e) => {
        if (!widget.contains(e.target)) alternar(false);
    });

    widget.appendChild(menu);
    widget.appendChild(grupo);
}

document.addEventListener("DOMContentLoaded", () => {
    montarMenuAcessibilidade();
    aplicarFonte();
    aplicarContraste(lerPreferencia(CHAVE_CONTRASTE) === "true");
});

// VLibras: só inicializa se o script do governo carregou (sem internet,
// ou com o serviço fora do ar, a página continua funcionando normalmente).
// Precisa rodar ANTES do evento "load", pois o widget se registra nele —
// por isso este arquivo é carregado logo depois do vlibras-plugin.js.
if (window.VLibras && typeof window.VLibras.Widget === "function") {
    try {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
    } catch (erro) {
        console.warn("AccessMap: não foi possível iniciar o VLibras.", erro);
    }
}
