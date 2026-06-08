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
    // === PONTOS PRINCIPAIS / BLOCOS ÂNCORAS ===
    { nome: "Ala de Informática (Laboratórios)", tipo: "geral", categoria: "informatica", y: 705, x: 1040, subponto: false },
    { nome: "Secretaria / Atendimento", tipo: "auditiva", categoria: "secretaria", y: 637, x: 1100, subponto: false },
    { nome: "Bloco de Salas (Edificações)", tipo: "geral", categoria: "edificacoes", y: 720, x: 640, subponto: false },
    { nome: "Bloco de Salas (Mecânica)", tipo: "geral", categoria: "mecanica", y: 720, x: 780, subponto: false },
    { nome: "Bloco de Salas de Aula (Geral)", tipo: "geral", categoria: "geral", y: 700, x: 950, subponto: false },
    { nome: "Biblioteca", tipo: "geral", categoria: "biblioteca", y: 500, x: 1000, subponto: false },
    { nome: "Entrada (Ala da biblioteca)", tipo: "geral", categoria: "entrada", y: 540, x: 1000, subponto: false },
    { nome: "Entrada Principal", tipo: "geral", categoria: "entrada", y: 350, x: 620, subponto: false },
    { nome: "Estacionamento de Ônibus", tipo: "geral", categoria: "estacionamento", y: 320, x: 890, subponto: false },
    { nome: "Estacionamento interno", tipo: "geral", categoria: "estacionamento", y: 520, x: 750, subponto: false },
    { nome: "Quadra Poliesportiva", tipo: "geral", categoria: "quadra", y: 400, x: 500, subponto: false },
    { nome: "Refeitório", tipo: "geral", categoria: "refeitorio", y: 450, x: 550, subponto: false },
    { nome: "Salas Externas", tipo: "geral", categoria: "salas_externas", y: 480, x: 580, subponto: false },

    // === SUBPONTOS / SALAS INTERNAS ===
    { nome: "Laboratório de Redes (Sala 1)", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 710, x: 1045, subponto: true },
    { nome: "Laboratório de Software (Sala 2)", tipo: "geral", categoria: "informatica", bloco_pai: "informatica", y: 700, x: 1035, subponto: true },
    { nome: "Sala 101 - Desenho Técnico", tipo: "geral", categoria: "edificacoes", bloco_pai: "edificacoes", y: 725, x: 645, subponto: true },

    // === PONTOS DE ACESSIBILIDADE DETALHADOS ===
    { nome: "Sala de Intérpretes (LIBRAS)", tipo: "auditiva", categoria: "sala_interpretes", y: 645, x: 1110, subponto: false },
    { nome: "Rampa de Acesso - Bloco Geral", tipo: "fisica", categoria: "rampa", y: 690, x: 950, subponto: false },
    { nome: "Escadaria de Acesso Principal", tipo: "fisica", categoria: "escada", y: 360, x: 620, subponto: false },
    { nome: "Elevador - Bloco Edificações", tipo: "fisica", categoria: "elevador", bloco_pai: "edificacoes", y: 722, x: 642, subponto: true },
    { nome: "Vagas Exclusivas PCD - Estacionamento", tipo: "fisica", categoria: "vaga_pcd", y: 515, x: 740, subponto: false },

    // === PONTOS DE ALERTA / CUIDADO NA ACESSIBILIDADE FÍSICA ===
    { nome: "Alerta: Degrau sem Rampa no Bloco de Mecânica", tipo: "alerta", categoria: "alerta", bloco_pai: "mecanica", y: 715, x: 775, subponto: true },
    { nome: "Alerta: Calçada Irregular / Acesso à Quadra", tipo: "alerta", categoria: "alerta", y: 410, x: 510, subponto: false }
];

let mapa;
let marcadores = [];
let camadaImagem = null; 
let filtroAtual = null;
let alaAtual = "todos"; 
let primeiraInicializacao = true; 

/**
 * DEFINE A COR DO ÍCONE BASEADO NA CATEGORIA / TIPO DE ACESSIBILIDADE
 */
