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

const lugares = [
    { nome: "Bloco A", tipo: "geral", categoria: "geral", andar: "terreo", y: 500, x: 1045, subponto: false },
    { nome: "Bloco B", tipo: "geral", categoria: "mecanica", andar: "terreo", y: 670, x: 755, subponto: false },
    { nome: "Bloco C", tipo: "geral", categoria: "edificacoes", andar: "terreo", y: 670, x: 585, subponto: false },
    { nome: "Bloco D", tipo: "geral", categoria: "administrativo", andar: "terreo", y: 630, x: 400, subponto: false },
    { nome: "Estacionamento interno A", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 380, x: 680, subponto: false },
    { nome: "Estacionamento interno B", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 980, x: 700, subponto: false },
    { nome: "Estacionamento externo", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 100, x: 900, subponto: false },
    { nome: "Quadra", tipo: "geral", categoria: "quadra", andar: "terreo", y: 650, x: 150, subponto: false },
    { nome: "Refeitório", tipo: "geral", categoria: "refeitorio", andar: "terreo", y: 800, x: 300, subponto: false },
    { nome: "Canteiro", tipo: "geral", categoria: "canteiro", andar: "terreo", y: 900, x: 1200, subponto: false },

    // --- ESTRUTURAS EXTERNAS / ÁREAS COMUNS ---
{ nome: "Alerta: Falta de rampa Externa de acesso ao Estacionamento Interno B", tipo: "alerta", categoria: "fisica", andar: "terreo", y: 790, x: 670, subponto: false },
{ nome: "Rampa Externa de acesso a quadra", tipo: "fisica", categoria: "rampa", andar: "terreo", y: 650, x: 300, subponto: false },
{ nome: "Rampa Externa de acesso aos blocos", tipo: "fisica", categoria: "rampa", andar: "terreo", y: 660, x: 500, subponto: false },
{ nome: "Escada Externa de acesso ao Estacionamento Interno B", tipo: "fisica", categoria: "escada", andar: "terreo", y: 800, x: 670, subponto: false },
{ nome: "Alerta: Porta Pequena (Acesso Externo)", tipo: "alerta", categoria: "fisica", andar: "terreo", y: 700, x: 330, subponto: false },

    // --- BLOCO A - ALA INFORMÁTICA ---
    { nome: "Bloco A - Auditório A202", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1110, subponto: true },
    { nome: "Bloco A - Sala dos Professores A209", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1245, subponto: true },
    { nome: "Bloco A - Lab A (A206)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1180, subponto: true },
    { nome: "Bloco A - Lab B (A208)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1220, subponto: true },
    { nome: "Bloco A - Lab de Pesquisa (A210)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1245, subponto: true },
    { nome: "Bloco A - Lab C (A207)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1220, subponto: true },
    { nome: "Bloco A - Lab D (A205)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1190, subponto: true },
    { nome: "Bloco A - Lab E (A204)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1160, subponto: true },
    { nome: "Bloco A - Lab de Hardware (A203)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1110, subponto: true },

    // --- BLOCO A - ALA SECRETARIA ---
    { nome: "Bloco A - Banheiro Feminino (Secretaria)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1075, subponto: true },
    { nome: "Bloco A - Coordenação de Licenciaturas (A115)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1090, subponto: true },
    { nome: "Bloco A - CEX / CPI - Extensão, Pesquisa e Inovação (A114/A115)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1110, subponto: true },
    { nome: "Bloco A - CSP - Coordenadoria de Gestão de Pessoas (A117)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1125, subponto: true },
    { nome: "Bloco A - CTI - Coordenadoria de TI (A119)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1150, subponto: true },
    { nome: "Bloco A - DAA - Diretoria Adjunta de Administração (A120)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1140, subponto: true },
    { nome: "Bloco A - DAE - Diretoria Adjunta Educacional (A121)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1160, subponto: true },
    { nome: "Bloco A - CDI - Coordenadoria de Apoio à Direção (A122)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1180, subponto: true },
    { nome: "Bloco A - Direção Geral (A123)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1205, subponto: true },
    { nome: "Bloco A - Sala de Reuniões (A124)", tipo: "geral", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 555, x: 1200, subponto: true },
    { nome: "Bloco A - NAPNE (C501)", tipo: "auditiva", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1090, subponto: true },
    { nome: "Bloco A - NAPNE Atendimento", tipo: "auditiva", categoria: "secretaria", andar: "terreo", bloco_pai: "informatica", y: 530, x: 1070, subponto: true },

    // --- BLOCO A - ALA SALAS DE AULA / LABORATÓRIOS ---
    { nome: "Bloco A - Lab de Química (A302)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 700, x: 990, subponto: true },
    { nome: "Bloco A - Sala Polímeros (A304)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 700, x: 960, subponto: true },
    { nome: "Bloco A - Sala A306", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 700, x: 930, subponto: true },
    { nome: "Bloco A - Sala A308", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 700, x: 900, subponto: true },
    { nome: "Bloco A - PIBID (A310)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 700, x: 870, subponto: true },
    { nome: "Bloco A - Sala A303", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 630, x: 990, subponto: true },
    { nome: "Bloco A - Sala dos Professores (A305)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 630, x: 960, subponto: true },
    { nome: "Bloco A - Lab Maker (A307)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 630, x: 930, subponto: true },
    { nome: "Bloco A - Lab de Ensino de Matemática (A309)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 630, x: 900, subponto: true },
    { nome: "Bloco A - Fisbrink (A311)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "informatica", y: 630, x: 870, subponto: true },

    // --- BLOCO A - ÁREA GERAL / CONVIVÊNCIA ---
    { nome: "Bloco A - Banheiro Masculino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 710, x: 1020, subponto: true },
    { nome: "Bloco A - Banheiro Feminino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 710, x: 1070, subponto: true },
    { nome: "Bloco A - Cantina", tipo: "geral", categoria: "refeitorio", andar: "terreo", bloco_pai: "informatica", y: 685, x: 1045, subponto: true },
    { nome: "Bloco A - Espaço de Lazer", tipo: "geral", categoria: "quadra", andar: "terreo", bloco_pai: "informatica", y: 800, x: 1045, subponto: true },
    { nome: "Bloco A - Saguão Principal", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 330, x: 1045, subponto: true },
    { nome: "Bloco A - Biblioteca", tipo: "geral", categoria: "biblioteca", andar: "terreo", bloco_pai: "informatica", y: 300, x: 1000, subponto: true },
    { nome: "Bloco A - Sala dos Professores (Geral)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 440, x: 1000, subponto: true },
    { nome: "Bloco A - Alerta: Área em Construção", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "informatica", y: 550, x: 1000, subponto: true },
    { nome: "Bloco A - Entrada Principal", tipo: "geral", categoria: "entrada", andar: "terreo", bloco_pai: "informatica", y: 370, x: 1000, subponto: true },

    // --- BLOCO A - BANHEIROS DO SAGUÃO ---
    { nome: "Bloco A - Banheiro Masculino (Saguão)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 400, x: 1100, subponto: true },
    { nome: "Bloco A - Banheiro Feminino (Saguão)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 350, x: 1100, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Masculino (Saguão)", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 380, x: 1085, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Feminino (Saguão)", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 365, x: 1085, subponto: true },

    // --- BLOCO A - ACESSIBILIDADE ---
    { nome: "Bloco A - Banheiro Acessível Feminino", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 680, x: 1015, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Masculino", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 680, x: 1075, subponto: true },
    { nome: "Bloco A - Rampa de Acesso Principal", tipo: "fisica", categoria: "rampa", andar: "terreo", bloco_pai: "informatica", y: 550, x: 1045, subponto: true },
    { nome: "Bloco A - Alerta: Piso Tátil Estragado", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "informatica", y: 610, x: 1045, subponto: true },

    // --- BLOCO A - ALA SERVIDORES ---
    { nome: "Bloco A - Movimento Estudantil (A102)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1070, subponto: true },
    { nome: "Bloco A - Setor Sociopedagógico (A103)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1102, subponto: true },
    { nome: "Bloco A - Cozinha dos Servidores (A106)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1125, subponto: true },
    { nome: "Bloco A - Cozinha dos Terceirizados (A107)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1138, subponto: true },
    { nome: "Bloco A - Banheiro Feminino (Servidores)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1148, subponto: true },
    { nome: "Bloco A - Banheiro Masculino (Servidores)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1170, subponto: true },
    { nome: "Bloco A - Depósito I (A111)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1190, subponto: true },
    { nome: "Bloco A - Depósito II (A1013)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 460, x: 1210, subponto: true },
    { nome: "Bloco A - Manutenção (A112)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1218, subponto: true },
    { nome: "Bloco A - Limpeza (A110)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1210, subponto: true },
    { nome: "Bloco A - Sala de Vigilância (A109)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1195, subponto: true },
    { nome: "Bloco A - Almoxarifado (A108)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1170, subponto: true },
    { nome: "Bloco A - Almoxarifado (A105)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1150, subponto: true },
    { nome: "Bloco A - Almoxarifado (A104)", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 420, x: 1090, subponto: true },
    { nome: "Bloco A - Garagem", tipo: "geral", categoria: "servidores", andar: "terreo", bloco_pai: "informatica", y: 380, x: 1200, subponto: true },

    // --- BLOCO B - TÉRREO (visível no Mapa Geral) ---
    { nome: "Bloco B - Banheiro Masculino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "mecanica", y: 680, x: 815, subponto: true },
    { nome: "Bloco B - Banheiro Feminino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "mecanica", y: 680, x: 790 , subponto: true },
    { nome: "Bloco B - Banheiro PCD", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "mecanica", y: 700, x: 820 , subponto: true },
    { nome: "Bloco B - Sala de Limpeza", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "mecanica", y: 695, x: 810, subponto: true },
    { nome: "Bloco B - Elevador (Térreo)", tipo: "fisica", categoria: "elevador", andar: "terreo", bloco_pai: "mecanica", y: 810, x: 780, subponto: true },
    { nome: "Bloco B - Escada (Térreo)", tipo: "fisica", categoria: "escada", andar: "terreo", bloco_pai: "mecanica", y: 830, x: 780, subponto: true },
    { nome: "Bloco B - Lab de Metalografia (B414)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y:870, x: 800, subponto: true },
    { nome: "Bloco B - Sala de aula (B415)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y:890, x: 800, subponto: true },
    { nome: "Bloco B - Sala de aula (B412)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y:840, x: 810, subponto: true },
    { nome: "Bloco B - Lab de Materiais (B405)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 750, x: 810, subponto: true },
    { nome: "Bloco B - Lab de Máquinas (B410)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 780, x: 810, subponto: true },
    { nome: "Bloco B - Lab de Contenção e Automação (B408)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 770, x: 720, subponto: true },
    { nome: "Bloco B - Pneumática e Hidráulica (B404)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 730, x: 720, subponto: true },
    { nome: "Bloco B - Sala dos Professores (B406)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 820, x: 720, subponto: true },
    { nome: "Bloco B - Sala de Coordenação (B407)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 740, x: 770, subponto: true },
    { nome: "Bloco B - Núcleo NIAS (B416)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 910, x: 755, subponto: true },
    { nome: "Bloco B - Estúdio de Gravação (B402)", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 680, x: 770, subponto: true },
    { nome: "Bloco B - Auditório", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 700, x: 710, subponto: true },
    { nome: "Bloco B - Laboratório de ensaios", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 720, x: 780, subponto: true },

    // --- BLOCO B - SUBSOLO (visível em "Subsolo Mec.") ---
    { nome: "Subsolo B - Laboratório de CNC (B419)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 190, x: 480, subponto: true },
    { nome: "Subsolo B - Laboratório Industrial", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 600, x: 600, subponto: true },
    { nome: "Subsolo B - Sala B417", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 280, x: 840, subponto: true },
    { nome: "Subsolo B - Sala de Aula B418", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 340, x: 880, subponto: true },
    { nome: "Subsolo B - Sala NumPSA (B421)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 740, x: 790, subponto: true },
    { nome: "Subsolo B - Sala dos Professores (B420)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 700, x: 880, subponto: true },
    { nome: "Subsolo B - Depósito", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 190, x: 840, subponto: true },
    { nome: "Elevador - Subsolo B", tipo: "fisica", categoria: "elevador", andar: "subsolo", bloco_pai: "mecanica", y: 120, x: 840, subponto: true },
    { nome: "Escada - Subsolo B", tipo: "fisica", categoria: "escada", andar: "subsolo", bloco_pai: "mecanica", y: 70, x: 800, subponto: true },

    // --- BLOCO C - TÉRREO (Atualizado com nomes reais) ---
    { nome: "Bloco C - Sala 101 - Desenho Técnico", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 725, x: 630, subponto: true },
    { nome: "Bloco C - Lab de Experimentos Físicos (C505)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 720, x: 570, subponto: true },
    { nome: "Bloco C - Pranchetaria (C509)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 790, x: 630, subponto: true },
    { nome: "Bloco C - Sala de Aula (C507)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 760, x: 630, subponto: true },
    { nome: "Bloco C - Gabinete de Topografia (C503)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 680, x: 635, subponto: true },
    { nome: "Bloco C - Lab de Informática (C502)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 820, x: 620 , subponto: true },
    { nome: "Bloco C - Coordenação do Curso de Edificações", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 740, x: 570, subponto: true },
    { nome: "Bloco C - Lab de Oficina de Física e Química (C508)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 760, x: 540, subponto: true },
    { nome: "Bloco C - Sala dos Professores (C510)", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 820, x: 540, subponto: true },
    { nome: "Bloco C - Elevador (térreo)", tipo: "fisica", categoria: "elevador", andar: "terreo", bloco_pai: "edificacoes", y: 780, x: 560, subponto: true },
    { nome: "Bloco C - Escada (térreo)", tipo: "fisica", categoria: "escada", andar: "terreo", bloco_pai: "edificacoes", y: 795, x: 560, subponto: true },
    
    // --- BLOCO C - INSTALAÇÕES ---
    { nome: "Bloco C - Sala sem identificação", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "edificacoes", y: 680, x: 565, subponto: true },
    { nome: "Bloco C - Banheiro Feminino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "edificacoes", y: 680, x: 550, subponto: true },
    { nome: "Bloco C - Banheiro Masculino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "edificacoes", y: 680, x: 530, subponto: true },
    { nome: "Bloco C - Banheiro PCD", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "edificacoes", y: 700, x: 515, subponto: true },
    { nome: "Bloco C - Sala de Limpeza", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "edificacoes", y: 695, x: 525, subponto: true },

    // --- BLOCO C - SUBSOLO (visível em "Subsolo Edif.") ---
    { nome: "Subsolo C - Lab. de Concreto", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 250, x: 400, subponto: true },
    { nome: "Subsolo C - Almoxarifado", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 230, x: 550, subponto: true },
    { nome: "Subsolo C - Depósito", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 300, x: 550, subponto: true },
    { nome: "Subsolo C - Canteiro de Obras", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 600, x: 600, subponto: true },
    { nome: "Subsolo C - Sala W", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 700, x: 400, subponto: true },
    { nome: "Subsolo C - Laboratório de Mecânica dos Solos (C512)", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 250, x: 750, subponto: true },
    { nome: "Elevador - Subsolo C", tipo: "fisica", categoria: "elevador", andar: "subsolo", bloco_pai: "edificacoes", y: 150, x: 550, subponto: true },
    { nome: "Escada - Subsolo C", tipo: "fisica", categoria: "escada", andar: "subsolo", bloco_pai: "edificacoes", y: 70, x: 600, subponto: true },

    // --- BLOCO D ---
    { nome: "Bloco D - Sala de Aula (D604)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 600, x: 370, subponto: true },
    { nome: "Bloco D - Sala de Aula (D603)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 700, x: 370, subponto: true },
    { nome: "Bloco D - Sala de Aula (D602)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 600, x: 410, subponto: true },
    { nome: "Bloco D - Sala multirecursos (D601)", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 700, x: 410, subponto: true },

    // --- ACESSIBILIDADE E ALERTAS GERAIS (Mapa Geral) ---
    { nome: "Vagas Exclusivas PCD - Estacionamento", tipo: "fisica", categoria: "vaga_pcd", andar: "terreo", y: 470, x: 700, subponto: false },
];

/* =========================================================
   LOCAIS SALVOS PELO ADMIN (versão sem banco de dados)
   -----------------------------------------------------------
   O array `lugares` acima é a lista ORIGINAL do projeto. Quando o
   admin adiciona, edita ou exclui um local, a lista inteira passa a
   ser guardada no localStorage, e é ela que o mapa usa daí em diante
   (no mesmo navegador). Na migração para back-end, troque estas
   funções por chamadas de API (GET/POST/PUT/DELETE /lugares).
   ========================================================= */
const CHAVE_LUGARES = "accessmap_lugares";
const LUGARES_ORIGINAIS = lugares.map(l => ({ ...l }));

function lugarValido(l) {
    return l && typeof l.nome === "string" && Number.isFinite(l.x) && Number.isFinite(l.y);
}

function carregarLugaresSalvos() {
    try {
        const salvos = JSON.parse(localStorage.getItem(CHAVE_LUGARES));
        if (Array.isArray(salvos) && salvos.every(lugarValido)) {
            lugares.splice(0, lugares.length, ...salvos);
        }
    } catch (_) {
        // Dados corrompidos ou armazenamento bloqueado: usa a lista original
    }
}

/** Salva a lista atual. Retorna false se o navegador não deixou salvar. */
function salvarLugares() {
    try {
        localStorage.setItem(CHAVE_LUGARES, JSON.stringify(lugares));
        return true;
    } catch (erro) {
        console.error("AccessMap: não foi possível salvar os locais.", erro);
        return false;
    }
}

function temLugaresPersonalizados() {
    try {
        return localStorage.getItem(CHAVE_LUGARES) !== null;
    } catch (_) {
        return false;
    }
}

function restaurarLugaresOriginais() {
    try {
        localStorage.removeItem(CHAVE_LUGARES);
    } catch (_) { /* nada a remover */ }
    lugares.splice(0, lugares.length, ...LUGARES_ORIGINAIS.map(l => ({ ...l })));
}

carregarLugaresSalvos();

/* =========================================================
   ESTADO DO MAPA
   ========================================================= */
let mapa;
let marcadores = [];
let camadaImagem = null;
let filtroAtual = null;
let alaAtual = "todos";
let primeiraInicializacao = true;

const LEAFLET_SHADOW = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const NOMES_ALAS = {
    todos: "Mapa Geral",
    edificacoes: "Subsolo Edificações",
    mecanica: "Subsolo Mecânica"
};

const BLOCOS_RAIZ = {
    "Bloco A": "informatica",
    "Bloco B": "mecanica",
    "Bloco C": "edificacoes",
    "Bloco D": "administrativo"
};

const ORDEM_PRINCIPAIS = ["Bloco A", "Bloco B", "Bloco C", "Bloco D",
    "Estacionamento interno A", "Estacionamento interno B", "Estacionamento externo"];

function getAndarDaAla() {
    return (alaAtual === "todos") ? "terreo" : "subsolo";
}

function getIcon(categoria, tipo, nomeLugar) {
    if (tipo === "alerta") {
        return L.icon({
            iconUrl: "assets/images/icone-alerta.png",
            shadowUrl: LEAFLET_SHADOW,
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [0, -22],
            alt: `Alerta em: ${nomeLugar}`
        });
    }

    let cor = "black"; // Cor padrão para salas internas
    let descricaoAlt = `Ponto de interesse: ${nomeLugar}`;
    const nomeLower = nomeLugar.toLowerCase();

    if (tipo === "fisica" && categoria === "banheiro_acessivel") {
        cor = "green"; // PCD
        descricaoAlt = `Banheiro acessível PCD em: ${nomeLugar}`;
    } else if (nomeLower.includes("banheiro") && categoria !== "banheiro_acessivel") {
        cor = "yellow"; // Banheiro normal
        descricaoAlt = `Banheiro em: ${nomeLugar}`;
    } else if (tipo === "auditiva") {
        cor = "red";
        descricaoAlt = `Acessibilidade auditiva em: ${nomeLugar}`;
    } else {
        // Blocos, áreas externas e salas
        if (categoria === "administrativo") cor = "violet";
        else if (["estacionamento", "entrada", "quadra", "refeitorio", "rampa", "escada"].includes(categoria)) cor = "orange";
        else if (categoria === "mecanica") cor = "red";
        else if (categoria === "edificacoes") cor = "blue";
        else if (categoria === "informatica") cor = "black";
        else if (categoria === "secretaria") cor = "violet";
        else if (categoria === "servidores") cor = "blue";
        else if (categoria === "geral") cor = "violet";
        else if (categoria === "biblioteca") cor = "grey";
    }

    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${cor}.png`,
        shadowUrl: LEAFLET_SHADOW,
        iconSize: [18, 30],
        iconAnchor: [9, 30],
        popupAnchor: [1, -26],
        alt: descricaoAlt
    });
}

// Escapa texto antes de inserir via innerHTML (nomes podem ser digitados pelo admin)
function escaparHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Remove acentos e hífens, para "auditorio" achar "Auditório" e
// "bloco a" achar "Bloco A - ..."
function normalizarTexto(txt) {
    return String(txt)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .trim();
}

function normalizarBusca(txt) {
    return normalizarTexto(txt).replace(/-/g, " ").replace(/\s+/g, " ");
}

function termoDeBuscaAtual() {
    const searchInput = document.getElementById("search-input");
    return searchInput ? normalizarBusca(searchInput.value) : "";
}

function initMap() {
    mapa = L.map("map", {
        crs: L.CRS.Simple,
        minZoom: -1,
        maxZoom: 3
    });

    primeiraInicializacao = true;
    atualizarPlantaDeFundo();

    // Busca "ao vivo": a lista lateral e os marcadores refletem o texto
    // digitado. O Enter (handleBuscaKeydown) vai direto ao primeiro resultado.
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", aplicarFiltrosCombinados);
    }

    // Sem isso o Leaflet mantém o tamanho antigo do container em cache
    // quando a janela muda de tamanho.
    window.addEventListener("resize", () => {
        if (mapa) mapa.invalidateSize();
    });
}

function atualizarPlantaDeFundo() {
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    let textAltPlanta = "Mapa do Campus Geral com distribuição dos blocos e caminhos.";
    if (alaAtual === "edificacoes") textAltPlanta = "Planta baixa detalhada do Subsolo do Bloco C (Edificações).";
    if (alaAtual === "mecanica") textAltPlanta = "Planta baixa detalhada do Subsolo do Bloco B (Mecânica).";

    // Se o admin enviou uma imagem nova com descrição, usa a descrição dele
    if (dadosPlanta.alt) textAltPlanta = dadosPlanta.alt;

    camadaImagem = L.imageOverlay(dadosPlanta.url, limites, {
        alt: textAltPlanta
    }).addTo(mapa);

    mapa.fitBounds(limites);
    atualizarTituloResultados();
    aplicarFiltrosCombinados();
}

function atualizarTituloResultados() {
    const titulo = document.getElementById("titulo-resultados");
    if (titulo) titulo.textContent = `Resultados (${NOMES_ALAS[alaAtual]})`;
}

// Deixa destacado (e anunciado) o botão da ala aberta
function marcarBotaoAla(ala) {
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        const ativo = btn.dataset.ala === ala;
        btn.classList.toggle("active", ativo);
        btn.setAttribute("aria-pressed", String(ativo));
    });
}

// Sincroniza o visual dos botões de filtro com `filtroAtual`
function marcarBotoesFiltro() {
    document.querySelectorAll(".filtro[data-filtro]").forEach(btn => {
        const ativo = btn.dataset.filtro === filtroAtual;
        btn.classList.toggle("ativo", ativo);
        btn.setAttribute("aria-pressed", String(ativo));
    });
    const verTodos = document.getElementById("btn-ver-todos");
    if (verTodos) verTodos.setAttribute("aria-pressed", String(filtroAtual === "acessibilidade"));
}

function filtrarAla(ala) {
    if (!plantas[ala]) return;
    primeiraInicializacao = false;
    alaAtual = ala;
    marcarBotaoAla(ala);
    atualizarPlantaDeFundo();
}

function aplicarFiltrosCombinados() {
    const termo = termoDeBuscaAtual();
    let filtrados;

    if (termo) {
        // Dentro de um subsolo, a busca fica restrita aos locais daquele
        // subsolo — não faz sentido achar uma sala de outra planta.
        const candidatos = (alaAtual === "todos")
            ? lugares
            : lugares.filter(l => l.bloco_pai === alaAtual && l.andar === "subsolo");

        filtrados = candidatos.filter(l => normalizarBusca(l.nome).includes(termo));
    } else if (alaAtual === "todos") {
        filtrados = filtroAtual
            ? [...lugares]
            : lugares.filter(l => l.subponto === true && l.andar === "terreo");
    } else {
        filtrados = lugares.filter(l => l.bloco_pai === alaAtual && l.andar === "subsolo");
    }

    // Filtro por tipo de acessibilidade
    if (filtroAtual) {
        if (filtroAtual === "fisica") {
            filtrados = filtrados.filter(l => l.tipo === "fisica" || l.tipo === "alerta");
        } else if (filtroAtual === "acessibilidade") {
            // "Ver Todos": física, auditiva e alertas do mapa aberto
            filtrados = filtrados.filter(l => ["fisica", "auditiva", "alerta"].includes(l.tipo));
        } else {
            filtrados = filtrados.filter(l => l.tipo === filtroAtual);
        }

        // No mapa geral, oculta itens que pertencem ao subsolo
        if (alaAtual === "todos") {
            filtrados = filtrados.filter(l => l.andar !== "subsolo");
        }
    }

    limparMarcadores();

    if (alaAtual === "todos" && !termo && !filtroAtual) {
        // Estado padrão do Mapa Geral: mapa sem marcadores e lateral só
        // com os blocos/locais principais.
        const blocosPrincipais = lugares.filter(l => l.subponto === false && l.andar === "terreo");
        atualizarListaLateral(blocosPrincipais);
    } else if (alaAtual !== "todos" && !termo && !filtroAtual) {
        // Estado padrão de um subsolo: mapa sem marcadores e lateral com
        // todos os locais daquele subsolo.
        atualizarListaLateral(filtrados, { mostrarTodos: true });
    } else {
        mostrarLugares(filtrados);
        atualizarListaLateral(filtrados, { mostrarTodos: true });
    }
}

function mostrarLugares(lista) {
    limparMarcadores();
    lista.forEach(lugar => adicionarMarcador(lugar));
}

function descricaoDoTipo(lugar) {
    if (lugar.tipo === "alerta") return "<span class='tag-alerta'>⚠️ Barreira física (necessita de melhorias)</span>";
    if (lugar.tipo === "fisica") return "Acessibilidade física";
    if (lugar.tipo === "auditiva") return "Acessibilidade auditiva";
    if (lugar.subponto) return `Dependência interna (${lugar.andar === "subsolo" ? "Subsolo" : "Térreo"})`;
    return "Ponto de interesse";
}

function adicionarMarcador(lugar) {
    const marcador = L.marker([lugar.y, lugar.x], {
        icon: getIcon(lugar.categoria, lugar.tipo, lugar.nome),
        title: lugar.nome,
        keyboard: true
    }).addTo(mapa);

    marcador.bindPopup(`
        <div class="popup-lugar">
            <strong>${escaparHtml(lugar.nome)}</strong>
            <span>${descricaoDoTipo(lugar)}</span>
        </div>
    `);

    marcadores.push(marcador);
    return marcador;
}

function limparMarcadores() {
    marcadores.forEach(m => mapa.removeLayer(m));
    marcadores = [];
}

function filtrar(tipo) {
    primeiraInicializacao = false;
    filtroAtual = (filtroAtual === tipo) ? null : tipo;
    marcarBotoesFiltro();
    aplicarFiltrosCombinados();
}

function corDaBorda(lugar) {
    const categoriaAlvo = lugar.bloco_pai || lugar.categoria;
    if (categoriaAlvo === "informatica" || lugar.nome.includes("Bloco A")) return "#790000";
    if (categoriaAlvo === "mecanica" || lugar.nome.includes("Bloco B")) return "#002f5e";
    if (categoriaAlvo === "edificacoes" || lugar.nome.includes("Bloco C")) return "#005b26";
    if (categoriaAlvo === "administrativo" || lugar.nome.includes("Bloco D")) return "#4e0071";
    if (lugar.tipo === "alerta") return "#e67e22";
    if (categoriaAlvo === "estacionamento") return "#f39c12";
    if (lugar.categoria === "rampa" || lugar.categoria === "escada") return "#047c50";
    return "#ccc";
}

/**
 * Monta a lista lateral do mapa público.
 * Sem `mostrarTodos`, exibe só os locais principais (subponto: false) —
 * usado no estado padrão do Mapa Geral.
 */
function atualizarListaLateral(lista, { mostrarTodos = false } = {}) {
    const container = document.getElementById("lista-lugares");
    if (!container) return;

    container.innerHTML = "";

    const listaParaExibir = mostrarTodos ? [...lista] : lista.filter(l => l.subponto === false);

    // Blocos e estacionamentos principais primeiro, na ordem definida
    listaParaExibir.sort((a, b) => {
        const iA = ORDEM_PRINCIPAIS.indexOf(a.nome);
        const iB = ORDEM_PRINCIPAIS.indexOf(b.nome);
        if (iA !== -1 && iB !== -1) return iA - iB;
        if (iA !== -1) return -1;
        if (iB !== -1) return 1;
        return 0;
    });

    atualizarContador(listaParaExibir.length);

    if (listaParaExibir.length === 0) {
        const vazio = document.createElement("p");
        vazio.className = "lista-vazia";
        const termo = document.getElementById("search-input")?.value.trim();
        vazio.textContent = termo
            ? `Nenhum local encontrado para "${termo}" em ${NOMES_ALAS[alaAtual]}. Confira a grafia ou troque de mapa.`
            : "Nenhum local com esse filtro neste mapa.";
        container.appendChild(vazio);
        return;
    }

    listaParaExibir.forEach(lugar => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "item-lugar";
        item.style.setProperty("--cor-borda", corDaBorda(lugar));
        item.innerHTML = `
            <p><strong>${escaparHtml(lugar.nome)}</strong></p>
            <span>${descricaoDoTipo(lugar)}</span>
        `;
        item.addEventListener("click", () => focarNoLugar(lugar));
        container.appendChild(item);
    });
}

function atualizarContador(quantidade) {
    const contador = document.getElementById("contador-resultados");
    if (contador) {
        contador.textContent = `${quantidade} ${quantidade === 1 ? "local" : "locais"}`;
    }
}

// Navega o mapa até um lugar, mostrando seu marcador (e, se for um
// Bloco raiz, também as salas internas dele).
function focarNoLugar(lugar) {
    primeiraInicializacao = false;
    limparMarcadores();

    const blocoPaiAlvo = BLOCOS_RAIZ[lugar.nome];

    if (blocoPaiAlvo) {
        const blocoRaiz = adicionarMarcador(lugar);
        const andarDaAla = getAndarDaAla();

        lugares
            .filter(l => {
                if (!l.subponto || l.bloco_pai !== blocoPaiAlvo) return false;
                if (lugar.nome === "Bloco A" || lugar.nome === "Bloco D") return l.andar === "terreo";
                return l.andar === andarDaAla;
            })
            .forEach(sala => adicionarMarcador(sala));

        mapa.setView([lugar.y, lugar.x], 1);
        blocoRaiz.openPopup();
        return;
    }

    const marcadorUnico = adicionarMarcador(lugar);
    mapa.setView([lugar.y, lugar.x], 1);
    marcadorUnico.openPopup();
}

// Busca por nome e vai direto pro local. Prioriza correspondência exata;
// senão usa a primeira parcial (ex: "auditorio" acha "Bloco A - Auditório A202").
function buscarEIrParaLocal() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    const termo = normalizarBusca(searchInput.value);
    if (!termo) return;

    const encontrado =
        lugares.find(l => normalizarBusca(l.nome) === termo) ||
        lugares.find(l => normalizarBusca(l.nome).includes(termo));

    searchInput.classList.remove("busca-sem-resultado");
    searchInput.removeAttribute("aria-invalid");

    if (encontrado) {
        // Local de outra planta: troca para a planta certa antes de focar
        const alaDoLugar = encontrado.andar === "subsolo" && plantas[encontrado.bloco_pai]
            ? encontrado.bloco_pai
            : "todos";
        if (alaDoLugar !== alaAtual) filtrarAla(alaDoLugar);
        focarNoLugar(encontrado);
    } else {
        // Feedback visual rápido de "não encontrado" (a lista já mostra a mensagem)
        searchInput.classList.add("busca-sem-resultado");
        searchInput.setAttribute("aria-invalid", "true");
        setTimeout(() => searchInput.classList.remove("busca-sem-resultado"), 1200);
    }
}

function handleBuscaKeydown(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        buscarEIrParaLocal();
    } else if (event.key === "Escape" && event.target.value) {
        event.preventDefault();
        event.target.value = "";
        event.target.dispatchEvent(new Event("input"));
    }
}

// "Ver Todos": todos os pontos de acessibilidade (física, auditiva e
// alertas) do mapa aberto. Clicar de novo desativa.
function mostrarTodos() {
    filtrar("acessibilidade");
}

function resetarMapaCompleto() {
    filtroAtual = null;
    alaAtual = "todos";
    primeiraInicializacao = true;

    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.value = "";
        searchInput.removeAttribute("aria-invalid");
    }

    marcarBotoesFiltro();
    marcarBotaoAla("todos");
    limparMarcadores();
    atualizarPlantaDeFundo();
}

// Promise resolvida quando o mapa já foi criado. Antes de criar o mapa,
// aplica as imagens de planta enviadas pelo admin (IndexedDB), se houver,
// para não exibir a planta antiga e depois trocar. Os scripts do admin
// (admin.js / admin-planta.js) esperam por ela antes de usar `mapa`.
const mapaPronto = new Promise((resolve) => {
    window.addEventListener("load", async () => {
        if (window.PlantasStorage) {
            await PlantasStorage.aplicarEm(plantas); // nunca lança erro
        }
        initMap();
        resolve();
    });
});
