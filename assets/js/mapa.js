/**
 * CONFIGURAÇÕES TÉCNICAS DAS PLANTAS (Geral e por Ala)
 * Substitua os caminhos das imagens e dimensões conforme as suas novas plantas.
 */
const plantas = {
    todos: {
        largura: 1500,
        altura: 1056,
        url: 'assets/images/planta-campus.jpg' 
    },
    edificacoes: {
        largura: 1200, // Ajuste se a imagem da ala edif tiver tamanho diferente
        altura: 800,
        url: 'assets/images/planta-edificacoes.jpg' // Caminho da planta de Edificações
    },
    mecanica: {
        largura: 1200, // Ajuste se a imagem da ala mec tiver tamanho diferente
        altura: 800,
        url: 'assets/images/planta-mecanica.jpg' // Caminho da planta de Mecânica
    }
};

/**
 * DATABASE DE LUGARES ORIGINAL (Mantido intacto)
 */
const lugares = [
    { nome: "Ala de Informática (Laboratórios)", tipo: "fisica", categoria: "informatica", y: 705, x: 1040 },
    { nome: "Secretaria / Atendimento", tipo: "auditiva", categoria: "secretaria", y: 637, x: 1100 },
    { nome: "Bloco de Salas (Edificações)", tipo: "fisica", categoria: "edificacoes", y: 720, x: 640 },
    { nome: "Bloco de Salas (Mecânica)", tipo: "fisica", categoria: "mecanica", y: 720, x: 780 },
    { nome: "Bloco de Salas de Aula (Geral)", tipo: "fisica", categoria: "geral", y: 700, x: 950 },
    { nome: "Biblioteca", tipo: "fisica", categoria: "biblioteca", y: 500, x: 1000 },
    { nome: "Entrada (Ala da biblioteca)", tipo: "fisica", categoria: "entrada", y: 540, x: 1000 },
    { nome: "Entrada Principal", tipo: "fisica", categoria: "entrada", y: 350, x: 620 },
    { nome: "Estacionamento de Ônibus", tipo: "fisica", categoria: "estacionamento", y: 320, x: 890 },
    { nome: "Estacionamento interno", tipo: "fisica", categoria: "estacionamento", y: 520, x: 750 }
];

let mapa;
let marcadores = [];
let camadaImagem = null; // Guarda a referência da imagem de fundo atual
let filtroAtual = null;
let alaAtual = "todos"; 

/**
 * DEFINE A COR DO ÍCONE BASEADO NA CATEGORIA
 */
function getIcon(categoria) {
    let cor = "grey"; 

    if (categoria === "secretaria") cor = "blue";
    if (categoria === "mecanica") cor = "violet";    
    if (categoria === "biblioteca") cor = "yellow";    
    if (categoria === "edificacoes") cor = "red";    
    if (categoria === "estacionamento") cor = "green"; 
    if (categoria === "entrada") cor = "orange";
    if (categoria === "informatica") cor = "black"; 
    if (categoria === "geral") cor = "grey";    

    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
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

    // Carrega a primeira planta (Geral)
    atualizarPlantaDeFundo();

    mapa.on('click', function(e) {
        console.log(`y: ${e.latlng.lat.toFixed(0)}, x: ${e.latlng.lng.toFixed(0)}`);
    });
}

/**
 * NOVO: ATUALIZA A IMAGEM DE FUNDO DO LEAFLET DINAMICAMENTE
 */
function atualizarPlantaDeFundo() {
    // Se já existir uma imagem no mapa, remove para colocar a nova
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    // Cria e adiciona o novo overlay de imagem correspondente à ala
    camadaImagem = L.imageOverlay(dadosPlanta.url, limites).addTo(mapa);
    mapa.fitBounds(limites);

    // Reaplica os filtros e renderiza os pins corretos sobre a nova imagem
    aplicarFiltrosCombinados();
}

/**
 * UNIFICAÇÃO LÓGICA DE FILTRAGEM
 */
function aplicarFiltrosCombinados() {
    let filtrados = lugares;

    // 1. Filtragem por Ala
    if (alaAtual !== "todos") {
        filtrados = filtrados.filter(l => l.categoria === alaAtual);
    }

    // 2. Filtragem por Tipo de Acessibilidade
    if (filtroAtual) {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    // 3. Filtragem por Barra de Pesquisa Texto
    const searchInput = document.getElementById('search-input');
    const termo = searchInput ? searchInput.value.toLowerCase() : "";
    if (termo) {
        filtrados = filtrados.filter(l => l.nome.toLowerCase().includes(termo));
    }

    mostrarLugares(filtrados);
}

/**
 * FUNÇÃO DE FILTRAGEM DOS BOTÕES DE ALA
 * Troca a planta de fundo e gerencia a classe CSS active de forma limpa.
 */
function filtrarAla(ala, elemento) {
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
    });
    
    alaAtual = ala;
    elemento.classList.add("active"); 

    // Altera o mapa de fundo e roda os filtros para os novos pins
    atualizarPlantaDeFundo();
}

/**
 * RENDERIZA OS MARCADORES NO MAPA
 */
function mostrarLugares(lista) {
    limparMarcadores();

    lista.forEach(lugar => {
        // Se você precisar que um pin mude de posição dependendo do mapa da ala, 
        // você pode mapear coordenadas específicas aqui no futuro.
        const marcador = L.marker([lugar.y, lugar.x], {
            icon: getIcon(lugar.categoria) 
        }).addTo(mapa);

        marcador.bindPopup(`
            <div style="text-align:center;">
                <strong style="font-size:14px; color:#5a2a83;">${lugar.nome}</strong><br>
                <span style="color:#666; font-size:12px;">Acessibilidade: ${lugar.tipo.toUpperCase()}</span>
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
 * FILTRAR POR ACESSIBILIDADE
 */
function filtrar(tipo, elemento) {
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
    aplicarFiltrosCombinados();
}

function atualizarListaLateral(lista) {
    const container = document.getElementById("lista-lugares");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p style='padding:15px; color:#888;'>Nenhum local encontrado.</p>";
        return;
    }

    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar"; 
        item.innerHTML = `
            <p><strong>${lugar.nome}</strong></p>
            <span>Acessibilidade ${lugar.tipo}</span>
        `;
        
        item.onclick = () => {
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
 * MOSTRAR TODOS (Reseta para o mapa Geral / Ver Tudo)
 */
function mostrarTodos() {
    filtroAtual = null;
    alaAtual = "todos";

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
    });
    document.querySelectorAll("#seletor-alas .btn-type")[0].classList.add("active");

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Carrega o mapa geral de volta
    atualizarPlantaDeFundo();
}

window.onload = initMap;