function getIcon(categoria, tipo) {
    if (tipo === "alerta") {
        return L.icon({
            iconUrl: 'assets/images/icone-alerta.png',
            shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
            iconSize: [25, 25],       
            iconAnchor: [12, 25],     
            popupAnchor: [0, -22]     
        });
    }

    let cor = "grey"; 

    if (tipo === "auditiva") {
        cor = "red"; 
    } else if (tipo === "fisica") {
        if (categoria === "vaga_pcd") {
            cor = "lightgreen"; 
        } else {
            cor = "green"; 
        }
    } else {
        if (categoria === "secretaria") cor = "red";
        if (categoria === "mecanica") cor = "blue";    
        if (categoria === "biblioteca") cor = "red";    
        if (categoria === "edificacoes") cor = "green";    
        if (categoria === "informatica") cor = "red"; 
        if (categoria === "geral") cor = "red";   
        
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
        popupAnchor: [1, -26]      
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
 * ATUALIZA A IMAGEM DE FUNDO DO LEAFLET DINAMICAMENTE
 */
function atualizarPlantaDeFundo() {
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    camadaImagem = L.imageOverlay(dadosPlanta.url, limites).addTo(mapa);
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

    // 1. Controle de Visibilidade Macro/Micro por Ala
    if (alaAtual === "todos") {
        if (!termo && !filtroAtual) {
            filtrados = filtrados.filter(l => l.subponto === false);
        }
    } else {
        filtrados = filtrados.filter(l => l.categoria === alaAtual || l.bloco_pai === alaAtual);
    }

    // 2. Filtragem por Tipo de Acessibilidade / Alerta
    if (filtroAtual) {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    // 3. Filtragem por Barra de Pesquisa Texto
    if (termo) {
        filtrados = filtrados.filter(l => l.nome.toLowerCase().includes(termo));
    }

    // 4. Decisão de renderização do mapa limpo no estado inicial
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

    lista.forEach(lugar => {
        const marcador = L.marker([lugar.y, lugar.x], {
            icon: getIcon(lugar.categoria, lugar.tipo) 
        }).addTo(mapa);

        let textoPopup = lugar.tipo.toUpperCase();
        if (lugar.tipo === "geral") textoPopup = "Ponto de Interesse";
        if (lugar.tipo === "alerta") textoPopup = "⚠️ ATENÇÃO: Barreira Física Encontrada";
        if (lugar.tipo === "fisica") textoPopup = "Acessibilidade Física";
        if (lugar.tipo === "auditiva") textoPopup = "Acessibilidade Auditiva";

        marcador.bindPopup(`
            <div style="text-align:center;">
                <strong style="font-size:14px; color:#5a2a83;">${lugar.nome}</strong><br>
                <span style="color:#666; font-size:12px;">${textoPopup}</span>
            </div>
        `);
        
        marcadores.push(marcador);
    });

    atualizarListaLateral(lista);
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
 * ATUALIZA A LISTA LATERAL TEXTUAL
 */
function atualizarListaLateral(lista) {
    const container = document.getElementById("lista-lugares");
    if (!container) return;
    
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p style='padding:15px; color:#888;'>Nenhum local encontrado para os filtros aplicados.</p>";
        return;
    }

    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar"; 
        
        let labelAcessibilidade = "Ponto de Interesse";
        if (lugar.tipo === "alerta") labelAcessibilidade = "⚠️ Alerta de Acessibilidade";
        else if (lugar.tipo === "fisica") labelAcessibilidade = "Acessibilidade Física";
        else if (lugar.tipo === "auditiva") labelAcessibilidade = "Acessibilidade Auditiva";
        else if (lugar.subponto) labelAcessibilidade = "Dependência Interna";

        item.innerHTML = `
            <p><strong>${lugar.nome}</strong></p>
            <span>${labelAcessibilidade}</span>
        `;
        
        item.onclick = () => {
            if (primeiraInicializacao) {
                primeiraInicializacao = false;
                
                if (lugar.subponto && lugar.bloco_pai) {
                    alaAtual = lugar.bloco_pai;
                    atualizarPlantaDeFundo();
                    return;
                }
                
                aplicarFiltrosCombinados();
            }

            if (!lugar.subponto && plantas[lugar.categoria] && alaAtual === "todos") {
                alaAtual = lugar.categoria;
                const btnCorrespondente = document.querySelector(`#seletor-alas .btn-type[onclick*="'${lugar.categoria}'"]`);
                if (btnCorrespondente) {
                    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => btn.classList.remove("active"));
                    btnCorrespondente.classList.add("active");
                }
                atualizarPlantaDeFundo();
                return;
            }

            mapa.setView([lugar.y, lugar.x], 1);
            marcadores.forEach(m => {
                if (m.getLatLng().lat === lugar.y && m.getLatLng().lng === lugar.x) {
                    m.openPopup();
                }
            });
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