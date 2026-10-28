/* =========================================================
   AUTENTICAÇÃO - ACCESSMAP
   -----------------------------------------------------------
   O login é conferido pelo servidor (POST /api/auth/login), que
   guarda as contas na tabela `administrador` com a senha em hash
   (BCrypt) e devolve um token de sessão (JWT). O token fica no
   sessionStorage (ver api.js) e vale por algumas horas.
   Depende de api.js (carregado antes).
   ========================================================= */

// Páginas que exigem login (com e sem ".html", pois servidores como o
// `npx serve` removem a extensão da URL)
const PAGINAS_PROTEGIDAS = ['dashboard', 'admin'];

function paginaAtual() {
    return window.location.pathname.split('/').pop().replace(/\.html$/, '');
}

function estaLogado() {
    return AccessMapApi.lerSessao() !== null;
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

    // Veio de uma página do admin porque o token venceu
    if (new URLSearchParams(window.location.search).get('expirou') === '1') {
        exibirErro(document.getElementById('msg-erro'), 'Sua sessão expirou. Faça login novamente.');
    }

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
async function tratarLogin(e) {
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

    const btnEntrar = e.target.querySelector('button[type="submit"]');
    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando...';

    try {
        const resposta = await AccessMapApi.login(usuarioDigitado, senhaDigitada);
        AccessMapApi.salvarSessao(resposta);
        window.location.href = 'dashboard.html';
        return;
    } catch (erro) {
        exibirErro(msgErro, erro.message);
        if (erro.status === 401) {
            campoUsuario.setAttribute('aria-invalid', 'true');
            campoSenha.setAttribute('aria-invalid', 'true');
            campoSenha.select();
        }
    }
    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Entrar';
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
    AccessMapApi.encerrarSessao();
    window.location.href = 'login.html';
}
