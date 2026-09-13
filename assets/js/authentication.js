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

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('form-login');

    if (formLogin) {
        formLogin.addEventListener('submit', tratarLogin);
    }

    protegerPaginaAdmin();
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
    const senhaDigitada = campoSenha.value.trim();

    const credenciaisValidas =
        usuarioDigitado === ADMIN_TESTE.usuario &&
        senhaDigitada === ADMIN_TESTE.senha;

    if (credenciaisValidas) {
        // Marca a sessão como autenticada
        sessionStorage.setItem(CHAVE_SESSAO, 'true');

        // Redireciona para o dashboard
        window.location.href = 'dashboard.html';
    } else {
        exibirErro(msgErro, 'Usuário ou senha inválidos.');
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
    elemento.style.display = 'block';
}

/**
 * Protege a página do dashboard: se o usuário tentar acessar
 * dashboard.html sem estar logado, ele é redirecionado de volta
 * para o login.
 */
function protegerPaginaAdmin() {
    const paginaAtual = window.location.pathname.split('/').pop();

    if (paginaAtual === 'dashboard.html') {
        const estaLogado = sessionStorage.getItem(CHAVE_SESSAO) === 'true';

        if (!estaLogado) {
            window.location.href = 'login.html';
        }
    }
}

/**
 * Função opcional de logout, para usar em um botão "Sair"
 * dentro do dashboard.
 */
function fazerLogout() {
    sessionStorage.removeItem(CHAVE_SESSAO);
    window.location.href = 'login.html';
}