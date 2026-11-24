-- =========================================================
-- AccessMap - v2: vários espaços públicos
-- ---------------------------------------------------------
-- Até a v1 tudo era, implicitamente, do IFSP Campus Itapetininga:
-- as plantas ("alas"), os andares e os blocos estavam fixos no
-- esquema e no código. A partir daqui cada local, colaboração e
-- imagem de planta pertence a um ESPAÇO, e cada espaço tem as suas
-- próprias plantas e áreas (cores e ícones).
--
-- Os dados descritivos (nomes, cores, textos) vêm do "pacote" de
-- cada espaço em espacos/<slug>/espaco.json e são sincronizados pelo
-- servidor a cada inicialização. Esta migração só cria o IFSP com o
-- mínimo necessário para ligar os dados que já existem.
-- =========================================================

CREATE TABLE espaco (
    id             INT          NOT NULL AUTO_INCREMENT,
    slug           VARCHAR(60)  NOT NULL,
    nome           VARCHAR(150) NOT NULL,
    tipo           VARCHAR(40)  NOT NULL DEFAULT 'local',
    cidade         VARCHAR(100) NULL,
    padrao         BOOLEAN      NOT NULL DEFAULT FALSE,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE,
    -- textos da interface, link do mapa de localização e ordem dos destaques (JSON)
    configuracao   TEXT         NULL,
    criado_em      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_espaco_slug UNIQUE (slug),
    CONSTRAINT ck_espaco_slug CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$')
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Plantas (imagens de fundo do mapa) de cada espaço. `largura`/`altura` são a
-- área de coordenadas em que os locais são posicionados.
CREATE TABLE planta (
    id                 INT          NOT NULL AUTO_INCREMENT,
    espaco_id          INT          NOT NULL,
    codigo             VARCHAR(40)  NOT NULL,
    nome               VARCHAR(100) NOT NULL,
    rotulo_curto       VARCHAR(40)  NOT NULL,
    descricao          VARCHAR(150) NULL,
    principal          BOOLEAN      NOT NULL DEFAULT FALSE,
    andar_rotulo       VARCHAR(40)  NULL,     -- ex.: "subsolo", mostrado ao lado do local
    prefixo_nome       VARCHAR(100) NULL,     -- ex.: "Subsolo C", omitido no nome curto do mapa
    bloco              VARCHAR(40)  NULL,     -- área fixa dos locais cadastrados nesta planta
    largura            INT          NOT NULL,
    altura             INT          NOT NULL,
    imagem_url         VARCHAR(300) NOT NULL,
    hd_url             VARCHAR(300) NULL,
    proporcao_arte     DOUBLE       NULL,
    texto_alternativo  VARCHAR(300) NULL,
    ordem              INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_planta_codigo UNIQUE (espaco_id, codigo),
    CONSTRAINT fk_planta_espaco FOREIGN KEY (espaco_id) REFERENCES espaco (id) ON DELETE CASCADE,
    CONSTRAINT ck_planta_dimensoes CHECK (largura BETWEEN 100 AND 5000 AND altura BETWEEN 100 AND 5000)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Áreas de cada espaço: a cor diz ONDE fica o local (bloco, setor, ala...).
-- `predio` é o nome do local que representa o próprio prédio (ex.: "Bloco A").
CREATE TABLE area (
    id          INT          NOT NULL AUTO_INCREMENT,
    espaco_id   INT          NOT NULL,
    codigo      VARCHAR(40)  NOT NULL,
    rotulo      VARCHAR(100) NOT NULL,
    cor         VARCHAR(7)   NOT NULL,
    icone       VARCHAR(50)  NOT NULL,
    predio      VARCHAR(150) NULL,
    o_que       VARCHAR(100) NULL,
    na_legenda  BOOLEAN      NOT NULL DEFAULT TRUE,
    ordem       INT          NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT uk_area_codigo UNIQUE (espaco_id, codigo),
    CONSTRAINT fk_area_espaco FOREIGN KEY (espaco_id) REFERENCES espaco (id) ON DELETE CASCADE,
    CONSTRAINT ck_area_cor CHECK (cor REGEXP '^#[0-9A-Fa-f]{6}$')
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- ---------- O IFSP passa a ser o espaço nº 1 ----------
INSERT INTO espaco (slug, nome, tipo, cidade, padrao)
VALUES ('ifsp-itapetininga', 'IFSP — Campus Itapetininga', 'campus', 'Itapetininga - SP', TRUE);
SET @ifsp = LAST_INSERT_ID();

INSERT INTO planta (espaco_id, codigo, nome, rotulo_curto, principal, andar_rotulo, bloco, largura, altura, imagem_url, ordem) VALUES
    (@ifsp, 'todos',       'Mapa Geral',          'Mapa Geral',    TRUE,  NULL,      NULL,          1500, 1056, 'assets/images/plantas/todos/base.webp',       0),
    (@ifsp, 'edificacoes', 'Subsolo Edificações', 'Subsolo Edif.', FALSE, 'subsolo', 'edificacoes', 1200, 800,  'assets/images/plantas/edificacoes/base.webp', 1),
    (@ifsp, 'mecanica',    'Subsolo Mecânica',    'Subsolo Mec.',  FALSE, 'subsolo', 'mecanica',    1200, 800,  'assets/images/plantas/mecanica/base.webp',    2);

-- ---------- Locais: espaço + planta em que aparecem ----------
-- Antes, a planta era deduzida de andar + bloco: subsolo do Bloco B/C ia
-- para a planta daquele subsolo; todo o resto, para o Mapa Geral.
ALTER TABLE ponto_acessibilidade
    ADD COLUMN espaco_id INT NULL AFTER id,
    ADD COLUMN planta_id INT NULL AFTER espaco_id;

UPDATE ponto_acessibilidade p
SET p.espaco_id = @ifsp,
    p.planta_id = COALESCE(
        CASE WHEN p.andar = 'subsolo'
             THEN (SELECT pl.id FROM planta pl WHERE pl.espaco_id = @ifsp AND pl.codigo = p.bloco)
        END,
        (SELECT pl.id FROM planta pl WHERE pl.espaco_id = @ifsp AND pl.codigo = 'todos'));

ALTER TABLE ponto_acessibilidade
    MODIFY espaco_id INT NOT NULL,
    MODIFY planta_id INT NOT NULL,
    ADD CONSTRAINT fk_ponto_espaco FOREIGN KEY (espaco_id) REFERENCES espaco (id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_ponto_planta FOREIGN KEY (planta_id) REFERENCES planta (id);

-- O nome só precisa ser único dentro do mesmo espaço
ALTER TABLE ponto_acessibilidade DROP INDEX uk_ponto_nome;
ALTER TABLE ponto_acessibilidade ADD CONSTRAINT uk_ponto_nome UNIQUE (espaco_id, nome);

-- O andar agora é uma característica da planta (planta.andar_rotulo)
ALTER TABLE ponto_acessibilidade DROP CONSTRAINT ck_ponto_andar;
ALTER TABLE ponto_acessibilidade DROP COLUMN andar;

-- ---------- Colaborações ----------
ALTER TABLE colaboracao ADD COLUMN espaco_id INT NULL AFTER id;
UPDATE colaboracao SET espaco_id = @ifsp;
ALTER TABLE colaboracao
    MODIFY espaco_id INT NOT NULL,
    ADD CONSTRAINT fk_colaboracao_espaco FOREIGN KEY (espaco_id) REFERENCES espaco (id) ON DELETE CASCADE,
    ADD INDEX ix_colaboracao_espaco (espaco_id, excluido_em, criado_em);
ALTER TABLE colaboracao DROP INDEX ix_colaboracao_excluido;

-- ---------- Imagens de planta enviadas pelo admin ----------
-- A "ala" (todos/edificacoes/mecanica) vira uma referência à planta.
ALTER TABLE planta_versao ADD COLUMN planta_id INT NULL AFTER id;
UPDATE planta_versao v
JOIN planta pl ON pl.espaco_id = @ifsp AND pl.codigo = v.ala
SET v.planta_id = pl.id;
ALTER TABLE planta_versao
    MODIFY planta_id INT NOT NULL,
    ADD CONSTRAINT fk_planta_versao_planta FOREIGN KEY (planta_id) REFERENCES planta (id) ON DELETE CASCADE,
    ADD INDEX ix_planta_versao (planta_id, id);

ALTER TABLE planta_versao DROP CONSTRAINT ck_planta_ala;
ALTER TABLE planta_versao DROP INDEX ix_planta_ala;
ALTER TABLE planta_versao DROP COLUMN ala;
