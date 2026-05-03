// 🖼️ Configurações da Planta (Ajustadas para a proporção da imagem real)
const plantaDimensoes = {
    largura: 1500,
    altura: 1056, // Ajustado para a proporção real do arquivo enviado
    url: 'assets/images/planta-campus.jpg' 
};

// 📍 Lugares mapeados com base na geometria da Planta Baixa [cite: 20]
const lugares = [
    {
        nome: "Bloco de Salas (Acesso Norte)",
        tipo: "fisica",
        y: 720, // Posicionado sobre as salas hachuradas
        x: 750
    },
    {
        nome: "Entrada Principal (Piso Tátil)",
        tipo: "visual",
        y: 350, // Próximo à guarita/entrada principal
        x: 620
    },
    {
        nome: "Estacionamento Ônibus e Vans",
        tipo: "fisica",
        y: 200, // Sobre a área identificada no PDF [cite: 13]
        x: 880
    },
    {
        nome: "Bloco Administrativo (Sinalização)",
        tipo: "auditiva",
        y: 680,
        x: 1050
    },
    {
        nome: "Área da Caixa D'água",
        tipo: "visual",
        y: 450, // Próximo ao círculo da caixa d'água [cite: 16]
        x: 1250
    }
];

let mapa;
let marcadores = [];
let filtroAtual = null;

function getIcon(tipo) {
    let cor = "blue";
    if (tipo === "fisica") cor = "green";
    if (tipo === "visual") cor = "blue";
    if (tipo === "auditiva") cor = "red";

    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
}

function initMap() {
    mapa = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 3
    });

    const limites = [[0, 0], [plantaDimensoes.altura, plantaDimensoes.largura]];
    L.imageOverlay(plantaDimensoes.url, limites).addTo(mapa);
    mapa.fitBounds(limites);

    // LOG DE AUXÍLIO: Use isso para refinar os pontos clicando na tela
    mapa.on('click', function(e) {
        console.log(`y: ${e.latlng.lat.toFixed(0)}, x: ${e.latlng.lng.toFixed(0)}`);
    });

    mostrarLugares(lugares);
}

function mostrarLugares(lista) {
    limparMarcadores();
    lista.forEach(lugar => {
        const marcador = L.marker([lugar.y, lugar.x], {
            icon: getIcon(lugar.tipo)
        }).addTo(mapa);

        marcador.bindPopup(`
            <div style="text-align:center;">
                <b style="font-size:14px;">${lugar.nome}</b><br>
                <span style="color:#666;">Acessibilidade: ${lugar.tipo.toUpperCase()}</span>
            </div>
        `);
        marcadores.push(marcador);
    });
    atualizarLista(lista);
}

function limparMarcadores() {
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];
}

function filtrar(tipo, elemento) {
    if (filtroAtual === tipo) {
        mostrarTodos();
        filtroAtual = null;
        document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
        return;
    }
    filtroAtual = tipo;
    const filtrados = lugares.filter(l => l.tipo === tipo);
    mostrarLugares(filtrados);
    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    elemento.classList.add("ativo");
}

function mostrarTodos() {
    mostrarLugares(lugares);
    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
}

function atualizarLista(lista) {
    const container = document.getElementById("lista-lugares");
    container.innerHTML = "";
    if (lista.length === 0) {
        container.innerHTML = "<p style='padding:10px;'>Nenhum local nesta categoria.</p>";
        return;
    }
    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = `<p><strong>${lugar.nome}</strong></p><small>${lugar.tipo}</small>`;
        item.addEventListener("click", () => {
            mapa.setView([lugar.y, lugar.x], 1);
        });
        container.appendChild(item);
    });
}

window.onload = initMap;