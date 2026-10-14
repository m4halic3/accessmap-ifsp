/* =========================================================
   ÍCONES DOS LOCAIS DO MAPA
   -----------------------------------------------------------
   Regra visual (mesma no mapa, na lista lateral e nos popups):
     • a COR diz ONDE fica o local (bloco / área do campus) — ou,
       para pontos de acessibilidade e alertas, de que tipo ele é;
     • o ÍCONE diz O QUE é o local (laboratório, banheiro, biblioteca...).
   Os ícones são do Font Awesome 6 (já carregado nas páginas).
   Para mudar um ícone ou uma cor, altere só este arquivo.
   ========================================================= */

// Áreas do campus: cor + ícone padrão de quem pertence a ela
const AREAS_CAMPUS = {
    informatica:    { rotulo: "Bloco A — Informática",   cor: "#8e1b1b", icone: "fa-computer" },
    mecanica:       { rotulo: "Bloco B — Mecânica",      cor: "#0d3b78", icone: "fa-gears" },
    edificacoes:    { rotulo: "Bloco C — Edificações",   cor: "#1b6b3a", icone: "fa-helmet-safety" },
    administrativo: { rotulo: "Bloco D",                 cor: "#5a1f86", icone: "fa-building-columns" },
    estacionamento: { rotulo: "Estacionamento",          cor: "#455a64", icone: "fa-square-parking" },
    quadra:         { rotulo: "Quadra e lazer",          cor: "#d35400", icone: "fa-basketball" },
    refeitorio:     { rotulo: "Refeitório e cantina",    cor: "#6d4c41", icone: "fa-utensils" },
    biblioteca:     { rotulo: "Biblioteca",              cor: "#5d4037", icone: "fa-book" },
    canteiro:       { rotulo: "Canteiro / horta",        cor: "#558b2f", icone: "fa-seedling" },
    externa:        { rotulo: "Área externa",            cor: "#607d8b", icone: "fa-location-dot" }
};

// Tipos que mudam a cor do pino, independente do bloco.
// Física usa o azul do Símbolo Internacional de Acessibilidade; o alerta
// é amarelo com ícone preto, como uma placa de aviso.
const TIPOS_DESTAQUE = {
    fisica:   { rotulo: "Acessibilidade física",   cor: "#0057b8" },
    auditiva: { rotulo: "Acessibilidade auditiva", cor: "#a0105c" },
    alerta:   { rotulo: "Alerta: barreira de acessibilidade", cor: "#f9c80e", corIcone: "#1a1a1a", icone: "fa-triangle-exclamation" }
};

// Ícone padrão por categoria (quando o nome não diz nada mais específico)
const ICONE_POR_CATEGORIA = {
    informatica: "fa-computer",
    mecanica: "fa-gears",
    edificacoes: "fa-helmet-safety",
    administrativo: "fa-building-columns",
    secretaria: "fa-briefcase",
    servidores: "fa-id-badge",
    salas_aula: "fa-chalkboard",
    estacionamento: "fa-square-parking",
    vaga_pcd: "fa-wheelchair",
    quadra: "fa-basketball",
    refeitorio: "fa-utensils",
    biblioteca: "fa-book",
    canteiro: "fa-seedling",
    entrada: "fa-door-open",
    elevador: "fa-elevator",
    escada: "fa-stairs",
    rampa: "fa-wheelchair-move",
    banheiro_acessivel: "fa-restroom",
    geral: "fa-location-dot"
};

