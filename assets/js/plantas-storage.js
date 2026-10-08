/* =========================================================
   PLANTAS (IMAGENS DO MAPA) - ACCESSMAP (versão sem banco de dados)
   -----------------------------------------------------------
   Guarda no IndexedDB do navegador as imagens de mapa enviadas
   pelo administrador, para que o mapa público (mapa.html) passe
   a exibir a versão mais recente.

   Por que IndexedDB e não localStorage?
   As plantas são imagens grandes (a original do campus tem ~2,5 MB)
   e o localStorage tem limite de ~5 MB para TUDO. O IndexedDB guarda
   o arquivo (Blob) direto, sem precisar converter para texto base64.

   Limitação conhecida da v1 (igual ao restante do projeto): os dados
   ficam no navegador/dispositivo onde o admin enviou a imagem. Na
   migração para back-end, troque salvar/obter/remover por chamadas
   de API (ex.: POST/GET/DELETE /plantas/:ala) — ver README.

   Histórico: cada registro guarda, no campo `anterior`, a versão que
   estava em uso antes da última publicação (ou { original: true } se
   era a imagem original do projeto), permitindo "Voltar ao mapa anterior".
   ========================================================= */
(function () {
    "use strict";

    const DB_NOME = "accessmap";
    const DB_VERSAO = 1;
    const STORE = "plantas";

    const TIPOS_ACEITOS = ["image/png", "image/jpeg", "image/webp"];
    const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10 MB

    let promessaBanco = null;

    function abrirBanco() {
        if (promessaBanco) return promessaBanco;

        promessaBanco = new Promise((resolve, reject) => {
            if (!("indexedDB" in window)) {
                reject(new Error("IndexedDB indisponível neste navegador."));
                return;
            }

            const req = indexedDB.open(DB_NOME, DB_VERSAO);

            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(STORE)) {
                    db.createObjectStore(STORE, { keyPath: "ala" });
                }
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error || new Error("Falha ao abrir o banco local."));
            req.onblocked = () => reject(new Error("O banco local está bloqueado por outra aba."));
        });

        // Se falhar, permite tentar de novo numa próxima chamada
        promessaBanco.catch(() => { promessaBanco = null; });
        return promessaBanco;
    }

    // Executa uma operação numa transação e só resolve quando ela é concluída
    async function executar(modo, operacao) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, modo);
            const store = tx.objectStore(STORE);
            let resultado;

            const req = operacao(store);
            req.onsuccess = () => { resultado = req.result; };

            tx.oncomplete = () => resolve(resultado);
            tx.onerror = () => reject(tx.error || req.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    function salvar(registro) {
        return executar("readwrite", (store) => store.put(registro));
    }

    /**
     * Publica uma nova imagem guardando a versão que estava em uso como
     * "anterior" (na MESMA transação, para nunca perder uma das duas).
     * - Se já havia uma imagem enviada pelo admin, ela vira a "anterior".
     * - Se o mapa estava com a imagem original do projeto, a "anterior"
     *   é só um marcador { original: true }.
     * Só a versão imediatamente anterior é guardada (1 nível de desfazer).
     */
    async function publicar(registro) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readwrite");
            const store = tx.objectStore(STORE);
            const leitura = store.get(registro.ala);

            leitura.onsuccess = () => {
                const atual = leitura.result;
                let anterior;

                if (atual && atual.blob) {
                    // eslint-disable-next-line no-unused-vars
                    const { anterior: _descartada, ...resto } = atual;
                    anterior = resto;
                } else {
                    anterior = { original: true };
                }

                store.put({ ...registro, anterior });
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || leitura.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    /**
     * Volta o mapa para a versão anterior à última publicação.
     * Se a anterior era a imagem original do projeto, apenas remove o registro.
     * Rejeita se não houver versão anterior guardada.
     */
    async function voltarAnterior(ala) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE, "readwrite");
            const store = tx.objectStore(STORE);
            const leitura = store.get(ala);

            leitura.onsuccess = () => {
                const atual = leitura.result;

                if (!atual || !atual.anterior) {
                    reject(new Error("Não há versão anterior guardada para este mapa."));
                    tx.abort();
                    return;
                }

                if (atual.anterior.original) {
                    store.delete(ala);
                } else {
                    store.put({ ...atual.anterior, ala, anterior: null });
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || leitura.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    function obter(ala) {
        return executar("readonly", (store) => store.get(ala));
    }

    function remover(ala) {
        return executar("readwrite", (store) => store.delete(ala));
    }

    /**
     * Atualiza UMA planta do objeto `plantas` (definido em mapa.js) com o que
     * estiver salvo no banco: se houver imagem enviada pelo admin, usa ela;
     * senão volta para a imagem original do projeto.
     */
    async function aplicarAla(plantas, ala) {
        const planta = plantas[ala];
        if (!planta) return;

        // Guarda a imagem original na primeira vez, para poder restaurar depois
        if (!planta.urlOriginal) planta.urlOriginal = planta.url;

        const registro = await obter(ala);

        if (planta.urlPersonalizada) {
            URL.revokeObjectURL(planta.urlPersonalizada);
            planta.urlPersonalizada = null;
        }

        if (registro && registro.blob) {
            planta.urlPersonalizada = URL.createObjectURL(registro.blob);
            planta.url = planta.urlPersonalizada;
            planta.alt = registro.alt || "";
            planta.personalizada = true;
            planta.meta = {
                nome: registro.nome,
                atualizadoEm: registro.atualizadoEm,
                largura: registro.largura,
                altura: registro.altura
            };
            planta.temAnterior = !!registro.anterior;
        } else {
            planta.url = planta.urlOriginal;
            planta.alt = "";
            planta.personalizada = false;
            planta.meta = null;
            planta.temAnterior = false;
        }
    }

    /** Aplica todas as plantas salvas. Nunca lança erro: se o banco falhar, o mapa usa as originais. */
    async function aplicarEm(plantas) {
        try {
            for (const ala of Object.keys(plantas)) {
                await aplicarAla(plantas, ala);
            }
        } catch (erro) {
            console.warn("AccessMap: não foi possível carregar as imagens de mapa salvas. Usando as originais.", erro);
        }
    }

    window.PlantasStorage = {
        TIPOS_ACEITOS,
        TAMANHO_MAXIMO,
        salvar,
        publicar,
        voltarAnterior,
        obter,
        remover,
        aplicarAla,
        aplicarEm
    };
})();