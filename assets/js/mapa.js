/**
 * CONFIGURAÇÕES TÉCNICAS DAS PLANTAS (Geral e por Ala)
 * Substitua os caminhos das imagens e dimensões conforme as suas novas plantas.
 */
const plantas = {
    todos: {
        largura: 1500,
        altura: 1056,
        url: 'assets/images/planta-campus.png' 
    },
    edificacoes: {
        largura: 1200, 
        altura: 800,
        url: 'assets/images/planta-edificacoes.png' 
    },
    mecanica: {
        largura: 1200, 
        altura: 800,
        url: 'assets/images/planta-mecanica.png' 
    }
};

/**
 * DATABASE DE LUGARES (Blocos, Salas Internas, Acessibilidade e Alertas)
 */
const lugares = [
    // =========================================================================
    // 1. PONTOS PRINCIPAIS / BLOCOS ÂNCORAS
    // =========================================================================
    { nome: "Bloco Vermelho - Bloco A", tipo: "geral", categoria: "informatica", y: 705, x: 1040, subponto: false },
    { nome: "Bloco Azul - Bloco B", tipo: "geral", categoria: "mecanica", y: 720, x: 780, subponto: false },
    { nome: "Bloco Verde - Bloco C", tipo: "geral", categoria: "edificacoes", y: 720, x: 640, subponto: false },
    { nome: "Bloco de Salas - Bloco D", tipo: "geral", categoria: "administrativo", y: 600, x: 850, subponto: false },
    
    // =========================================================================
    // 2. DEMAIS PONTOS GERAIS DO CAMPUS
    // =========================================================================
    { nome: "Secretaria / Atendimento", tipo: "auditiva", categoria: "secretaria", y: 637, x: 1100, subponto: false },
    { nome: "Bloco de Salas de Aula (Geral)", tipo: "geral", categoria: "geral", y: 700, x: 950, subponto: false },
    { nome: "Biblioteca", tipo: "geral", categoria: "biblioteca", y: 500, x: 1000, subponto: false },
    { nome: "Entrada (Ala da biblioteca)", tipo: "geral", categoria: "entrada", y: 540, x: 1000, subponto: false },
    { nome: "Entrada Principal", tipo: "geral", categoria: "entrada", y: 350, x: 620, subponto: false },
    { nome: "Estacionamento de Ônibus", tipo: "geral", categoria: "estacionamento", y: 320, x: 890, subponto: false },
    { nome: "Estacionamento interno", tipo: "geral", categoria: "estacionamento", y: 520, x: 750, subponto: false },
    { nome: "Quadra Poliesportiva", tipo: "geral", categoria: "quadra", y: 400, x: 500, subponto: false },
    { nome: "Refeitório", tipo: "geral", categoria: "refeitorio", y: 450, x: 550, subponto: false },
    { nome: "Salas Externas", tipo: "geral", categoria: "salas_externas", y: 480, x: 580, subponto: false },

    // =========================================================================
    // 3. DEPENDÊNCIAS INTERNAS / SUBPONTOS (AGRUPADOS POR BLOCO)
    // =========================================================================
    
    // --- BLOCO A (VERMELHO) ---
    { nome: "Bloco A - Laboratório de Redes (Sala 1)", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 710, x: 1045, subponto: true },
    { nome: "Bloco A - Laboratório de Software (Sala 2)", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 700, x: 1035, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 01", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 705, x: 1050, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 02", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 695, x: 1040, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 03", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 715, x: 1030, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 04", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 690, x: 1055, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 05", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 720, x: 1045, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 06", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 685, x: 1035, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 07", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 725, x: 1050, subponto: true },
    { nome: "Bloco A - Sala de Aula Inclusiva 08", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 680, x: 1040, subponto: true },
    { nome: "Bloco A - Auditório Principal", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 712, x: 1058, subponto: true },
    { nome: "Bloco A - Mini Auditório", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 692, x: 1028, subponto: true },
    { nome: "Bloco A - Maker Space / Robótica", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 718, x: 1038, subponto: true },

    // --- BLOCO B (AZUL) ---
    { nome: "Bloco B - Sala de Aula Funcional 21", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 725, x: 785, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 22", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 715, x: 775, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 23", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 730, x: 790, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 24", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 710, x: 770, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 25", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 735, x: 795, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 26", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 705, x: 780, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 27", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 740, x: 785, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 28", tipo: "geral", categoria: "mecanica", bloco_pai: "mecanica", y: 700, x: 775, subponto: true },

    // --- BLOCO C (VERDE) ---
    { nome: "Bloco C - Sala 101 - Desenho Técnico", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 725, x: 645, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 11", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 715, x: 635, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 12", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 730, x: 650, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 13", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 710, x: 630, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 14", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 735, x: 655, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 15", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 705, x: 640, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 16", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 740, x: 645, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 17", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 700, x: 635, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 18", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 745, x: 650, subponto: true },

    // --- BLOCO D (ADMINISTRATIVO) ---
    { nome: "Bloco D - Sala de Aula 31", tipo: "geral", categoria: "administrativo", bloco_pai: "administrativo", y: 605, x: 855, subponto: true },
    { nome: "Bloco D - Sala de Aula 32", tipo: "geral", categoria: "administrativo", bloco_pai: "administrativo", y: 595, x: 845, subponto: true },
    { nome: "Bloco D - Sala de Aula 33", tipo: "geral", categoria: "administrativo", bloco_pai: "administrativo", y: 610, x: 840, subponto: true },
    { nome: "Bloco D - Sala de Aula 34", tipo: "geral", categoria: "administrativo", bloco_pai: "administrativo", y: 590, x: 860, subponto: true },

    // =========================================================================
    // 4. PONTOS DE ACESSIBILIDADE DETALHADOS
    // =========================================================================
    { nome: "Sala de Intérpretes (LIBRAS)", tipo: "auditiva", categoria: "sala_interpretes", y: 645, x: 1110, subponto: false },
    { nome: "Rampa de Acesso - Bloco Geral", tipo: "fisica", categoria: "rampa", y: 690, x: 950, subponto: false },
    { nome: "Escadaria de Acesso Principal", tipo: "fisica", categoria: "escada", y: 360, x: 620, subponto: false },
    { nome: "Elevador - Bloco C (Verde)", tipo: "fisica", categoria: "elevador", bloco_pai: "edificacoes", y: 722, x: 642, subponto: true },
    { nome: "Vagas Exclusivas PCD - Estacionamento", tipo: "fisica", categoria: "vaga_pcd", y: 515, x: 740, subponto: false },

    // =========================================================================
    // 5. ALERTAS E BARREIRAS ARQUITETÔNICAS
    // =========================================================================
    { nome: "Alerta: Degrau sem Rampa no Bloco B (Azul)", tipo: "alerta", categoria: "alerta", bloco_pai: "mecanica", y: 715, x: 775, subponto: true },
    { nome: "Alerta: Calçada Irregular / Acesso à Quadra", tipo: "alerta", categoria: "alerta", y: 410, x: 510, subponto: false },
    { nome: "Alerta: Piso Tátil Interrompido no Corredor Central", tipo: "alerta", categoria: "alerta", y: 600, x: 900, subponto: false },
    { nome: "Alerta: Inclinação Excessiva na Rampa Sul", tipo: "alerta", categoria: "alerta", y: 480, x: 700, subponto: false },
    { nome: "Alerta: Entrada Secundária com Porta Estreita", tipo: "alerta", categoria: "alerta", y: 530, x: 1010, subponto: false },
    { nome: "Alerta: Bebedouro Inadequado no Bloco A (Vermelho)", tipo: "alerta", categoria: "alerta", bloco_pai: "informatica", y: 712, x: 1038, subponto: true },
    { nome: "Alerta: Sanitário PCD Obstruído no Bloco C (Verde)", tipo: "alerta", categoria: "alerta", bloco_pai: "edificacoes", y: 718, x: 644, subponto: true }
];


let mapa;
let marcadores = [];
let camadaImagem = null; 
let filtroAtual = null;
let alaAtual = "todos"; 
let primeiraInicializacao = true; 
/**
 * DEFINE O ÍCONE (IMAGEM OU COR) BASEADO NO TIPO COM ATRIBUTOS ALT DE ACESSIBILIDADE
 */
function getIcon(categoria, tipo, nomeLugar) {
    if (tipo === "alerta") {
        return L.icon({
            iconUrl: 'assets/images/icone-alerta.png',
            shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
            iconSize: [25, 25],       
            iconAnchor: [12, 25],     
            popupAnchor: [0, -22],
            alt: `Ícone de alerta triangular amarelo indicando barreira arquitetônica em: ${nomeLugar}`
        });
    }

    let cor = "grey"; 
    let descricaoAlt = `Marcador de ponto de interesse: ${nomeLugar}`;

    if (tipo === "auditiva") {
        cor = "red"; 
        descricaoAlt = `Ícone vermelho indicando acessibilidade auditiva em: ${nomeLugar}`;
    } else if (tipo === "fisica") {
        if (categoria === "vaga_pcd") {
            cor = "lightgreen"; 
            descricaoAlt = `Ícone verde claro indicando vaga exclusiva PCD em: ${nomeLugar}`;
        } else {
            cor = "green"; 
            descricaoAlt = `Ícone verde indicando estrutura de acessibilidade física em: ${nomeLugar}`;
        }
    } else {
        if (categoria === "secretaria") cor = "red";
        if (categoria === "mecanica") cor = "blue";    
        if (categoria === "biblioteca") cor = "red";    
        if (categoria === "edificacoes") cor = "green";    
        if (categoria === "informatica") cor = "red"; 
        if (categoria === "geral") cor = "red";   
        
        // --- ADICIONADO: COR ROXA (VIOLET) PARA O BLOCO D ---
        if (categoria === "administrativo") {
            cor = "violet";
            descricaoAlt = `Ícone roxo indicando o Bloco D ou suas dependências em: ${nomeLugar}`;
        }
        
        if (
            categoria === "estacionamento" || 
            categoria === "entrada" || 
            categoria === "quadra" || 
            categoria === "refeitorio" || 
            categoria === "salas_externas"
        ) {
            cor = "orange";
        }
    }

    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        iconSize: [18, 30],       
        iconAnchor: [9, 30],       
        popupAnchor: [1, -26],
        alt: descricaoAlt
    });
}

