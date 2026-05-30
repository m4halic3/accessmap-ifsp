/**
 * CONFIGURAÇÕES TÉCNICAS DA PLANTA
 */
const plantaDimensoes = {
    largura: 1500,
    altura: 1056,
    url: 'assets/images/planta-campus.jpg' 
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
let filtroAtual = null;
let alaAtual = "todos"; // Nova variável de controle para o filtro de ala

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

    const limites = [[0, 0], [plantaDimensoes.altura, plantaDimensoes.largura]];
    L.imageOverlay(plantaDimensoes.url, limites).addTo(mapa);
    mapa.fitBounds(limites);

    mapa.on('click', function(e) {
        console.log(`y: ${e.latlng.lat.toFixed(0)}, x: ${e.latlng.lng.toFixed(0)}`);
    });

    aplicarFiltrosCombinados();
}

/**
 * UNIFICAÇÃO LÓGICA DE FILTRAGEM (Cruza busca por texto + acessibilidade + ala selecionada)
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
 * NOVO: FUNÇÃO DE FILTRAGEM DOS BOTÕES DE ALA
 */
function filtrarAla(ala, elemento) {
    // Gerencia o visual ativo dos botões de ala
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
    
    alaAtual = ala;
    elemento.classList.add("active");
    
    // Cor de destaque opcional para feedback visual no clique
    elemento.style.backgroundColor = ala === 'todos' ? '#666' : (ala === 'edificacoes' ? '#red' : '#5a2a83');
    elemento.style.color = "#fff";

    aplicarFiltrosCombinados();
}

/**
 * RENDERIZA OS MARCADORES NO MAPA
 */
function mostrarLugares(lista) {
    limparMarcadores();

    lista.forEach(lugar => {
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
 * MUDADO: FILTRAR AGORA CHAMA A FUNÇÃO UNIFICADA
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
 * MUDADO: PESQUISAR AGORA CHAMA A FUNÇÃO UNIFICADA
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
 * MOSTRAR TODOS (Limpa tudo e volta ao estado geral nativo)
 */
function mostrarTodos() {
    filtroAtual = null;
    alaAtual = "todos";

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    
    // Reseta visualmente as abas de ala
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
        btn.style.backgroundColor = "";
        btn.style.color = "#000";
    });
    document.querySelectorAll("#seletor-alas .btn-type")[0].classList.add("active");

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    aplicarFiltrosCombinados();

    const limites = [[0, 0], [plantaDimensoes.altura, plantaDimensoes.largura]];
    mapa.fitBounds(limites);
}

window.onload = initMap;