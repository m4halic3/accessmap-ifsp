-- =========================================================
-- AccessMap - esquema inicial (modelo de dados do README)
-- =========================================================

CREATE TABLE administrador (
    id            INT          NOT NULL AUTO_INCREMENT,
    nome_usuario  VARCHAR(80)  NOT NULL,
    senha_hash    VARCHAR(255) NOT NULL,
    perfil        VARCHAR(20)  NOT NULL DEFAULT 'admin',
    ativo         BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ultimo_login  DATETIME     NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_administrador_usuario UNIQUE (nome_usuario),
    CONSTRAINT ck_administrador_perfil CHECK (perfil IN ('admin', 'superadmin'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- `codigo` é o identificador usado pela API e pelo front-end ("fisica", "auditiva").
-- Novas categorias (visual, cognitiva...) entram aqui sem mudar o código.
CREATE TABLE categoria_acessibilidade (
    id                 INT         NOT NULL AUTO_INCREMENT,
    codigo             VARCHAR(30) NOT NULL,
    nome               VARCHAR(50) NOT NULL,
    icone              VARCHAR(50) NULL,
    cor_identificacao  VARCHAR(7)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_categoria_codigo UNIQUE (codigo)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO categoria_acessibilidade (codigo, nome, icone, cor_identificacao) VALUES
    ('fisica',   'Física',   'fa-wheelchair',  '#1565c0'),
    ('auditiva', 'Auditiva', 'fa-ear-deaf',    '#ad1457');

-- Locais do mapa. Como o mapa usa as plantas do campus (e não um mapa
-- geográfico), a posição é guardada em coordenadas da planta (pos_x / pos_y).
--   tipo:  geral (ponto de interesse) | acessibilidade (exige categoria_id) | alerta
--   area:  área/uso do local, usada para escolher cor e ícone (ex.: salas_aula, rampa)
--   bloco: bloco ao qual o local pertence (informatica, mecanica, edificacoes, administrativo)
CREATE TABLE ponto_acessibilidade (
    id                INT          NOT NULL AUTO_INCREMENT,
    categoria_id      INT          NULL,
    administrador_id  INT          NULL,
    nome              VARCHAR(150) NOT NULL,
    descricao         TEXT         NULL,
    tipo              VARCHAR(20)  NOT NULL,
    area              VARCHAR(40)  NOT NULL DEFAULT 'geral',
    andar             VARCHAR(10)  NOT NULL DEFAULT 'terreo',
    bloco             VARCHAR(40)  NULL,
    subponto          BOOLEAN      NOT NULL DEFAULT FALSE,
    pos_x             INT          NOT NULL,
    pos_y             INT          NOT NULL,
    status            VARCHAR(20)  NOT NULL DEFAULT 'ativo',
    criado_em         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em     DATETIME     NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_ponto_nome UNIQUE (nome),
    CONSTRAINT fk_ponto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_acessibilidade (id),
    CONSTRAINT fk_ponto_administrador FOREIGN KEY (administrador_id) REFERENCES administrador (id) ON DELETE SET NULL,
    CONSTRAINT ck_ponto_tipo CHECK (tipo IN ('geral', 'acessibilidade', 'alerta')),
    CONSTRAINT ck_ponto_tipo_categoria CHECK ((tipo = 'acessibilidade') = (categoria_id IS NOT NULL)),
    CONSTRAINT ck_ponto_andar CHECK (andar IN ('terreo', 'subsolo')),
    CONSTRAINT ck_ponto_status CHECK (status IN ('ativo', 'em_manutencao', 'inativo'))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Relatos e sugestões do formulário público. A exclusão pelo administrador
-- é lógica (excluido_em), o que permite "Desfazer" e mantém o histórico.
CREATE TABLE colaboracao (
    id                INT          NOT NULL AUTO_INCREMENT,
    categoria_id      INT          NOT NULL,
    ponto_id          INT          NULL,
    administrador_id  INT          NULL,
    local_texto       VARCHAR(150) NOT NULL,
    relato            TEXT         NOT NULL,
    status            VARCHAR(20)  NOT NULL DEFAULT 'pendente',
    ip_origem         VARCHAR(45)  NULL,
    criado_em         DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    excluido_em       DATETIME     NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_colaboracao_categoria FOREIGN KEY (categoria_id) REFERENCES categoria_acessibilidade (id),
    CONSTRAINT fk_colaboracao_ponto FOREIGN KEY (ponto_id) REFERENCES ponto_acessibilidade (id) ON DELETE SET NULL,
    CONSTRAINT fk_colaboracao_administrador FOREIGN KEY (administrador_id) REFERENCES administrador (id) ON DELETE SET NULL,
    CONSTRAINT ck_colaboracao_status CHECK (status IN ('pendente', 'em_analise', 'resolvido')),
    INDEX ix_colaboracao_excluido (excluido_em, criado_em)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Imagens de planta enviadas pelo administrador. A versão em uso de cada ala é
-- a de maior id; a anterior fica guardada para "Voltar ao mapa anterior".
-- Sem nenhuma linha para a ala, o mapa usa a imagem original do projeto.
CREATE TABLE planta_versao (
    id                 INT          NOT NULL AUTO_INCREMENT,
    ala                VARCHAR(20)  NOT NULL,
    administrador_id   INT          NULL,
    nome_arquivo       VARCHAR(255) NOT NULL,
    tipo_mime          VARCHAR(30)  NOT NULL,
    tamanho            INT          NOT NULL,
    largura            INT          NOT NULL,
    altura             INT          NOT NULL,
    texto_alternativo  VARCHAR(300) NULL,
    conteudo           LONGBLOB     NOT NULL,
    criado_em          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_planta_administrador FOREIGN KEY (administrador_id) REFERENCES administrador (id) ON DELETE SET NULL,
    CONSTRAINT ck_planta_ala CHECK (ala IN ('todos', 'edificacoes', 'mecanica')),
    INDEX ix_planta_ala (ala, id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
