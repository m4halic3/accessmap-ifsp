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
{ nome: "Alerta: Falta de rampa Externa de acesso ao Estacionamento Interno B", tipo: "alerta", categoria: "fisica", andar: "terreo", y: 200, x: 550, subponto: false },
{ nome: "Rampa Externa de acesso a quadra", tipo: "fisica", categoria: "rampa", andar: "terreo", y: 950, x: 400, subponto: false },
{ nome: "Escada Externa de acesso ao Estacionamento Interno B", tipo: "fisica", categoria: "escada", andar: "terreo", y: 800, x: 670, subponto: false },
{ nome: "Alerta: Porta Pequena (Acesso Externo)", tipo: "alerta", categoria: "física", andar: "terreo", y: 700, x: 330, subponto: false },

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

let mapa;
let marcadores = [];
let camadaImagem = null;
let filtroAtual = null;
let alaAtual = "todos";
let primeiraInicializacao = true;

function getAndarDaAla() {
    return (alaAtual === "todos") ? "terreo" : "subsolo";
}

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

    let cor = "black";
    let descricaoAlt = `Marcador de ponto de interesse: ${nomeLugar}`;

    if (tipo === "auditiva") {
        cor = "red";
        descricaoAlt = `Ícone vermelho indicando acessibilidade auditiva em: ${nomeLugar}`;
    } else if (tipo === "fisica") {
        cor = "green";
        if (categoria === "vaga_pcd") descricaoAlt = `Ícone verde indicando vaga exclusiva PCD em: ${nomeLugar}`;
        else if (categoria === "banheiro_acessivel") descricaoAlt = `Ícone verde indicando banheiro acessível em: ${nomeLugar}`;
        else descricaoAlt = `Ícone verde indicando estrutura de acessibilidade física em: ${nomeLugar}`;
    } else {
        if (categoria === "secretaria") cor = "red";
        if (categoria === "mecanica") cor = "blue";
        if (categoria === "biblioteca") cor = "red";
        if (categoria === "edificacoes") cor = "green";
        if (categoria === "informatica") cor = "red";
        if (categoria === "geral") cor = "red";
        if (categoria === "administrativo") {
            cor = "violet";
            descricaoAlt = `Ícone roxo indicando o Bloco D ou suas dependências em: ${nomeLugar}`;
        }
        if (["estacionamento","entrada","quadra","refeitorio","salas_externas"].includes(categoria)) {
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

function atualizarPlantaDeFundo() {
    if (camadaImagem) {
        mapa.removeLayer(camadaImagem);
    }

    const dadosPlanta = plantas[alaAtual];
    const limites = [[0, 0], [dadosPlanta.altura, dadosPlanta.largura]];

    let textAltPlanta = "Mapa do Campus Geral com distribuição dos blocos e caminhos.";
    if (alaAtual === "edificacoes") textAltPlanta = "Planta baixa detalhada do Subsolo do Bloco C (Edificações).";
    if (alaAtual === "mecanica") textAltPlanta = "Planta baixa detalhada do Subsolo do Bloco B (Mecânica).";

    camadaImagem = L.imageOverlay(dadosPlanta.url, limites, {
        alt: textAltPlanta
    }).addTo(mapa);

    mapa.fitBounds(limites);
    aplicarFiltrosCombinados();
}

function filtrarAla(ala, elemento) {
    primeiraInicializacao = false;

    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-current", "false");
    });

    alaAtual = ala;
    elemento.classList.add("active");
    elemento.setAttribute("aria-current", "true");

    atualizarPlantaDeFundo();
}

