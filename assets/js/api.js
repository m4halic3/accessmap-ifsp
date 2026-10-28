/* =========================================================
   API - ACCESSMAP (comunicação com o back-end)
   -----------------------------------------------------------
   Todas as páginas falam com o servidor (Spring Boot + MariaDB)
   por aqui. Por padrão a API fica na mesma origem da página
   (http://localhost:8080/api, onde o back-end também serve o site).
   Para usar o front em outro servidor, defina antes deste script:
       <script>window.ACCESSMAP_API_URL = "http://localhost:8080/api";</script>

   O login do administrador devolve um token (JWT), guardado no
   sessionStorage e enviado no cabeçalho Authorization das rotas
   restritas. Fechar o navegador encerra a sessão.
   ========================================================= */
(function () {
    "use strict";

    const BASE = (window.ACCESSMAP_API_URL || "/api").replace(/\/$/, "");
    const CHAVE_TOKEN = "accessmap_token";

    /** Erro de uma chamada à API; `mensagem` já pode ser mostrada ao usuário. */
    class ErroApi extends Error {
        constructor(mensagem, status, campos) {
            super(mensagem);
            this.name = "ErroApi";
            this.status = status;   // 0 = servidor fora do ar / sem conexão
            this.campos = campos || null;
        }
    }

    // ---------------- Sessão do administrador ----------------
    function lerSessao() {
        try {
            const sessao = JSON.parse(sessionStorage.getItem(CHAVE_TOKEN));
            if (sessao && sessao.token && new Date(sessao.expiraEm) > new Date()) return sessao;
        } catch (_) { /* sem sessão */ }
        return null;
    }

    function salvarSessao(resposta) {
        sessionStorage.setItem(CHAVE_TOKEN, JSON.stringify({
            token: resposta.token,
            expiraEm: resposta.expiraEm,
            usuario: resposta.usuario
        }));
    }

    function encerrarSessao() {
        try {
            sessionStorage.removeItem(CHAVE_TOKEN);
        } catch (_) { /* nada a limpar */ }
    }

    // Sessão vencida no meio do uso: volta para o login
    function sessaoExpirou() {
        encerrarSessao();
        if (!/login(\.html)?$/.test(window.location.pathname)) {
            window.location.replace("login.html?expirou=1");
        }
    }

    // ---------------- Requisições ----------------
    /**
     * Faz uma chamada à API e devolve o JSON da resposta (ou null se vazia).
     * opcoes: { metodo, corpo (objeto ou FormData), autenticado (envia o token) }
     */
    async function requisitar(caminho, opcoes = {}) {
        const { metodo = "GET", corpo, autenticado = false } = opcoes;
        const headers = { Accept: "application/json" };

        if (autenticado) {
            const sessao = lerSessao();
            if (!sessao) {
                sessaoExpirou();
                throw new ErroApi("Sua sessão expirou. Faça login novamente.", 401);
            }
            headers.Authorization = `Bearer ${sessao.token}`;
        }

        let body;
        if (corpo instanceof FormData) {
            body = corpo; // o navegador define o Content-Type (multipart)
        } else if (corpo !== undefined) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(corpo);
        }

        let resposta;
        try {
            resposta = await fetch(BASE + caminho, { method: metodo, headers, body });
        } catch (_) {
            throw new ErroApi("Não foi possível falar com o servidor. Verifique a conexão e tente novamente.", 0);
        }

        const texto = await resposta.text();
        let dados = null;
        if (texto) {
            try { dados = JSON.parse(texto); } catch (_) { dados = null; }
        }

        if (!resposta.ok) {
            if (resposta.status === 401 && autenticado) sessaoExpirou();
            const mensagem = (dados && dados.mensagem) || "O servidor não conseguiu concluir a operação. Tente novamente.";
            throw new ErroApi(mensagem, resposta.status, dados && dados.campos);
        }
        return dados;
    }

    /** Converte um caminho devolvido pela API ("/api/...") em URL completa. */
    function urlAbsoluta(caminho) {
        const origem = new URL(BASE, window.location.href).origin;
        return new URL(caminho, origem).href;
    }

    window.AccessMapApi = {
        ErroApi,
        requisitar,
        urlAbsoluta,
        lerSessao,
        salvarSessao,
        encerrarSessao,

        login: (usuario, senha) => requisitar("/auth/login", { metodo: "POST", corpo: { usuario, senha } }),

        // Locais do mapa
        listarPontos: () => requisitar("/pontos"),
        criarPonto: (ponto) => requisitar("/pontos", { metodo: "POST", corpo: ponto, autenticado: true }),
        atualizarPonto: (id, ponto) => requisitar(`/pontos/${id}`, { metodo: "PUT", corpo: ponto, autenticado: true }),
        excluirPonto: (id) => requisitar(`/pontos/${id}`, { metodo: "DELETE", autenticado: true }),
        restaurarPontosOriginais: () => requisitar("/pontos/restaurar-originais", { metodo: "POST", autenticado: true }),

        // Colaborações do formulário público
        enviarColaboracao: (colaboracao) => requisitar("/colaboracoes", { metodo: "POST", corpo: colaboracao }),
        listarColaboracoes: () => requisitar("/colaboracoes", { autenticado: true }),
        excluirColaboracao: (id) => requisitar(`/colaboracoes/${id}`, { metodo: "DELETE", autenticado: true }),
        restaurarColaboracao: (id) => requisitar(`/colaboracoes/${id}/restaurar`, { metodo: "POST", autenticado: true }),

        // Imagens de planta
        listarPlantas: () => requisitar("/plantas"),
        publicarPlanta: (ala, formData) => requisitar(`/plantas/${ala}`, { metodo: "POST", corpo: formData, autenticado: true }),
        voltarPlantaAnterior: (ala) => requisitar(`/plantas/${ala}/voltar`, { metodo: "POST", autenticado: true }),
        restaurarPlantaOriginal: (ala) => requisitar(`/plantas/${ala}`, { metodo: "DELETE", autenticado: true })
    };
})();
