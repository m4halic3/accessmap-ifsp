# AccessMap

**Mapeamento colaborativo de acessibilidade em espaços públicos**

> Projeto de Extensão — Tecnologia em Sistemas para Internet
> IFSP Campus Itapetininga — 2026/2027

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Motivação](#motivação)
- [Impacto e Gestão Pública](#impacto-e-gestão-pública)
- [Visão de Expansão](#visão-de-expansão)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura da Versão Atual (v1 — sem banco de dados)](#arquitetura-da-versão-atual-v1--sem-banco-de-dados)
- [Modelo de Dados](#modelo-de-dados)
  - [Visão Geral das Entidades](#visão-geral-das-entidades)
  - [Diagrama Entidade-Relacionamento](#diagrama-entidade-relacionamento)
  - [Dicionário de Dados](#dicionário-de-dados)
  - [Migração para Banco de Dados Real](#migração-para-banco-de-dados-real)
- [Fluxos do Sistema](#fluxos-do-sistema)
- [Acesso Administrativo (Ambiente de Avaliação)](#acesso-administrativo-ambiente-de-avaliação)
- [Como Executar Localmente](#como-executar-localmente)
- [Acessibilidade](#acessibilidade)
- [Roadmap](#roadmap)
- [Autoria e Desenvolvimento](#autoria-e-desenvolvimento)
- [Licença](#licença)

---

## Sobre o Projeto

O **AccessMap** é um projeto de extensão que visa mapear e catalogar pontos de acessibilidade dentro de espaços públicos, promovendo a inclusão em sua forma mais ampla. Sua primeira aplicação prática ocorre no **campus do IFSP Itapetininga**, servindo como piloto para validar a proposta antes de uma expansão maior.

Esta iniciativa surge da necessidade de oferecer suporte e orientação a alunos, servidores e visitantes. O campus recebe pessoas em contextos variados — do dia a dia letivo a eventos de grande porte que atraem públicos diversos — e ter um suporte de acessibilidade claro é essencial para garantir que todos tenham uma experiência inclusiva e autônoma no espaço.

O objetivo central vai além de facilitar a locomoção física: o AccessMap também contempla o suporte a dificuldades auditivas e visuais, unindo mapeamento geográfico, categorização de barreiras e um canal aberto de comunicação com a comunidade.

## Motivação

Espaços públicos — sejam eles instituições de ensino, órgãos públicos, parques ou centros culturais — frequentemente carecem de informação estruturada sobre suas condições de acessibilidade. Rampas mal sinalizadas, ausência de recursos para pessoas com deficiência auditiva, falta de rotas alternativas: tudo isso poderia ser mapeado e comunicado de forma simples, colaborativa e visual.

O AccessMap nasce dessa lacuna, propondo uma ferramenta que:

1. **Informa** — apresenta um mapa navegável com pontos de acessibilidade já identificados;
2. **Escuta** — permite que qualquer visitante relate barreiras ou sugira melhorias, sem necessidade de cadastro;
3. **Organiza** — centraliza esses relatos em um painel administrativo, permitindo à gestão do espaço priorizar ações.

## Impacto e Gestão Pública

Os dados coletados pelo AccessMap possuem um papel importante para a comunidade e para a gestão do espaço público:

- **Mapeamento de Necessidades** — identificação real do que precisa ser melhorado, a partir da voz de quem utiliza o espaço no dia a dia.
- **Propostas de Melhoria** — as informações coletadas podem ser estruturadas em relatórios para fundamentar pedidos de verba, emendas parlamentares ou projetos de captação de recursos.
- **Transparência** — demonstração clara e baseada em dados de onde os investimentos em infraestrutura inclusiva devem ser priorizados.

## Visão de Expansão

Embora o desenvolvimento inicial tenha sido pensado e testado para o campus do **IFSP Itapetininga**, a arquitetura do AccessMap foi projetada desde o início para não ficar presa a um único local. A ideia é que qualquer espaço público — outra unidade do IFSP, uma prefeitura, um parque, um hospital, um centro cultural — possa adotar o mesmo sistema, com seu próprio mapa, seus próprios pontos de acessibilidade e seu próprio painel administrativo.

Para viabilizar isso, o modelo de dados (ver [Modelo de Dados](#modelo-de-dados)) já prevê uma entidade de **Unidade/Instituição**, de forma que múltiplos locais possam futuramente coexistir na mesma base, cada um com seus próprios administradores, pontos mapeados e colaborações recebidas — sem que um local tenha acesso ou interferência sobre os dados de outro.

## Funcionalidades

### Área Pública (sem necessidade de login)

- Página inicial institucional com carrossel informativo, seção de estatísticas e apresentação do projeto.
- Mapa interativo do campus, com possibilidade futura de marcadores por categoria de acessibilidade.
- Formulário de colaboração, no qual qualquer visitante pode relatar um problema ou sugerir uma melhoria, informando:
  - Local da ocorrência;
  - Categoria de acessibilidade (física ou auditiva, com plano de expansão para outras categorias);
  - Relato ou sugestão em texto livre.
- Widget de acessibilidade nativo (aumento/diminuição de fonte e alto contraste) e integração com o **VLibras**, tradutor de Libras do Governo Federal.

### Área Administrativa (restrita, mediante login)

- Autenticação de administrador.
- Dashboard de respostas coletadas pelo formulário público, com:
  - Filtro por local;
  - Filtro por categoria de acessibilidade;
  - Busca por palavra-chave no relato;
  - Ordenação (mais recentes, mais antigos, ordem alfabética por local);
  - Exclusão de respostas já tratadas.
- Ponto de entrada para a futura edição de pontos do mapa (`admin.html`).

## Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Estrutura | **HTML5** | Marcação semântica e acessível |
| Estilo | **SASS (SCSS)** | Estilização avançada, arquitetura modular e design responsivo |
| Interatividade | **JavaScript (Vanilla)** | Carrossel, menus, autenticação, formulário, dashboard |
| Persistência (atual) | **Web Storage API** (`localStorage` / `sessionStorage`) | Simulação de banco de dados no navegador enquanto não há back-end |
| Ícones | **Font Awesome 6** | Iconografia da interface |
| Acessibilidade | **VLibras** (Governo Federal) | Tradução de conteúdo para Libras |
| Mapas | **Google Maps Embed** | Visualização geográfica do campus |

> A escolha por manter a v1 inteiramente funcional no front-end, sem depender de um back-end ou banco de dados, foi proposital: garante que a aplicação possa ser avaliada, testada e demonstrada em qualquer navegador, sem necessidade de infraestrutura de servidor.

## Estrutura do Projeto

```
accessmap-ifsp/
├── assets/
│   ├── css/
│   │   └── style.css          # CSS compilado a partir do SCSS
│   ├── images/                # Logos, ícones, fotos da equipe, slides
│   └── js/
│       ├── script.js          # Menu, carrossel, acessibilidade, formulário público
│       ├── authentication.js  # Autenticação do administrador
│       ├── dashboard.js       # Leitura/filtro/exclusão de respostas no painel
│       └── mapa.js            # Busca e navegação no mapa interativo
├── index.html                 # Página institucional / pública
├── login.html                 # Login exclusivo do administrador
├── dashboard.html              # Painel administrativo (protegido)
├── admin.html                  # Edição de pontos do mapa (protegido)
├── mapa.html                    # Mapa interativo do campus
├── README.md
└── LICENSE
```

## Arquitetura da Versão Atual (v1 — sem banco de dados)

Como o projeto ainda não possui um back-end, toda a "persistência de dados" da v1 é feita através da **Web Storage API** do próprio navegador, o que permite que o sistema funcione de ponta a ponta — captação de relatos, login administrativo e visualização no dashboard — sem depender de servidor.

| Mecanismo | Uso no AccessMap | Escopo |
|---|---|---|
| `sessionStorage` | Guarda o estado de sessão do administrador logado (`accessmap_admin_logado`) | Expira ao fechar o navegador |
| `localStorage` | Guarda as colaborações enviadas pelo formulário público (`accessmap_respostas`) e a preferência de alto contraste (`altoContrasteState`) | Persiste entre sessões, no mesmo navegador/dispositivo |

Essa abordagem tem uma limitação intencional e conhecida: os dados ficam restritos ao navegador/dispositivo em que foram inseridos, não sendo compartilhados entre diferentes usuários ou máquinas. Isso é aceitável para fins de demonstração e avaliação acadêmica da v1, mas será substituído por um back-end real (API + banco de dados) nas próximas versões — ver [Migração para Banco de Dados Real](#migração-para-banco-de-dados-real).

## Modelo de Dados

Mesmo sem um banco de dados implementado na v1, o projeto já foi modelado pensando na estrutura relacional que sustentará as próximas versões — inclusive contemplando a expansão para múltiplos locais públicos (ver [Visão de Expansão](#visão-de-expansão)).

### Visão Geral das Entidades

- **Unidade** — representa um espaço público cadastrado no sistema (ex: "IFSP Itapetininga"). É a entidade que viabiliza a expansão multi-local.
- **Administrador** — usuário com acesso à área restrita, sempre vinculado a uma Unidade.
- **PontoAcessibilidade** — um local específico dentro da Unidade que foi mapeado (ex: "Rampa - Bloco A"), com sua categoria e coordenadas.
- **Colaboracao** — um relato ou sugestão enviado pelo público através do formulário, podendo opcionalmente referenciar um Ponto de Acessibilidade já existente.
- **CategoriaAcessibilidade** — tabela de apoio que padroniza as categorias disponíveis (física, auditiva, visual, etc.), permitindo adicionar novas categorias sem alterar código.

### Diagrama Entidade-Relacionamento

```mermaid
erDiagram
    UNIDADE ||--o{ ADMINISTRADOR : possui
    UNIDADE ||--o{ PONTO_ACESSIBILIDADE : mapeia
    UNIDADE ||--o{ COLABORACAO : recebe
    CATEGORIA_ACESSIBILIDADE ||--o{ PONTO_ACESSIBILIDADE : classifica
    CATEGORIA_ACESSIBILIDADE ||--o{ COLABORACAO : classifica
    PONTO_ACESSIBILIDADE ||--o{ COLABORACAO : "referenciado por (opcional)"

    UNIDADE {
        int id PK
        string nome
        string sigla
        string endereco
        string cidade
        string estado
        decimal latitude
        decimal longitude
        datetime criado_em
    }

    ADMINISTRADOR {
        int id PK
        int unidade_id FK
        string nome_usuario
        string senha_hash
        string perfil
        boolean ativo
        datetime criado_em
        datetime ultimo_login
    }

    CATEGORIA_ACESSIBILIDADE {
        int id PK
        string nome
        string icone
        string cor_identificacao
    }

    PONTO_ACESSIBILIDADE {
        int id PK
        int unidade_id FK
        int categoria_id FK
        string nome
        string descricao
        decimal latitude
        decimal longitude
        string status
        datetime criado_em
        datetime atualizado_em
    }

    COLABORACAO {
        int id PK
        int unidade_id FK
        int categoria_id FK
        int ponto_id FK
        string local_texto
        text relato
        string status
        string ip_origem
        datetime criado_em
    }
```

### Diagrama de Fluxo de Dados (v1 — sem banco de dados)

Para tornar explícito como a v1 simula esse modelo relacional usando apenas o navegador, o diagrama abaixo mostra o fluxo real de dados hoje:

```mermaid
flowchart LR
    subgraph Publico["Área Pública (index.html)"]
        F[Formulário de Colaboração]
    end

    subgraph Armazenamento["Web Storage do Navegador"]
        LS1[("localStorage:\naccessmap_respostas")]
        LS2[("localStorage:\naltoContrasteState")]
        SS1[("sessionStorage:\naccessmap_admin_logado")]
    end

    subgraph Admin["Área Administrativa"]
        L[login.html]
        D[dashboard.html]
    end

    F -- "salva relato" --> LS1
    D -- "lê / filtra / exclui" --> LS1
    L -- "grava sessão ao autenticar" --> SS1
    D -- "verifica sessão ativa" --> SS1
    D -.futuro.-> API[("API + Banco de Dados\n(v2)")]
    LS1 -.migração futura.-> API
```

### Dicionário de Dados

#### Tabela `unidade`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | INT (PK) | Sim | Identificador único da unidade/local público |
| `nome` | VARCHAR(150) | Sim | Nome completo do local (ex: "IFSP Campus Itapetininga") |
| `sigla` | VARCHAR(20) | Não | Sigla ou abreviação usada na interface |
| `endereco` | VARCHAR(200) | Não | Endereço completo do local |
| `cidade` | VARCHAR(100) | Sim | Cidade onde o local está situado |
| `estado` | CHAR(2) | Sim | UF do local |
| `latitude` | DECIMAL(10,7) | Não | Coordenada usada para centralizar o mapa da unidade |
| `longitude` | DECIMAL(10,7) | Não | Coordenada usada para centralizar o mapa da unidade |
| `criado_em` | DATETIME | Sim | Data de cadastro da unidade no sistema |

#### Tabela `administrador`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | INT (PK) | Sim | Identificador único do administrador |
| `unidade_id` | INT (FK → unidade.id) | Sim | Unidade à qual o administrador pertence |
| `nome_usuario` | VARCHAR(80) | Sim | Login utilizado para acesso |
| `senha_hash` | VARCHAR(255) | Sim | Senha armazenada com hash (nunca em texto puro) |
| `perfil` | VARCHAR(20) | Sim | Nível de acesso (`admin`, `superadmin`) |
| `ativo` | BOOLEAN | Sim | Indica se a conta está habilitada |
| `criado_em` | DATETIME | Sim | Data de criação da conta |
| `ultimo_login` | DATETIME | Não | Data/hora do último acesso, para fins de auditoria |

> Na v1 (sem banco de dados), esta tabela é substituída por uma única conta de teste fixa, definida em `authentication.js`, exclusivamente para fins de avaliação acadêmica — ver [Acesso Administrativo](#acesso-administrativo-ambiente-de-avaliação).

#### Tabela `categoria_acessibilidade`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | INT (PK) | Sim | Identificador único da categoria |
| `nome` | VARCHAR(50) | Sim | Nome da categoria (ex: "Física", "Auditiva", "Visual") |
| `icone` | VARCHAR(50) | Não | Classe do ícone (Font Awesome) usada na interface |
| `cor_identificacao` | VARCHAR(7) | Não | Cor em hexadecimal usada para identificar a categoria visualmente |

> Modelar a categoria como tabela própria (em vez de um valor fixo no código) é o que permite, futuramente, adicionar novas categorias de acessibilidade sem alterar o front-end.

#### Tabela `ponto_acessibilidade`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | INT (PK) | Sim | Identificador único do ponto mapeado |
| `unidade_id` | INT (FK → unidade.id) | Sim | Unidade à qual o ponto pertence |
| `categoria_id` | INT (FK → categoria_acessibilidade.id) | Sim | Categoria de acessibilidade do ponto |
| `nome` | VARCHAR(150) | Sim | Nome do ponto (ex: "Rampa de acesso - Bloco A") |
| `descricao` | TEXT | Não | Descrição detalhada do ponto e suas condições |
| `latitude` | DECIMAL(10,7) | Sim | Coordenada geográfica do ponto |
| `longitude` | DECIMAL(10,7) | Sim | Coordenada geográfica do ponto |
| `status` | VARCHAR(20) | Sim | Situação do ponto (`ativo`, `em_manutencao`, `inativo`) |
| `criado_em` | DATETIME | Sim | Data de cadastro do ponto |
| `atualizado_em` | DATETIME | Não | Data da última atualização do ponto |

#### Tabela `colaboracao`

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | INT (PK) | Sim | Identificador único da colaboração/relato |
| `unidade_id` | INT (FK → unidade.id) | Sim | Unidade à qual o relato se refere |
| `categoria_id` | INT (FK → categoria_acessibilidade.id) | Sim | Categoria de acessibilidade relatada |
| `ponto_id` | INT (FK → ponto_acessibilidade.id) | Não | Ponto de acessibilidade relacionado, se já cadastrado |
| `local_texto` | VARCHAR(150) | Sim | Local informado livremente pelo usuário no formulário |
| `relato` | TEXT | Sim | Descrição do problema ou sugestão enviada |
| `status` | VARCHAR(20) | Sim | Situação do relato (`pendente`, `em_analise`, `resolvido`) |
| `ip_origem` | VARCHAR(45) | Não | Endereço IP de origem, para fins de moderação/antispam |
| `criado_em` | DATETIME | Sim | Data e hora do envio do relato |

> Na v1, esta tabela corresponde exatamente ao objeto salvo em `localStorage` sob a chave `accessmap_respostas`, com os campos `id`, `local`, `categoria`, `relato` e `data` — um subconjunto simplificado do modelo completo, já que não há ainda os conceitos de `unidade` (só existe um campus) nem de `ponto_acessibilidade` vinculado.

### Migração para Banco de Dados Real

Quando o projeto avançar para uma versão com back-end, a proposta é que a transição siga estes passos, sem quebrar a experiência já validada na v1:

1. Substituir as funções `lerRespostasForm()` / `salvarNovaResposta()` (em `script.js`) e `lerRespostas()` / `salvarRespostas()` (em `dashboard.js`) por chamadas `fetch` a uma API REST (`GET/POST/DELETE /colaboracoes`).
2. Substituir a autenticação fixa em `authentication.js` por uma rota de login real (`POST /auth/login`), retornando um token de sessão (JWT ou similar) em vez de uma flag no `sessionStorage`.
3. Introduzir a tabela `unidade`, permitindo que o mesmo sistema atenda a múltiplos locais públicos, cada um com seu próprio subdomínio ou identificador de unidade.
4. Popular a tabela `categoria_acessibilidade` com as categorias já usadas na v1 (física, auditiva) e abrir espaço para novas categorias (visual, cognitiva, etc.).
5. Migrar os registros já existentes no `localStorage` dos administradores (se necessário, via rotina de importação) para a nova tabela `colaboracao`.

## Fluxos do Sistema

### Fluxo do visitante (colaboração)

1. O visitante acessa `index.html` e preenche o formulário de colaboração na seção "Contato".
2. Seleciona a categoria de acessibilidade (física ou auditiva) e descreve o relato.
3. Ao enviar, o relato é validado e salvo no armazenamento local do navegador.
4. Uma mensagem de sucesso é exibida e o formulário é limpo, sem necessidade de recarregar a página.

### Fluxo do administrador

1. O administrador acessa `login.html` e informa usuário e senha da conta de teste.
2. Após autenticação, é redirecionado para `dashboard.html`.
3. O painel carrega automaticamente todas as colaborações já registradas, permitindo filtrar, ordenar e excluir relatos.
4. Tentativas de acessar `dashboard.html` diretamente, sem login prévio, são redirecionadas de volta para `login.html`.

## Acesso Administrativo (Ambiente de Avaliação)

Para fins de avaliação acadêmica da disciplina, foi disponibilizada uma conta de teste com perfil de administrador, criada exclusivamente para esse propósito — **não é uma credencial pessoal nem reutilizada em outros sistemas**:

```
Usuário: admin.teste
Senha:   Avaliacao@2025
```

Essa conta permite o acesso completo às telas e funcionalidades da área administrativa (backend visual do sistema), incluindo o dashboard de colaborações recebidas pelo formulário público.

> ⚠️ Esta autenticação é implementada inteiramente no front-end (JavaScript), como solução temporária enquanto não há back-end. Não deve ser considerada uma implementação segura para produção.

## Como Executar Localmente

Por não depender de back-end ou banco de dados, o projeto pode ser executado inteiramente no navegador:

1. Clone o repositório:
   ```bash
   git clone https://github.com/<usuario>/accessmap-ifsp.git
   cd accessmap-ifsp
   ```
2. Abra o arquivo `index.html` diretamente no navegador, ou sirva a pasta com um servidor local simples, por exemplo:
   ```bash
   npx serve .
   ```
3. Para acessar a área administrativa, use a [conta de teste](#acesso-administrativo-ambiente-de-avaliação) na tela de login.

## Acessibilidade

O AccessMap foi desenvolvido com preocupação constante em ser acessível enquanto ferramenta — e não apenas em seu conteúdo:

- Marcação semântica em HTML5, com uso de `aria-label`, `role` e `fieldset`/`legend` nos formulários.
- Widget nativo de controle de tamanho de fonte e alto contraste, disponível em todas as páginas.
- Integração com o **VLibras** para tradução de conteúdo em Libras.
- Navegação por teclado nos menus e controles interativos.

## Roadmap

- [ ] Implementação de back-end com API REST e banco de dados relacional, conforme modelo apresentado em [Modelo de Dados](#modelo-de-dados).
- [ ] Mapa interativo com marcadores reais por categoria de acessibilidade (`ponto_acessibilidade`).
- [ ] Autenticação administrativa real, com hash de senha e gerenciamento de sessão no servidor.
- [ ] Suporte a múltiplas unidades/instituições na mesma instância do sistema.
- [ ] Relatórios exportáveis (PDF/planilha) das colaborações recebidas, para uso em pedidos de verba e emendas parlamentares.
- [ ] Expansão das categorias de acessibilidade (visual, cognitiva, etc.).
- [ ] Sistema de status para colaborações (pendente, em análise, resolvido) com retorno visível à comunidade.

## Autoria e Desenvolvimento

Ambas as autoras são estudantes de Tecnologia em Sistemas para Internet no IFSP Campus Itapetininga:

- **Mariana Alice** — Proprietária inicial do projeto, responsável pela arquitetura de software, codificação completa da v1 (HTML, SCSS, JavaScript) e co-autora da prototipagem.
- **Yasmim Vitória** — Autora da etapa de prototipagem e design inicial do projeto.

## Licença

Este projeto está licenciado sob os termos da **Licença MIT**. Veja o arquivo [LICENSE](./LICENSE) para o texto completo.

Em resumo, a Licença MIT permite que qualquer pessoa utilize, copie, modifique e distribua este software — inclusive para fins comerciais — desde que o aviso de copyright original e a própria licença sejam mantidos, e sem que os autores assumam qualquer responsabilidade pelo uso do software.

---

**IFSP Campus Itapetininga**
Projeto de Extensão — 2026/2027