/**
 * INICIALIZAÇÃO DO MAPA
 */
function initMap() {
    mapa = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 3
    });

    primeiraInicializacao = true; 
    atualizarPlantaDeFundo();

    mapa.on('click', function(e) {
        console.log(`y: ${e.latlng.lat.toFixed(0)}, x: ${e.latlng.lng.toFixed(0)}`);
    });
}

/**
 * ATUALIZA A IMAGEM DE FUNDO ADICIONANDO TEXTO ALTERNATIVO (ALT)
 */
function atualizarPlantaDeFundo() {
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    let textAltPlanta = "Mapa do Campus Geral com distribuição dos blocos e caminhos.";
    if (alaAtual === "edificacoes") textAltPlanta = "Planta baixa detalhada do Bloco C (Verde).";
    if (alaAtual === "mecanica") textAltPlanta = "Planta baixa detalhada do Bloco B (Azul).";

    camadaImagem = L.imageOverlay(dadosPlanta.url, limites, {
        alt: textAltPlanta
    }).addTo(mapa);
    
    mapa.fitBounds(limites);
    aplicarFiltrosCombinados();
}

/**
 * UNIFICAÇÃO LÓGICA DE FILTRAGEM
 */
function aplicarFiltrosCombinados() {
    let filtrados = lugares;

    const searchInput = document.getElementById('search-input');
    const termo = searchInput ? searchInput.value.toLowerCase() : "";

    if (alaAtual === "todos") {
        if (!termo && !filtroAtual) {
            filtrados = filtrados.filter(l => l.subponto === false);
        }
    } else {
        filtrados = filtrados.filter(l => l.categoria === alaAtual || l.bloco_pai === alaAtual);
    }

    if (filtroAtual) {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    if (termo) {
        filtrados = filtrados.filter(l => l.nome.toLowerCase().includes(termo));
    }

    if (alaAtual === "todos" && primeiraInicializacao && !termo && !filtroAtual) {
        limparMarcadores(); 
        const blocosPrincipais = lugares.filter(l => l.subponto === false);
        atualizarListaLateral(blocosPrincipais); 
    } else {
        mostrarLugares(filtrados);
    }
}

/**
 * FUNÇÃO DE FILTRAGEM DOS BOTÕES DE ALA
 */
function filtrarAla(ala, elemento) {
    primeiraInicializacao = false; 

    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
    });
    
    alaAtual = ala;
    elemento.classList.add("active"); 

    atualizarPlantaDeFundo();
}

