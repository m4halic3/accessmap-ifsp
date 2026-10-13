/* =========================================================
   PLANTAS (IMAGENS DO MAPA) E PONTOS DE INTERESSE - ACCESSMAP
   (versão sem banco de dados)
   -----------------------------------------------------------
   Guarda no IndexedDB do navegador:
   - as imagens de mapa enviadas pelo administrador (store "plantas");
   - os pontos de interesse de cada mapa, já com as coordenadas
     ajustadas pelo admin (store "pontos").

   Assim o mapa público (mapa.html) passa a exibir a versão mais
   recente das imagens E dos pontos.

   Por que IndexedDB e não localStorage?
   As plantas são imagens grandes (a original do campus tem ~2,5 MB)
   e o localStorage tem limite de ~5 MB para TUDO. O IndexedDB guarda
   o arquivo (Blob) direto, sem precisar converter para texto base64.

   Limitação conhecida da v1 (igual ao restante do projeto): os dados
   ficam no navegador/dispositivo onde o admin enviou a imagem. Na
   migração para back-end, troque as funções de armazenamento por
   chamadas de API (ex.: POST/GET/DELETE /plantas/:ala e
   GET/PUT /pontos/:ala) — ver README.

   Histórico: cada registro de planta guarda, no campo `anterior`, a
   versão que estava em uso antes da última publicação (ou
   { original: true } se era a imagem original do projeto) JUNTO com
   a lista de pontos daquele mapa naquele momento (`anterior.pontos`).
   Por isso "Voltar ao mapa anterior" devolve a imagem e os pontos
   de interesse como eram.

   Qual mapa ("ala") um ponto pertence:
   - andar "terreo"   -> "todos" (Mapa Geral)
   - andar "subsolo"  -> o valor de bloco_pai ("edificacoes" / "mecanica")
   ========================================================= */
