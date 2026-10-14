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

document.addEventListener("DOMContentLoaded", () => {
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