// Regras pelo nome do local, em ordem de prioridade (texto sem acentos).
// `oQue` aparece no popup e na lista (ex.: "Laboratório de informática").
const REGRAS_NOME = [
    { teste: /banheiro.*(acessivel|pcd)|acessivel.*banheiro/, icone: "fa-restroom", oQue: "Banheiro acessível" },
    { teste: /banheiro/,                       icone: "fa-restroom",          oQue: "Banheiro" },
    { teste: /elevador/,                       icone: "fa-elevator",          oQue: "Elevador" },
    { teste: /escada/,                         icone: "fa-stairs",            oQue: "Escada" },
    { teste: /rampa/,                          icone: "fa-wheelchair-move",   oQue: "Rampa" },
    { teste: /vaga|pcd/,                       icone: "fa-wheelchair",        oQue: "Vaga PCD" },
    { teste: /napne/,                          icone: "fa-universal-access",  oQue: "Núcleo de acessibilidade (NAPNE)" },
    { teste: /auditorio/,                      icone: "fa-microphone-lines",  oQue: "Auditório" },
    { teste: /biblioteca/,                     icone: "fa-book",              oQue: "Biblioteca" },
    { teste: /cantina|refeitorio/,             icone: "fa-utensils",          oQue: "Alimentação" },
    { teste: /cozinha/,                        icone: "fa-mug-hot",           oQue: "Cozinha" },
    { teste: /estacionamento/,                 icone: "fa-square-parking",    oQue: "Estacionamento" },
    { teste: /quadra/,                         icone: "fa-basketball",        oQue: "Quadra" },
    { teste: /lazer|saguao/,                   icone: "fa-couch",             oQue: "Convivência" },
    { teste: /entrada/,                        icone: "fa-door-open",         oQue: "Entrada" },
    { teste: /professores/,                    icone: "fa-chalkboard-user",   oQue: "Sala dos professores" },
    { teste: /reunioes/,                       icone: "fa-people-group",      oQue: "Sala de reuniões" },
    { teste: /coordenadoria de ti|\bcti\b/,    icone: "fa-server",            oQue: "Tecnologia da informação" },
    { teste: /coordena|diretoria|direcao|gestao de pessoas/, icone: "fa-briefcase", oQue: "Coordenação / direção" },
    { teste: /estudantil|sociopedagogico/,     icone: "fa-users",             oQue: "Atendimento ao estudante" },
    { teste: /extensao|pesquisa|pibid|nias|numpsa|fisbrink/, icone: "fa-lightbulb", oQue: "Pesquisa e extensão" },
    { teste: /almoxarifado|deposito/,          icone: "fa-boxes-stacked",     oQue: "Almoxarifado / depósito" },
    { teste: /manutencao/,                     icone: "fa-screwdriver-wrench", oQue: "Manutenção" },
    { teste: /limpeza/,                        icone: "fa-broom",             oQue: "Limpeza" },
    { teste: /vigilancia/,                     icone: "fa-shield-halved",     oQue: "Vigilância" },
    { teste: /garagem/,                        icone: "fa-car",               oQue: "Garagem" },
    { teste: /hardware/,                       icone: "fa-microchip",         oQue: "Laboratório de hardware" },
    { teste: /informatica/,                    icone: "fa-computer",          oQue: "Laboratório de informática" },
    { teste: /quimica|fisic/,                  icone: "fa-flask",             oQue: "Laboratório de ciências" },
    { teste: /matematica/,                     icone: "fa-square-root-variable", oQue: "Laboratório de matemática" },
    { teste: /maker/,                          icone: "fa-cube",              oQue: "Laboratório maker" },
    { teste: /estudio|gravacao/,               icone: "fa-video",             oQue: "Estúdio de gravação" },
    { teste: /concreto|solos|canteiro de obras/, icone: "fa-trowel-bricks",   oQue: "Laboratório de construção" },
    { teste: /desenho|pranchetaria/,           icone: "fa-pen-ruler",         oQue: "Desenho técnico" },
    { teste: /topografia/,                     icone: "fa-compass-drafting",  oQue: "Topografia" },
    { teste: /cnc|maquinas|industrial|metalografia|materiais|ensaios|pneumatica|automacao/, icone: "fa-gears", oQue: "Laboratório de mecânica" },
    { teste: /\blab\b|laboratorio/,            icone: null,                   oQue: "Laboratório" },
    { teste: /sala de aula|multirecursos|polimeros|- sala [a-z]?\d/, icone: "fa-chalkboard", oQue: "Sala de aula" }
];

// O que cada área "é" quando o nome não é específico
const O_QUE_POR_CATEGORIA = {
    informatica: "Informática",
    mecanica: "Mecânica",
    edificacoes: "Edificações",
    secretaria: "Secretaria e coordenações",
    servidores: "Setor de servidores",
    salas_aula: "Sala de aula",
    canteiro: "Canteiro / horta"
};

// Blocos principais (o próprio prédio)
const AREA_DOS_BLOCOS = {
    "Bloco A": "informatica",
    "Bloco B": "mecanica",
    "Bloco C": "edificacoes",
    "Bloco D": "administrativo"
};

