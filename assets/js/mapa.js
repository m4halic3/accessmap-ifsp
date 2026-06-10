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
    // =========================================================================
    // 1. PONTOS PRINCIPAIS / BLOCOS ÂNCORAS (ORDEM DO TOPO DA SIDEBAR)
    // =========================================================================
    { nome: "Bloco A", tipo: "geral", categoria: "geral", andar: "terreo", y: 650, x: 1150, subponto: false },
    { nome: "Bloco B", tipo: "geral", categoria: "mecanica", andar: "terreo", y: 710, x: 780, subponto: false },
    { nome: "Bloco C", tipo: "geral", categoria: "edificacoes", andar: "terreo", y: 720, x: 640, subponto: false },
    { nome: "Bloco D", tipo: "geral", categoria: "administrativo", andar: "terreo", y: 630, x: 400, subponto: false },
    { nome: "Estacionamento interno A", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 520, x: 750, subponto: false },
    { nome: "Estacionamento interno B", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 500, x: 700, subponto: false },
    { nome: "Estacionamento externo", tipo: "geral", categoria: "estacionamento", andar: "terreo", y: 300, x: 600, subponto: false },
    { nome: "Quadra", tipo: "geral", categoria: "quadra", andar: "terreo", y: 650, x: 150, subponto: false },
    { nome: "Refeitório", tipo: "geral", categoria: "refeitorio", andar: "terreo", y: 800, x: 300, subponto: false },

    // =========================================================================
    // 3. DEPENDÊNCIAS INTERNAS / SUBPONTOS (NÃO APARECEM NA SIDEBAR - subponto: true)
    // =========================================================================
    
    // --- BLOCO A (VERMELHO) INFORMÁTICA ---
    { nome: "Bloco A - Auditório A202", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1110, subponto: true },
    { nome: "Bloco A - Sala dos Professores A209", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1245, subponto: true },
    { nome: "Bloco A - Lab A (A206)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1180, subponto: true },
    { nome: "Bloco A - Lab B (A208)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 630, x: 1220, subponto: true },
    { nome: "Bloco A - Lab de Pesquisa (A210)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1245, subponto: true },
    { nome: "Bloco A - Lab C (A207)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1220, subponto: true },
    { nome: "Bloco A - Lab D (A205)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1190, subponto: true },
    { nome: "Bloco A - Lab E (A204)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1160, subponto: true },
    { nome: "Bloco A - Lab de Hardware (A203)", tipo: "geral", categoria: "informatica", andar: "terreo", bloco_pai: "informatica", y: 700, x: 1110, subponto: true },

    // --- DEPENDÊNCIAS INTERNAS: ALA DA SECRETARIA (BLOCO A) ---
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
    { nome: "Bloco A - NAPNE (C501)", tipo: "geral", categoria: "secretaria", andar: "subsolo", bloco_pai: "informatica", y: 530, x: 1090, subponto: true },
    { nome: "Bloco A - NAPNE Atendimento", tipo: "geral", categoria: "secretaria", andar: "subsolo", bloco_pai: "informatica", y: 530, x: 1070, subponto: true },

    // --- DEPENDÊNCIAS INTERNAS: ALA DE SALAS DE AULA / LABORATÓRIOS (BLOCO A) ---
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

    // --- DEPENDÊNCIAS INTERNAS: ÁREA GERAL / CONVIVÊNCIA (BLOCO A) ---
    { nome: "Bloco A - Banheiro Masculino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 710, x: 1020, subponto: true },
    { nome: "Bloco A - Banheiro Feminino", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 710, x: 1070, subponto: true },
    { nome: "Bloco A - Cantina", tipo: "geral", categoria: "refeitorio", andar: "terreo", bloco_pai: "informatica", y: 685, x: 1045, subponto: true },
    { nome: "Bloco A - Espaço de Lazer", tipo: "geral", categoria: "quadra", andar: "terreo", bloco_pai: "informatica", y: 800, x: 1045, subponto: true },

    { nome: "Bloco A - Saguão Principal", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 330, x: 1045, subponto: true },
    { nome: "Bloco A - Biblioteca", tipo: "geral", categoria: "biblioteca", andar: "terreo", bloco_pai: "informatica", y: 300, x: 1000, subponto: true },
    { nome: "Bloco A - Sala dos Professores (Geral)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 440, x: 1000, subponto: true },
    { nome: "Bloco A - Alerta: Área em Construção", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "informatica", y: 550, x: 1000, subponto: true },
    { nome: "Bloco A - Entrada Principal", tipo: "geral", categoria: "entrada", andar: "terreo", bloco_pai: "informatica", y: 350, x: 500, subponto: true },

    // --- NOVOS BANHEIROS DO SAGUÃO (CONVENCIONAIS E ACESSÍVEIS) ---
    { nome: "Bloco A - Banheiro Masculino (Saguão)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 400, x: 1100, subponto: true },
    { nome: "Bloco A - Banheiro Feminino (Saguão)", tipo: "geral", categoria: "geral", andar: "terreo", bloco_pai: "informatica", y: 350, x: 1100, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Masculino (Saguão)", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 380, x: 1085, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Feminino (Saguão)", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 365, x: 1085, subponto: true },

    // --- ACESSIBILIDADE NO BLOCO A GERAL ---
    { nome: "Bloco A - Banheiro Acessível Feminino", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 680, x: 1015, subponto: true },
    { nome: "Bloco A - Banheiro Acessível Masculino", tipo: "fisica", categoria: "banheiro_acessivel", andar: "terreo", bloco_pai: "informatica", y: 680, x: 1075, subponto: true },
    { nome: "Bloco A - Rampa de Acesso Principal", tipo: "fisica", categoria: "rampa", andar: "terreo", bloco_pai: "informatica", y: 550, x: 1045, subponto: true },
    { nome: "Bloco A - Alerta: Piso Tátil Estragado", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "informatica", y: 610, x: 1045, subponto: true },


    // --- DEPENDÊNCIAS INTERNAS: ALA DOS SERVIDORES (BLOCO A) ---
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

    // --- BLOCO B (AZUL) ---
    { nome: "Bloco B - Sala de Aula Funcional 21", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 725, x: 785, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 22", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 715, x: 775, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 23", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 730, x: 790, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 24", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 710, x: 770, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 25", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 735, x: 795, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 26", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 705, x: 780, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 27", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 740, x: 785, subponto: true },
    { nome: "Bloco B - Sala de Aula Funcional 28", tipo: "geral", categoria: "mecanica", andar: "terreo", bloco_pai: "mecanica", y: 700, x: 775, subponto: true },
    { nome: "Subsolo B - Laboratório de CNC (B419)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 190, x: 480, subponto: true },
    { nome: "Subsolo B - Laboratório Industrial", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 600, x: 600, subponto: true },
    { nome: "Subsolo B - Sala B417", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 280, x: 840, subponto: true },
    { nome: "Subsolo B - Sala de Aula B418", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 340, x: 880, subponto: true },
    { nome: "Subsolo B - Sala NumPSA (B421)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 740, x: 790, subponto: true },
    { nome: "Subsolo B - Sala dos Professores (B420)", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 700, x: 880, subponto: true },
    { nome: "Subsolo B - Depósito", tipo: "geral", categoria: "mecanica", andar: "subsolo", bloco_pai: "mecanica", y: 190, x: 840, subponto: true },
    { nome: "Elevador - Subsolo B", tipo: "fisica", categoria: "elevador", andar: "subsolo", bloco_pai: "mecanica", y: 120, x: 840, subponto: true },
    { nome: "Escada - Subsolo B", tipo: "fisica", categoria: "escada", andar: "subsolo", bloco_pai: "mecanica", y: 70, x: 800, subponto: true },

    // --- BLOCO C (VERDE) ---
    { nome: "Bloco C - Sala 101 - Desenho Técnico", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 725, x: 645, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 11", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 715, x: 635, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 12", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 730, x: 650, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 13", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 710, x: 630, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 14", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 735, x: 655, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 15", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 705, x: 640, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 16", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 740, x: 645, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 17", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 700, x: 635, subponto: true },
    { nome: "Bloco C - Sala de Aula Adaptada 18", tipo: "geral", categoria: "edificacoes", andar: "terreo", bloco_pai: "edificacoes", y: 745, x: 650, subponto: true },
    { nome: "Subsolo C - Lab. de Concreto", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 250, x: 400, subponto: true },
    { nome: "Subsolo C - Almoxarifado", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 230, x: 550, subponto: true },
    { nome: "Subsolo C - Depósito", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 300, x: 550, subponto: true },
    { nome: "Subsolo C - Canteiro de Obras", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 600, x: 600, subponto: true },
    { nome: "Subsolo C - Sala W", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 700, x: 400, subponto: true },
    { nome: "Subsolo C - Laboratório de Mecânica dos Solos (C512)", tipo: "geral", categoria: "edificacoes", andar: "subsolo", bloco_pai: "edificacoes", y: 250, x: 750, subponto: true },
    { nome: "Elevador - Subsolo C", tipo: "fisica", categoria: "elevador", andar: "subsolo", bloco_pai: "edificacoes", y: 150, x: 550, subponto: true },
    { nome: "Escada - Subsolo C", tipo: "fisica", categoria: "escada", andar: "subsolo", bloco_pai: "edificacoes", y: 70, x: 600, subponto: true },

    // --- BLOCO D (ADMINISTRATIVO) ---
    { nome: "Bloco D - Sala de Aula 31", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 450, x: 855, subponto: true },
    { nome: "Bloco D - Sala de Aula 32", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 595, x: 845, subponto: true },
    { nome: "Bloco D - Sala de Aula 33", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 610, x: 840, subponto: true },
    { nome: "Bloco D - Sala de Aula 34", tipo: "geral", categoria: "salas_aula", andar: "terreo", bloco_pai: "administrativo", y: 590, x: 860, subponto: true },

    // =========================================================================
    // 4. PONTOS DE ACESSIBILIDADE E ALERTAS ATUALIZADOS
    // =========================================================================
    { nome: "Bloco A - Escadaria de Acesso Principal", tipo: "fisica", categoria: "escada", andar: "terreo", bloco_pai: "informatica", y: 360, x: 620, subponto: true },
    { nome: "Bloco C - Elevador (Verde)", tipo: "fisica", categoria: "elevador", andar: "terreo", bloco_pai: "edificacoes", y: 722, x: 642, subponto: true },
    { nome: "Vagas Exclusivas PCD - Estacionamento", tipo: "fisica", categoria: "vaga_pcd", andar: "terreo", y: 470, x: 700, subponto: false },
    { nome: "Bloco B - Alerta: Degrau sem Rampa", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "mecanica", y: 715, x: 775, subponto: true },
    { nome: "Alerta: Porta com Largura Reduzida na Entrada do Refeitório", tipo: "alerta", categoria: "alerta", andar: "terreo", y: 400, x: 820, subponto: false },

    { nome: "Alerta: Inclinação Excessiva na Rampa de Acesso à Quadra", tipo: "alerta", categoria: "alerta", andar: "terreo", y: 550, x: 510, subponto: false },
    { nome: "Alerta: Inclinação Excessiva na Rampa no Final do Bloco C", tipo: "alerta", categoria: "alerta", andar: "terreo", y: 480, x: 700, subponto: false },
    { nome: "Alerta: Piso Tátil Interrompido no Corredor Central", tipo: "alerta", categoria: "alerta", andar: "terreo", y: 665, x: 950, subponto: false }, 
    { nome: "Alerta: Porta com Largura Reduzida na Entrada do Refeitório", tipo: "alerta", categoria: "alerta", andar: "terreo", y: 650, x: 820, subponto: false },
    { nome: "Bloco A - Alerta: Ausência de Sinalização Sonora nos Laboratórios de Informática", tipo: "alerta", categoria: "alerta", andar: "terreo", bloco_pai: "informatica", y: 635, x: 1180, subponto: true },
];

let mapa;
let marcadores = [];
let camadaImagem = null; 
let filtroAtual = null;
let alaAtual = "todos"; 
let primeiraInicializacao = true; 


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
        // AJUSTADO: "vaga_pcd" e "banheiro_acessivel" agora usam "green" para o filtro de acessibilidade física
        if (categoria === "vaga_pcd") {
            cor = "green"; 
            descricaoAlt = `Ícone verde indicando vaga exclusiva PCD em: ${nomeLugar}`;
        } else if (categoria === "banheiro_acessivel") {
            cor = "green";
            descricaoAlt = `Ícone verde indicando banheiro acessível em: ${nomeLugar}`;
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

andarAtual = "subsolo"; // ou "terreo"
aplicarFiltrosCombinados(); // chama a função para atualizar tudo

function aplicarFiltrosCombinados() {
    let filtrados = lugares;

    const searchInput = document.getElementById('search-input');
    const termo = searchInput ? searchInput.value.toLowerCase().trim() : "";

    // =========================================================================
    // 1. FILTRAGEM POR ALA, ANDAR E EXCEÇÃO DE BUSCA
    // =========================================================================
    if (termo) {
        // SE HÁ BUSCA: Permite buscar QUALQUER lugar (inclusive subpontos e subsolo),
        // mas ainda respeita o filtro de tipo (acessibilidade/alerta) se houver um ativo.
        filtrados = lugares; 
    } else {
        // SEM BUSCA: Aplica as regras rígidas de navegação visual por cliques
        if (alaAtual === "todos") {
            // Na planta geral, exibe apenas os pontos principais do térreo
            filtrados = filtrados.filter(l => l.subponto === false && l.andar !== "subsolo");
        } else {
            // Em uma ala específica, exibe apenas o que pertence a ela e ao andar selecionado
            filtrados = filtrados.filter(l => 
                (l.categoria === alaAtual || l.bloco_pai === alaAtual) && 
                (l.andar === andarAtual)
            );
        }
    }

    // =========================================================================
    // 2. FILTRAGEM POR TIPO (ACESSIBILIDADE/ALERTA)
    // =========================================================================
    if (filtroAtual) {
        filtrados = filtrados.filter(l => l.tipo === filtroAtual);
    }

    // =========================================================================
    // 3. BUSCA POR TEXTO AVANÇADA (Captura por Nome ou Número da Sala)
    // =========================================================================
    if (termo) {
        filtrados = filtrados.filter(l => {
            const nomeNormalizado = l.nome.toLowerCase();
            // Permite achar digitando direto "a202" ou "b419" mesmo que no array esteja com traço "A-202"
            const nomeSemHifens = nomeNormalizado.replace(/-/g, "");
            
            return nomeNormalizado.includes(termo) || nomeSemHifens.includes(termo.replace(/-/g, ""));
        });
    }

    // =========================================================================
    // 4. RENDERIZAÇÃO
    // =========================================================================
    limparMarcadores(); 

    if (alaAtual === "todos" && primeiraInicializacao && !termo && !filtroAtual) {
        const blocosPrincipais = lugares.filter(l => l.subponto === false && l.andar !== "subsolo");
        atualizarListaLateral(blocosPrincipais); 
    } else {
        mostrarLugares(filtrados);
        // Passamos o 'termo' para a sidebar saber se deve ou não esconder os subpontos
        atualizarListaLateral(filtrados, termo); 
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
 * ATUALIZA A LISTA LATERAL TEXTUAL COM EXCEÇÃO PARA EXIBIR SUBPONTOS APENAS DURANTE A PESQUISA
 */
function atualizarListaLateral(lista, termoDeBusca = "") {
    const container = document.getElementById("lista-lugares");
    if (!container) return;
    
    container.innerHTML = "";

    let listaParaExibir = [];

    // LÓGICA CRÍTICA: Se o usuário estiver pesquisando algo, mostramos as salas internas.
    // Se o campo estiver vazio, filtramos para exibir APENAS os pontos principais.
    if (termoDeBusca.length > 0) {
        listaParaExibir = [...lista]; // Mostra tudo o que bateu com o termo digitado
    } else {
        listaParaExibir = lista.filter(lugar => lugar.subponto === false);
    }

    // Ordem de prioridade fixa para o topo do sidebar (quando aplicável)
    const ordemDesejada = [
        "Bloco A", 
        "Bloco B", 
        "Bloco C", 
        "Bloco D", 
        "Estacionamento interno A", 
        "Estacionamento interno B", 
        "Estacionamento externo"
    ];

    // Ordenação do sidebar
    listaParaExibir.sort((a, b) => {
        const indexA = ordemDesejada.indexOf(a.nome);
        const indexB = ordemDesejada.indexOf(b.nome);

        if (indexA !== -1 && indexB !== -1) return indexA - indexB; 
        if (indexA !== -1) return -1; 
        if (indexB !== -1) return 1;  
        return 0; 
    });

    // Renderização no HTML
    listaParaExibir.forEach(lugar => {
        const item = document.createElement("div");
        item.className = "item-lugar"; 
        
        let corBorda = "#ccc"; 
        const categoriaAlvo = lugar.bloco_pai || lugar.categoria;
        
        // Definição de cores das bordas baseada no bloco/categoria
        if (categoriaAlvo === "informatica" || lugar.nome.includes("Bloco A")) {
            corBorda = "#790000"; 
        } else if (categoriaAlvo === "mecanica" || lugar.nome.includes("Bloco B") || lugar.nome.includes("Subsolo B")) {
            corBorda = "#002f5e"; 
        } else if (categoriaAlvo === "edificacoes" || lugar.nome.includes("Bloco C") || lugar.nome.includes("Subsolo C")) {
            corBorda = "#005b26"; 
        } else if (categoriaAlvo === "administrativo" || lugar.nome.includes("Bloco D")) {
            corBorda = "#4e0071"; 
        } else if (lugar.tipo === "alerta") {
            corBorda = "#e67e22"; 
        } else if (categoriaAlvo === "estacionamento") {
            corBorda = "#f39c12"; 
        }

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
        else if (lugar.subponto) labelAcessibilidade = `Dependência Interna (${lugar.andar === 'subsolo' ? 'Subsolo' : 'Térreo'})`;

        item.innerHTML = `
            <p style="margin: 0 0 5px 0;"><strong>${lugar.nome}</strong></p>
            <span style="font-size: 12px; color: #666;">${labelAcessibilidade}</span>
        `;
        
        item.onclick = () => {
    if (primeiraInicializacao) {
        primeiraInicializacao = false;
    }

    limparMarcadores();

    // Lista de blocos que possuem salas agrupadas pelo nome
    const blocosComSubpontos = ["Bloco A", "Bloco B", "Bloco C", "Bloco D"];
    
    if (blocosComSubpontos.includes(lugar.nome)) {
        const blocoRaiz = adicionarMarcador(lugar);
        
        // Filtra todas as salas internas que pertencem textualmente a este bloco
        // E respeita o andar atual (exceto para o Bloco A e D que são focados no térreo)
        const subSalas = lugares.filter(l => {
            const pertenceAoBloco = l.nome.startsWith(`${lugar.nome} - `);
            
            if (lugar.nome === "Bloco A" || lugar.nome === "Bloco D") {
                return pertenceAoBloco; // Traz todas as salas e alas internas deles
            }
            return pertenceAoBloco && l.andar === andarAtual;
        });

        subSalas.forEach(sala => adicionarMarcador(sala));

        mapa.setView([lugar.y, lugar.x], 1);
        blocoRaiz.openPopup();
        return;
    }

    // Caso seja uma sala individual clicada diretamente a partir da pesquisa
    const marcadorUnico = adicionarMarcador(lugar);
    mapa.setView([lugar.y, lugar.x], 1);
    marcadorUnico.openPopup();
};
        
        container.appendChild(item);
    });
}
/**
 * MOSTRAR TODOS OS LOCAIS (Exclui os marcadores puros de acessibilidade e alertas)
 */
function mostrarTodos() {
    filtroAtual = null;
    primeiraInicializacao = false;

    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));

    // REMOVIDO: O filtro que excluía "fisica" e "auditiva"
    let listaFiltrada = lugares; 

    if (alaAtual === "todos") {
        listaFiltrada = listaFiltrada.filter(l => l.subponto === false);
    } else {
        // Agora, se estiver em uma ala, ele mantém todos os pontos (físicos ou não)
        // MAS respeita o andar atual (Térreo/Subsolo)
        listaFiltrada = listaFiltrada.filter(l => 
            (l.categoria === alaAtual || l.bloco_pai === alaAtual) && 
            l.andar === andarAtual
        );
    }

    mostrarLugares(listaFiltrada);
    atualizarListaLateral(listaFiltrada);
}

/**
 * RESET COMPLETO DO MAPA (Limpa todos os marcadores e exibe apenas os blocos âncoras na lista)
 */
function resetarMapaCompleto() {
    filtroAtual = null;
    alaAtual = "todos";
    primeiraInicializacao = true; // Ativa a trava inicial

    // Limpa filtros visuais e campos de busca
    document.querySelectorAll(".filtro").forEach(el => el.classList.remove("ativo"));
    document.querySelectorAll("#seletor-alas .btn-type").forEach(btn => btn.classList.remove("active"));
    
    const botoesAla = document.querySelectorAll("#seletor-alas .btn-type");
    if (botoesAla.length > 0) botoesAla[0].classList.add("active");

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    // Limpa o mapa completamente
    limparMarcadores();

    // Recarrega o fundo e monta a lista lateral limpa apenas com os blocos âncoras
    atualizarPlantaDeFundo();

    // ADICIONADO: Força a atualização da lista lateral para o estado inicial "Ver Tudo"
    const blocosPrincipais = lugares.filter(l => l.subponto === false);
    atualizarListaLateral(blocosPrincipais);
}
window.onload = initMap;