/**
 * RENDERIZA OS MARCADORES NO MAPA
 */
function mostrarLugares(lista) {
    limparMarcadores();
    lista.forEach(lugar => adicionarMarcador(lugar));
}

/**
 * ADICIONA UM MARCADOR INDIVIDUAL AO MAPA
 */
function adicionarMarcador(lugar) {
    const marcador = L.marker([lugar.y, lugar.x], {
        icon: getIcon(lugar.categoria, lugar.tipo, lugar.nome) 
    }).addTo(mapa);

    let textoPopup = lugar.tipo.toUpperCase();
    if (lugar.tipo === "geral") textoPopup = "Ponto de Interesse";
    
    if (lugar.tipo === "alerta") {
        textoPopup = "<span style='color:#800000; font-weight:bold;'>⚠️ Barreira Física Encontrada (Necessita de Melhorias)</span>";
    }
    if (lugar.tipo === "fisica") textoPopup = "Acessibilidade Física";
    if (lugar.tipo === "auditiva") textoPopup = "Acessibilidade Auditiva";

    marcador.bindPopup(`
        <div style="text-align:center;">
            <strong style="font-size:14px; color:#5a2a83;">${lugar.nome}</strong><br>
            <span style="color:#333333; font-size:12px;">${textoPopup}</span>
        </div>
    `);
    
    marcadores.push(marcador);
    return marcador;
}