function semAcento(txt) {
    return String(txt).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Área do campus onde o local fica (chave de AREAS_CAMPUS). */
function areaDoLugar(lugar) {
    if (AREA_DOS_BLOCOS[lugar.nome]) return AREA_DOS_BLOCOS[lugar.nome];
    if (lugar.bloco_pai && AREAS_CAMPUS[lugar.bloco_pai]) return lugar.bloco_pai;
    if (AREAS_CAMPUS[lugar.categoria]) return lugar.categoria;
    if (lugar.categoria === "vaga_pcd") return "estacionamento";
    return "externa";
}

/**
 * Estilo visual de um local: { icone, cor, area, oQue, descricao }.
 * `descricao` é um texto curto para leitores de tela (ex.: "Banheiro — Bloco A — Informática").
 */
function estiloDoLugar(lugar) {
    const areaChave = areaDoLugar(lugar);
    const area = AREAS_CAMPUS[areaChave];
    const nome = semAcento(lugar.nome);

    let icone = null;
    let oQue = null;

    if (AREA_DOS_BLOCOS[lugar.nome]) {
        icone = area.icone;
        oQue = "Prédio";
    } else {
        const regra = REGRAS_NOME.find(r => r.teste.test(nome));
        if (regra) {
            icone = regra.icone;
            oQue = regra.oQue;
        }
    }

    icone = icone || ICONE_POR_CATEGORIA[lugar.categoria] || area.icone;
    oQue = oQue || O_QUE_POR_CATEGORIA[lugar.categoria] || "Ponto de interesse";

    let cor = area.cor;
    let corIcone = "#ffffff";
    const destaque = TIPOS_DESTAQUE[lugar.tipo];
    if (destaque) {
        cor = destaque.cor;
        if (destaque.corIcone) corIcone = destaque.corIcone;
        if (destaque.icone) icone = destaque.icone;
        if (lugar.tipo === "alerta") oQue = "Alerta de acessibilidade";
    }

    return {
        icone,
        cor,
        corIcone,
        area: area.rotulo,
        oQue,
        descricao: `${oQue} — ${area.rotulo}`
    };
}

/** HTML do "selo" redondo com o ícone (usado na lista lateral e no popup). */
function seloDoLugar(lugar, classeExtra = "") {
    const estilo = estiloDoLugar(lugar);
    return `<span class="selo-lugar ${classeExtra}" style="--cor-lugar:${estilo.cor};--cor-icone:${estilo.corIcone}" aria-hidden="true">` +
        `<i class="fas ${estilo.icone}"></i></span>`;
}

/** Ícone do Leaflet em formato de pino, na cor da área, com o ícone do local. */
function criarIconeLugar(lugar) {
    const estilo = estiloDoLugar(lugar);
    const classeTipo = lugar.tipo === "alerta" ? " pino-lugar--alerta" : "";
    return L.divIcon({
        className: "marcador-lugar",
        html: `<span class="pino-lugar${classeTipo}" style="--cor-lugar:${estilo.cor};--cor-icone:${estilo.corIcone}">` +
              `<i class="fas ${estilo.icone}" aria-hidden="true"></i></span>`,
        iconSize: [34, 44],
        iconAnchor: [17, 42],
        popupAnchor: [0, -38]
    });
}

/** Preenche a legenda (<div id="legenda-conteudo">) com cores e ícones. */
function montarLegenda() {
    const alvo = document.getElementById("legenda-conteudo");
    if (!alvo) return;

    const cores = [
        ...["informatica", "mecanica", "edificacoes", "administrativo"].map(k => AREAS_CAMPUS[k]),
        ...["estacionamento", "quadra", "refeitorio", "canteiro", "externa"].map(k => AREAS_CAMPUS[k]),
        TIPOS_DESTAQUE.fisica,
        TIPOS_DESTAQUE.auditiva,
        TIPOS_DESTAQUE.alerta
    ];

    const icones = [
        ["fa-computer", "Informática"], ["fa-gears", "Mecânica"], ["fa-helmet-safety", "Edificações"],
        ["fa-chalkboard", "Sala de aula"], ["fa-flask", "Lab. de ciências"], ["fa-book", "Biblioteca"],
        ["fa-utensils", "Refeitório / cantina"], ["fa-briefcase", "Secretaria / coordenação"],
        ["fa-chalkboard-user", "Sala dos professores"], ["fa-microphone-lines", "Auditório"],
        ["fa-square-parking", "Estacionamento"], ["fa-basketball", "Quadra"],
        ["fa-restroom", "Banheiro"], ["fa-elevator", "Elevador"], ["fa-stairs", "Escada"],
        ["fa-wheelchair-move", "Rampa"], ["fa-wheelchair", "Vaga PCD"],
        ["fa-universal-access", "NAPNE"], ["fa-boxes-stacked", "Depósito"],
        ["fa-triangle-exclamation", "Alerta"]
    ];

    alvo.innerHTML = `
        <p class="legenda-explicacao">
            <span class="pino-legenda" aria-hidden="true"><i class="fas fa-wheelchair"></i></span>
            <span><strong>Pinos</strong> marcam pontos de acessibilidade e alertas. Os demais locais aparecem pelo <strong>nome</strong>; aproxime o zoom para ver as salas.</span>
        </p>
        <p class="legenda-subtitulo">Cor: onde fica</p>
        <ul class="legenda-lista">
            ${cores.map(c => `<li><span class="legenda-cor" style="--cor-lugar:${c.cor}" aria-hidden="true"></span>${c.rotulo}</li>`).join("")}
        </ul>
        <p class="legenda-subtitulo">Ícone: o que é</p>
        <ul class="legenda-lista legenda-lista--icones">
            ${icones.map(([ic, txt]) => `<li><i class="fas ${ic}" aria-hidden="true"></i>${txt}</li>`).join("")}
        </ul>`;
}

document.addEventListener("DOMContentLoaded", montarLegenda);