(function () {
    "use strict";

    const DB_NOME = "accessmap";
    const DB_VERSAO = 2; // v2: acrescenta o store "pontos"
    const STORE = "plantas";
    const STORE_PONTOS = "pontos";

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
                if (!db.objectStoreNames.contains(STORE_PONTOS)) {
                    db.createObjectStore(STORE_PONTOS, { keyPath: "ala" });
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
    async function executar(nomeStore, modo, operacao) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(nomeStore, modo);
            const store = tx.objectStore(nomeStore);
            let resultado;

            const req = operacao(store);
            req.onsuccess = () => { resultado = req.result; };

            tx.oncomplete = () => resolve(resultado);
            tx.onerror = () => reject(tx.error || req.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    // ---------------------------------------------------------------
    // Pontos de interesse: ajudantes
    // ---------------------------------------------------------------

    /** Descobre a qual mapa um ponto pertence (ou null se não der pra saber). */
    function alaDoLugar(lugar) {
        if (!lugar) return null;
        if (lugar.andar === "terreo") return "todos";
        if (lugar.andar === "subsolo" && lugar.bloco_pai) return lugar.bloco_pai;
        return null;
    }

    /** Cópia independente (só dados simples) para guardar/restaurar sem compartilhar referência. */
    function copiar(lista) {
        return JSON.parse(JSON.stringify(lista));
    }

    /** Cópia dos pontos de UM mapa, a partir do array `lugares` em memória. */
    function pontosDaAla(lugares, ala) {
        return copiar(lugares.filter((l) => alaDoLugar(l) === ala));
    }

    // Pontos "de fábrica" (os que vêm escritos em mapa.js), guardados na
    // primeira vez para poder voltar a eles ao restaurar o mapa original.
    let padroes = null;

    function capturarPadroes(lugares, alas) {
        if (padroes) return;
        padroes = {};
        alas.forEach((ala) => { padroes[ala] = pontosDaAla(lugares, ala); });
    }

    // Troca, dentro do array `lugares` (que é const em mapa.js, então
    // alteramos "no lugar"), todos os pontos de um mapa por uma nova lista.
    // Preserva a posição dos pontos no array: o 1º ponto novo ocupa o lugar
    // do 1º antigo, e assim por diante. Sobras vão logo após o último antigo.
    function substituirNaLista(lugares, ala, novaLista) {
        const novos = copiar(novaLista);
        const resultado = [];
        let usados = 0;
        let posicaoApos = -1;

        lugares.forEach((l) => {
            if (alaDoLugar(l) !== ala) {
                resultado.push(l);
            } else if (usados < novos.length) {
                resultado.push(novos[usados++]);
                posicaoApos = resultado.length;
            }
        });

        resultado.splice(posicaoApos === -1 ? resultado.length : posicaoApos, 0, ...novos.slice(usados));

        lugares.length = 0;
        resultado.forEach((l) => lugares.push(l));
    }

    // ---------------------------------------------------------------
    // Plantas (imagens)
    // ---------------------------------------------------------------

    function salvar(registro) {
        return executar(STORE, "readwrite", (store) => store.put(registro));
    }

    /**
     * Publica uma nova imagem guardando a versão que estava em uso como
     * "anterior" (na MESMA transação, para nunca perder uma das duas).
     * - Se já havia uma imagem enviada pelo admin, ela vira a "anterior".
     * - Se o mapa estava com a imagem original do projeto, a "anterior"
     *   é só um marcador { original: true }.
     * Em ambos os casos a "anterior" leva junto `pontos`: a lista de pontos
     * de interesse desse mapa como estava ANTES da publicação.
     * Só a versão imediatamente anterior é guardada (1 nível de desfazer).
     */
    async function publicar(registro, pontosAtuais) {
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

                if (Array.isArray(pontosAtuais)) anterior.pontos = pontosAtuais;

                store.put({ ...registro, anterior });
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || leitura.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    /**
     * Volta o mapa para a versão anterior à última publicação: a imagem
     * E os pontos de interesse (se a versão anterior guardou os pontos).
     * Se a anterior era a imagem original do projeto, apenas remove o
     * registro da imagem. Rejeita se não houver versão anterior guardada.
     */
    async function voltarAnterior(ala) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([STORE, STORE_PONTOS], "readwrite");
            const store = tx.objectStore(STORE);
            const storePontos = tx.objectStore(STORE_PONTOS);
            const leitura = store.get(ala);

            leitura.onsuccess = () => {
                const atual = leitura.result;

                if (!atual || !atual.anterior) {
                    reject(new Error("Não há versão anterior guardada para este mapa."));
                    tx.abort();
                    return;
                }

                const { pontos, ...imagemAnterior } = atual.anterior;

                if (imagemAnterior.original) {
                    store.delete(ala);
                } else {
                    store.put({ ...imagemAnterior, ala, anterior: null });
                }

                // Versões criadas antes de existir o histórico de pontos não
                // têm `pontos`: nesse caso os pontos atuais ficam como estão.
                if (Array.isArray(pontos)) {
                    storePontos.put({ ala, lista: pontos });
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || leitura.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    function obter(ala) {
        return executar(STORE, "readonly", (store) => store.get(ala));
    }

    function remover(ala) {
        return executar(STORE, "readwrite", (store) => store.delete(ala));
    }

    /**
     * Restaurar original: apaga a imagem enviada (e o histórico dela) E os
     * pontos salvos desse mapa, voltando ao que vem escrito no projeto.
     */
    async function restaurarOriginal(ala) {
        const db = await abrirBanco();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([STORE, STORE_PONTOS], "readwrite");
            tx.objectStore(STORE).delete(ala);
            tx.objectStore(STORE_PONTOS).delete(ala);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error || new Error("Transação cancelada."));
        });
    }

    // ---------------------------------------------------------------
    // Pontos de interesse (persistência)
    // ---------------------------------------------------------------

    /** Salva a lista de pontos de UM mapa (copiando a partir de `lugares`). */
    function salvarPontos(ala, lugares) {
        return executar(STORE_PONTOS, "readwrite", (store) =>
            store.put({ ala, lista: pontosDaAla(lugares, ala), atualizadoEm: Date.now() })
        );
    }

    function obterPontos(ala) {
        return executar(STORE_PONTOS, "readonly", (store) => store.get(ala));
    }

    /**
     * Atualiza os pontos de UM mapa em `lugares` com o que estiver salvo;
     * se não houver nada salvo, volta para os pontos originais do projeto.
     */
    async function aplicarPontosAla(lugares, ala) {
        if (!padroes) return;
        const registro = await obterPontos(ala);
        const lista = registro && Array.isArray(registro.lista) ? registro.lista : padroes[ala];
        if (!lista) return;
        substituirNaLista(lugares, ala, lista);
    }

    /** Aplica os pontos salvos de todos os mapas. Nunca lança erro. */
    async function aplicarPontosEm(lugares, plantas) {
        try {
            const alas = Object.keys(plantas);
            capturarPadroes(lugares, alas);
            for (const ala of alas) {
                await aplicarPontosAla(lugares, ala);
            }
        } catch (erro) {
            console.warn("AccessMap: não foi possível carregar os pontos salvos. Usando os originais.", erro);
        }
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
        alaDoLugar,
        pontosDaAla,
        salvar,
        publicar,
        voltarAnterior,
        restaurarOriginal,
        obter,
        remover,
        salvarPontos,
        obterPontos,
        aplicarAla,
        aplicarEm,
        aplicarPontosAla,
        aplicarPontosEm
    };
})();
