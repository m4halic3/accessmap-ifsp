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
        largura: 1200, 
        altura: 800,
        url: 'assets/images/planta-edificacoes.jpg' 
    },
    mecanica: {
        largura: 1200, 
        altura: 800,
        url: 'assets/images/planta-mecanica.jpg' 
    }
};

/**
 * DATABASE DE LUGARES ORIGINAL (Pontos naturais limpos do filtro de acessibilidade)
 */
const lugares = [
    { nome: "Ala de Informática (Laboratórios)", tipo: "geral", categoria: "informatica", y: 705, x: 1040 },
    { nome: "Secretaria / Atendimento", tipo: "auditiva", categoria: "secretaria", y: 637, x: 1100 },
    { nome: "Bloco de Salas (Edificações)", tipo: "geral", categoria: "edificacoes", y: 720, x: 640 },
    { nome: "Bloco de Salas (Mecânica)", tipo: "geral", categoria: "mecanica", y: 720, x: 780 },
    { nome: "Bloco de Salas de Aula (Geral)", tipo: "geral", categoria: "geral", y: 700, x: 950 },
    { nome: "Biblioteca", tipo: "geral", categoria: "biblioteca", y: 500, x: 1000 },
    { nome: "Entrada (Ala da biblioteca)", tipo: "geral", categoria: "entrada", y: 540, x: 1000 },
    { nome: "Entrada Principal", tipo: "geral", categoria: "entrada", y: 350, x: 620 },
    { nome: "Estacionamento de Ônibus", tipo: "geral", categoria: "estacionamento", y: 320, x: 890 },
    { nome: "Estacionamento interno", tipo: "geral", categoria: "estacionamento", y: 520, x: 750 }
];

let mapa;
let marcadores = [];
let camadaImagem = null; 
let filtroAtual = null;
let alaAtual = "todos"; 
let primeiraInicializacao = true; // Variável de controle para iniciar o mapa limpo

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

    primeiraInicializacao = true; // Garante que o estado inicial é "limpo"
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

    // 1. TRAVA DE INICIALIZAÇÃO: Se a página acabou de abrir e não há busca, começa limpo
    if (alaAtual === "todos" && primeiraInicializacao && !termo) {
        mostrarLugares([]);
        return; 
    }

    // 2. Filtragem por Ala (se for diferente de "todos", filtra pela ala selecionada)
    if (alaAtual !== "todos") {
        filtrados = filtrados.filter(l => l.categoria === alaAtual);
    }

    // 3. Filtragem por Tipo de Acessibilidade
    if (filtroAtual) {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    // 4. Filtragem por Barra de Pesquisa Texto
    if (termo) {
        filtrados = filtrados.filter(l => l.nome.toLowerCase().includes(termo));
    }

    mostrarLugares(filtrados);
}

/**
 * FUNÇÃO DE FILTRAGEM DOS BOTÕES DE ALA
 */
function filtrarAla(ala, elemento) {
    primeiraInicializacao = false; // O usuário interagiu, então desativa a trava inicial

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
            icon: getIcon(lugar.categoria) 
        }).addTo(mapa);

        const textoAcessibilidade = lugar.tipo === "geral" ? "Verificar local" : lugar.tipo.toUpperCase();

        marcador.bindPopup(`
            <div style="text-align:center;">
                <strong style="font-size:14px; color:#5a2a83;">${lugar.nome}</strong><br>
                <span style="color:#666; font-size:12px;">Filtro: ${textoAcessibilidade}</span>
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
    primeiraInicializacao = false; // Desativa a trava se o usuário filtrar por acessibilidade

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
    primeiraInicializacao = false; // Desativa a trava caso o usuário use a busca por texto
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
        container.innerHTML = "<p style='padding:15px; color:#888;'>Selecione uma ala, clique em 'Mostrar Tudo' ou faça uma busca para ver os locais.</p>";
        return;
    }

    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar"; 
        
        const labelAcessibilidade = lugar.tipo === "geral" ? "Ponto de Interesse" : `Acessibilidade ${lugar.tipo}`;

        item.innerHTML = `
            <p><strong>${lugar.nome}</strong></p>
            <span>${labelAcessibilidade}</span>
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
 * MOSTRAR TODOS (Força a exibição de TODOS os pontos na tela)
 */
function mostrarTodos() {
    filtroAtual = null;
    alaAtual = "todos";
    primeiraInicializacao = false; // CRUCIAL: Desativa a trava para forçar a exibição total!

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
    });
    
    const botoesAla = document.querySelectorAll("#seletor-alas .btn-type");
    if (botoesAla.length > 0) {
        botoesAla[0].classList.add("active"); // Deixa o botão "Todos" ou equivalente marcado
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    atualizarPlantaDeFundo();
}

window.onload = initMap;