function aplicarFiltrosCombinados() {
    const searchInput = document.getElementById('search-input');
    const termo = searchInput ? searchInput.value.toLowerCase().trim() : "";

    let filtrados;

    if (termo) {
        filtrados = lugares.filter(l => {
            const nomeNormalizado = l.nome.toLowerCase();
            const nomeSemHifens = nomeNormalizado.replace(/-/g, "");
            return nomeNormalizado.includes(termo) || nomeSemHifens.includes(termo.replace(/-/g, ""));
        });
    } else {
        // Sem busca: comportamento original baseado na ala selecionada
        if (alaAtual === "todos") {
            if (filtroAtual) {
                filtrados = [...lugares];
            } else {
                filtrados = lugares.filter(l => l.subponto === false && l.andar === "terreo");
            }
        } else {
            filtrados = lugares.filter(l =>
                l.bloco_pai === alaAtual &&
                l.andar === "subsolo"
            );
        }
    }

    // Aplicação do filtro por tipo de acessibilidade
// Aplicação do filtro por tipo de acessibilidade
if (filtroAtual) {
    if (filtroAtual === "fisica") {
        filtrados = filtrados.filter(l => l.tipo === "fisica" || l.tipo === "alerta");
    } else if (filtroAtual === "auditiva") {
        filtrados = filtrados.filter(l => l.tipo === "auditiva");
    } else {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    // No mapa geral, oculta itens que pertencem ao subsolo
    if (alaAtual === "todos") {
        filtrados = filtrados.filter(l => l.andar !== "subsolo");
    }
}

    limparMarcadores();

    if (alaAtual === "todos" && primeiraInicializacao && !termo && !filtroAtual) {
        const blocosPrincipais = lugares.filter(l => l.subponto === false && l.andar === "terreo");
        atualizarListaLateral(blocosPrincipais, "");
    } else {
        mostrarLugares(filtrados);
        // -----------------------------------------------------------------
        // CORREÇÃO: passa `termo` para atualizarListaLateral em todos os casos,
        // garantindo que a lista lateral não filtre subpontos quando há busca
        // -----------------------------------------------------------------
        atualizarListaLateral(filtrados, termo);
    }
}

function mostrarLugares(lista) {
    limparMarcadores();
    lista.forEach(lugar => adicionarMarcador(lugar));
}

function adicionarMarcador(lugar) {
    const marcador = L.marker([lugar.y, lugar.x], {
        icon: getIcon(lugar.categoria, lugar.tipo, lugar.nome)
    }).addTo(mapa);

    let textoPopup = "Ponto de Interesse";
    if (lugar.tipo === "alerta") textoPopup = "<span style='color:#800000; font-weight:bold;'>⚠️ Barreira Física Encontrada (Necessita de Melhorias)</span>";
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

function filtrar(tipo, elemento) {
    primeiraInicializacao = false;

    document.querySelectorAll(".filtro").forEach(el => {
        el.classList.remove("ativo");
        el.setAttribute("aria-pressed", "false");
    });

    if (filtroAtual === tipo) {
        filtroAtual = null;
    } else {
        filtroAtual = tipo;
        elemento.classList.add("ativo");
        elemento.setAttribute("aria-pressed", "true");
    }
    aplicarFiltrosCombinados();
}

function pesquisarLugares() {
    primeiraInicializacao = false;
    aplicarFiltrosCombinados();
}

function atualizarListaLateral(lista, termoDeBusca = "") {
    const container = document.getElementById("lista-lugares");
    if (!container) return;

    container.innerHTML = "";

    // -----------------------------------------------------------------
    // CORREÇÃO: com busca ativa, exibe TODOS os resultados recebidos
    // (incluindo subpontos) sem nenhum filtro adicional aqui.
    // Sem busca e sem filtro: exibe apenas pontos principais (subponto false).
    // -----------------------------------------------------------------
    let listaParaExibir;

    if (termoDeBusca.length > 0) {
        // Busca ativa: mostra tudo que foi encontrado, inclusive subpontos
        listaParaExibir = [...lista];
    } else if (filtroAtual) {
        // Filtro de acessibilidade ativo sem busca: mostra tudo
        listaParaExibir = [...lista];
    } else if (alaAtual !== "todos") {
        // Ala de subsolo sem busca e sem filtro: mostra todos os subpontos daquela ala
        listaParaExibir = [...lista];
    } else {
        // Estado padrão (mapa geral, sem busca, sem filtro): só pontos principais
        listaParaExibir = lista.filter(l => l.subponto === false);
    }

    const ordemDesejada = ["Bloco A", "Bloco B", "Bloco C", "Bloco D",
        "Estacionamento interno A", "Estacionamento interno B", "Estacionamento externo"];

    listaParaExibir.sort((a, b) => {
        const iA = ordemDesejada.indexOf(a.nome);
        const iB = ordemDesejada.indexOf(b.nome);
        if (iA !== -1 && iB !== -1) return iA - iB;
        if (iA !== -1) return -1;
        if (iB !== -1) return 1;
        return 0;
    });

    listaParaExibir.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar";

        let corBorda = "#ccc";
        const categoriaAlvo = lugar.bloco_pai || lugar.categoria;
        if (categoriaAlvo === "informatica" || lugar.nome.includes("Bloco A")) corBorda = "#790000";
        else if (categoriaAlvo === "mecanica" || lugar.nome.includes("Bloco B") || lugar.nome.includes("Subsolo B")) corBorda = "#002f5e";
        else if (categoriaAlvo === "edificacoes" || lugar.nome.includes("Bloco C") || lugar.nome.includes("Subsolo C")) corBorda = "#005b26";
        else if (categoriaAlvo === "administrativo" || lugar.nome.includes("Bloco D")) corBorda = "#4e0071";
        else if (lugar.tipo === "alerta") corBorda = "#e67e22";
        else if (categoriaAlvo === "estacionamento") corBorda = "#f39c12";
        else if (lugar.categoria === "rampa" || lugar.categoria === "escada") corBorda = "#047c50"; // Azul para acessos
else if (lugar.tipo === "alerta") corBorda = "#be5900";

        item.style.cssText = `
            border-left: 5px solid ${corBorda};
            padding: 10px 15px;
            margin-bottom: 8px;
            background-color: #f9f9f9;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s ease;
        `;

        item.onmouseenter = () => item.style.backgroundColor = "#f1f1f1";
        item.onmouseleave = () => item.style.backgroundColor = "#f9f9f9";

        let labelAcessibilidade = "Ponto de Interesse";
        if (lugar.tipo === "alerta") {
            labelAcessibilidade = "<span style='color:#800000; font-weight:bold;'>⚠️ Necessita de Melhorias</span>";
        } else if (lugar.tipo === "auditiva") {
            labelAcessibilidade = "Acessibilidade Auditiva";
        } else if (lugar.subponto) {
            const andarLabel = lugar.andar === "subsolo" ? "Subsolo" : "Térreo";
            labelAcessibilidade = `Dependência Interna (${andarLabel})`;
        }

        item.innerHTML = `
            <p style="margin: 0 0 5px 0;"><strong>${lugar.nome}</strong></p>
            <span style="font-size: 12px; color: #666;">${labelAcessibilidade}</span>
        `;

        item.onclick = () => {
            primeiraInicializacao = false;
            limparMarcadores();

            const blocosRaiz = ["Bloco A", "Bloco B", "Bloco C", "Bloco D"];

            if (blocosRaiz.includes(lugar.nome)) {
                const blocoRaiz = adicionarMarcador(lugar);

                const mapaBlocoPai = {
                    "Bloco A": "informatica",
                    "Bloco B": "mecanica",
                    "Bloco C": "edificacoes",
                    "Bloco D": "administrativo"
                };
                const blocoPaiAlvo = mapaBlocoPai[lugar.nome];
                const andarDaAla = getAndarDaAla();

                const subSalas = lugares.filter(l => {
                    if (!l.subponto) return false;
                    if (l.bloco_pai !== blocoPaiAlvo) return false;
                    if (lugar.nome === "Bloco A" || lugar.nome === "Bloco D") {
                        return l.andar === "terreo";
                    }
                    return l.andar === andarDaAla;
                });

                subSalas.forEach(sala => adicionarMarcador(sala));
                mapa.setView([lugar.y, lugar.x], 1);
                blocoRaiz.openPopup();
                return;
            }

            const marcadorUnico = adicionarMarcador(lugar);
            mapa.setView([lugar.y, lugar.x], 1);
            marcadorUnico.openPopup();
        };

        container.appendChild(item);
    });
}

function mostrarTodos() {
    filtroAtual = null;
    primeiraInicializacao = false;

    document.querySelectorAll(".filtro").forEach(el => {
        el.classList.remove("ativo");
        el.setAttribute("aria-pressed", "false");
    });

    aplicarFiltrosCombinados();
}

function resetarMapaCompleto() {
    filtroAtual = null;
    alaAtual = "todos";
    primeiraInicializacao = true;

    document.querySelectorAll(".filtro").forEach(el => {
        el.classList.remove("ativo");
        el.setAttribute("aria-pressed", "false");
    });
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => {
        btn.classList.remove("active");
        btn.setAttribute("aria-current", "false");
    });

    const botoesAla = document.querySelectorAll("#seletor-alas .btn-type");
    if (botoesAla.length > 0) {
        botoesAla[0].classList.add("active");
        botoesAla[0].setAttribute("aria-current", "true");
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    limparMarcadores();
    atualizarPlantaDeFundo();

    const blocosPrincipais = lugares.filter(l => l.subponto === false && l.andar === "terreo");
    atualizarListaLateral(blocosPrincipais, "");
}

window.onload = initMap;