function limparMarcadores() {
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];
}

/**
 * FILTRAR POR ACESSIBILIDADE OU ALERTA
 */
function filtrar(tipo, elemento) {
    primeiraInicializacao = false; 

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));

    if (filtroAtual === tipo) {
        filtroAtual = null;
    } else {
        filtroAtual = tipo;
        elemento.classList.add("ativo");
    }
    aplicarFiltrosCombinados();
}

/**
 * BUSCA POR TEXTO
 */
function pesquisarLugares() {
    primeiraInicializacao = false; 
    aplicarFiltrosCombinados();
}

/**
 * ATUALIZA A LISTA LATERAL TEXTUAL COM ISOLAMENTO DE MARCADOR ÚNICO OU EXPANSÃO DE BLOCOS
 */
function atualizarListaLateral(lista) {
    const container = document.getElementById("lista-lugares");
    if (!container) return;
    
    container.innerHTML = "";

    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar"; 
        
        let corBorda = "#ccc"; 
        const categoriaAlvo = lugar.bloco_pai || lugar.categoria;
        
        // --- LÓGICA DE CORES DOS BLOCOS (INCLUINDO O BLOCO D) ---
        if (categoriaAlvo === "informatica" || lugar.nome.includes(" - Bloco A")) {
            corBorda = "#790000"; // Vermelho (A)
        } else if (categoriaAlvo === "mecanica" || lugar.nome.includes(" - Bloco B")) {
            corBorda = "#002f5e"; // Azul (B)
        } else if (categoriaAlvo === "edificacoes" || lugar.nome.includes(" - Bloco C")) {
            corBorda = "#005b26"; // Verde (C)
        } else if (categoriaAlvo === "administrativo" || lugar.nome.includes(" - Bloco D")) {
            corBorda = "#4e0071"; // Roxo/Púrpura para o Bloco D
        } else if (lugar.tipo === "alerta") {
            corBorda = "#e67e22"; // Laranja para alertas
        }

        // Estilos visuais do item da lista
        item.style.borderLeft = `5px solid ${corBorda}`;
        item.style.padding = "10px 15px";
        item.style.marginBottom = "8px";
        item.style.backgroundColor = "#f9f9f9";
        item.style.borderRadius = "4px";
        item.style.cursor = "pointer";
        item.style.transition = "background-color 0.2s ease";

        item.onmouseenter = () => item.style.backgroundColor = "#f1f1f1";
        item.onmouseleave = () => item.style.backgroundColor = "#f9f9f9";

        let labelAcessibilidade = "Ponto de Interesse";
        if (lugar.tipo === "alerta") labelAcessibilidade = "<span style='color:#800000; font-weight:bold;'>⚠️ Necessita de Melhorias</span>";
        else if (lugar.subponto) labelAcessibilidade = "Dependência Interna";

        item.innerHTML = `
            <p style="margin: 0 0 5px 0;"><strong>${lugar.nome}</strong></p>
            <span style="font-size: 12px; color: #666;">${labelAcessibilidade}</span>
        `;
        
        item.onclick = () => {
            if (primeiraInicializacao) {
                primeiraInicializacao = false;
            }

            limparMarcadores();

            // Incluído 'administrativo' na lista para que o Bloco D também mostre todas as suas salas
            const categoriasBlocos = ["informatica", "mecanica", "edificacoes", "administrativo"];
            
            if (!lugar.subponto && categoriasBlocos.includes(lugar.categoria)) {
                const blocoRaiz = adicionarMarcador(lugar);
                
                // Pega todas as salas vinculadas a este bloco específico
                const subSalas = lugares.filter(l => l.bloco_pai === lugar.categoria);
                subSalas.forEach(sala => adicionarMarcador(sala));

                mapa.setView([lugar.y, lugar.x], 1);
                blocoRaiz.openPopup();
                return;
            }

            // Caso seja uma sala individual clicada diretamente
            const marcadorUnico = adicionarMarcador(lugar);
            mapa.setView([lugar.y, lugar.x], 1);
            marcadorUnico.openPopup();
        };
        
        container.appendChild(item);
    });
}
/**
 * MOSTRAR TODOS
 */
function mostrarTodos() {
    filtroAtual = null;
    alaAtual = "todos";
    primeiraInicializacao = false; 

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
    });
    
    const botoesAla = document.querySelectorAll("#seletor-alas .btn-type");
    if (botoesAla.length > 0) {
        botoesAla[0].classList.add("active");
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    atualizarPlantaDeFundo();
}

window.onload = initMap;