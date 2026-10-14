/* =========================================================
   AUTENTICAÇÃO - ACCESSMAP (versão sem banco de dados)
   -----------------------------------------------------------
   Este script simula um login de administrador usando uma
   conta de teste fixa, apenas para fins de avaliação
   acadêmica. Quando o projeto tiver um back-end/banco de
   dados, esta lógica deve ser substituída por uma chamada
   de API real (fetch/axios) que valide o usuário no servidor.
   ========================================================= */

// Conta de teste do administrador (uso exclusivo para avaliação)
const ADMIN_TESTE = {
    usuario: 'admin.teste',
    senha: 'Avaliacao@2025'
};

// Chave usada para guardar a sessão no navegador
const CHAVE_SESSAO = 'accessmap_admin_logado';

// Páginas que exigem login (com e sem ".html", pois servidores como o
// `npx serve` removem a extensão da URL)
const PAGINAS_PROTEGIDAS = ['dashboard', 'admin'];

function paginaAtual() {
    return window.location.pathname.split('/').pop().replace(/\.html$/, '');
}

function estaLogado() {
    try {
        return sessionStorage.getItem(CHAVE_SESSAO) === 'true';
    } catch (_) {
        return false;
    }
}

// Roda já no carregamento do script (no <head>), antes de a página
// protegida ser exibida
protegerPaginaAdmin();

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');
    if (!formLogin) return;

    // Quem já está logado não precisa ver o login de novo
    if (estaLogado()) {
        window.location.replace('dashboard.html');
        return;
    }

    formLogin.addEventListener('submit', tratarLogin);

    // Ao digitar de novo, some a mensagem de erro
    ['user-login', 'pass-login'].forEach(id => {
        document.getElementById(id).addEventListener('input', limparErro);
    });

    const btnVerSenha = document.getElementById('btn-ver-senha');
    if (btnVerSenha) btnVerSenha.addEventListener('click', alternarVisibilidadeSenha);

    document.getElementById('user-login').focus();
});

/**
 * Trata o envio do formulário de login.
 */
function tratarLogin(e) {
    e.preventDefault();

    const campoUsuario = document.getElementById('user-login');
    const campoSenha = document.getElementById('pass-login');
    const msgErro = document.getElementById('msg-erro');

    const usuarioDigitado = campoUsuario.value.trim();
    // A senha não passa por trim(): espaços fazem parte dela
    const senhaDigitada = campoSenha.value;

    if (!usuarioDigitado || !senhaDigitada) {
        exibirErro(msgErro, 'Preencha o usuário e a senha.');
        (usuarioDigitado ? campoSenha : campoUsuario).focus();
        return;
    }

    const credenciaisValidas =
        usuarioDigitado === ADMIN_TESTE.usuario &&
        senhaDigitada === ADMIN_TESTE.senha;

    if (credenciaisValidas) {
        sessionStorage.setItem(CHAVE_SESSAO, 'true');
        window.location.href = 'dashboard.html';
    } else {
        exibirErro(msgErro, 'Usuário ou senha incorretos. Confira e tente novamente.');
        campoUsuario.setAttribute('aria-invalid', 'true');
        campoSenha.setAttribute('aria-invalid', 'true');
        campoSenha.select();
    }
}

/**
 * Exibe uma mensagem de erro no formulário.
 */
function exibirErro(elemento, mensagem) {
    if (!elemento) {
        alert(mensagem); // fallback caso o elemento de erro não exista no HTML
        return;
    }
    elemento.textContent = mensagem;
    elemento.hidden = false;
}

function limparErro() {
    const msgErro = document.getElementById('msg-erro');
    if (msgErro) msgErro.hidden = true;
    ['user-login', 'pass-login'].forEach(id => {
        document.getElementById(id).removeAttribute('aria-invalid');
    });
}

function alternarVisibilidadeSenha() {
    const campoSenha = document.getElementById('pass-login');
    const btn = document.getElementById('btn-ver-senha');
    const mostrar = campoSenha.type === 'password';

    campoSenha.type = mostrar ? 'text' : 'password';
    btn.setAttribute('aria-pressed', String(mostrar));
    btn.setAttribute('aria-label', mostrar ? 'Ocultar senha' : 'Mostrar senha');
    btn.innerHTML = `<i class="fas ${mostrar ? 'fa-eye-slash' : 'fa-eye'}" aria-hidden="true"></i>`;
    campoSenha.focus();
}

/**
 * Protege as páginas administrativas (dashboard.html e admin.html):
 * se o usuário tentar acessá-las sem estar logado, ele é redirecionado
 * de volta para o login.
 */
function protegerPaginaAdmin() {
    if (PAGINAS_PROTEGIDAS.includes(paginaAtual()) && !estaLogado()) {
        window.location.replace('login.html');
    }
}

/**
 * Encerra a sessão do administrador (botão "Sair").
 */
function fazerLogout() {
    try {
        sessionStorage.removeItem(CHAVE_SESSAO);
    } catch (_) { /* nada a limpar */ }
    window.location.href = 'login.html';
}
