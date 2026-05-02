// 📍 Coordenada REAL do IFSP (a que você pegou)
const centroIFSP = [-23.5936109, -48.0185491];

// 📍 Lugares distribuídos pelo campus
const lugares = [
    {
        nome: "Biblioteca",
        tipo: "fisica",
        lat: centroIFSP[0] + 0.0005,
        lng: centroIFSP[1] + 0.0005
    },
    {
        nome: "Auditório",
        tipo: "auditiva",
        lat: centroIFSP[0] - 0.0005,
        lng: centroIFSP[1] - 0.0005
    },
    {
        nome: "Laboratório de Informática",
        tipo: "visual",
        lat: centroIFSP[0] + 0.0002,
        lng: centroIFSP[1] - 0.0004
    },
    {
        nome: "Bloco A",
        tipo: "fisica",
        lat: centroIFSP[0] - 0.0005,
        lng: centroIFSP[1] + 0.0003
    }
];

let mapa;
let marcadores = [];
let filtroAtual = null;


// 🎨 Ícones dos marcadores
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


// 🎯 Ícone exclusivo do IFSP (não confundir com acessibilidade)
function getIconIF() {
    return L.icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
        shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });
}


// 🚀 Inicializa o mapa
function initMap() {
    mapa = L.map('map').setView(centroIFSP, 18);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(mapa);

    // 📍 Marcador fixo do IFSP
    L.marker(centroIFSP, {
        icon: getIconIF()
    })
    .addTo(mapa)
    .openPopup();

    mostrarLugares(lugares);
}


// 📍 Mostrar lugares
function mostrarLugares(lista) {
    limparMarcadores();

    lista.forEach(lugar => {
        const marcador = L.marker([lugar.lat, lugar.lng], {
            icon: getIcon(lugar.tipo)
        }).addTo(mapa);

        marcador.bindPopup(`
            <b>${lugar.nome}</b><br>
            Acessibilidade: ${lugar.tipo}
        `);

        marcador.on("click", () => {
            mapa.setView([lugar.lat, lugar.lng], 19);
        });

        marcadores.push(marcador);
    });

    atualizarLista(lista);
}


// 🧹 Limpar marcadores
function limparMarcadores() {
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];
}


// 🎯 Filtro com toggle (clicar de novo volta tudo)
function filtrar(tipo, elemento) {

    if (filtroAtual === tipo) {
        mostrarTodos();
        filtroAtual = null;

        document.querySelectorAll(".filtro").forEach(el => {
            el.classList.remove("ativo");
        });

        return;
    }

    filtroAtual = tipo;

    const filtrados = lugares.filter(l => l.tipo === tipo);
    mostrarLugares(filtrados);

    document.querySelectorAll(".filtro").forEach(el => {
        el.classList.remove("ativo");
    });

    elemento.classList.add("ativo");
}


// 🔄 Mostrar todos
function mostrarTodos() {
    mostrarLugares(lugares);

    document.querySelectorAll(".filtro").forEach(el => {
        el.classList.remove("ativo");
    });
}


// 📋 Lista lateral
function atualizarLista(lista) {
    const container = document.getElementById("lista-lugares");
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum local encontrado.</p>";
        return;
    }

    lista.forEach(lugar => {
        const item = document.createElement("div");
        item.classList.add("item");

        item.innerHTML = `
            <p><strong>${lugar.nome}</strong></p>
            <span style="font-size:12px; color:#666;">
                ${lugar.tipo}
            </span>
        `;

        item.addEventListener("click", () => {
            mapa.setView([lugar.lat, lugar.lng], 19);
        });

        container.appendChild(item);
    });
}


// 🚀 Inicializa
window.onload = initMap;