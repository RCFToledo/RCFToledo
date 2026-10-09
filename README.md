# Vue.js Web - Skeleton Base Frontend (FE Unicamp)

Aplicação Single Page Application (SPA) desenvolvida em **Vue.js** e **Vuetify** para a Faculdade de Educação (FE/Unicamp). O projeto serve como repositório esqueleto padronizado no modelo **Docs-as-Code (FE/Unicamp)**, contando com autenticação SSO centralizada via **Keycloak (OIDC/PKCE)**, interceptação de tokens HTTP via **Axios**, controle de acesso em rotas (**Vue Router Guards**) e contexto otimizado para interação com **Agentes de IA**.

---

## 🛠️ Modos de Execução (Nativo ou Contêiner)

A aplicação foi projetada para ser flexível, podendo ser executada **nativamente com Node.js** ou **conteinerizada com Docker** (opcional).

### Opção A: Execução Nativa (Node.js/NPM) - Recomendado para Desenvolvimento

1. Entre no diretório do código-fonte:
   ```bash
   cd src
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento local:
   ```bash
   npm run serve
   ```
   Acesse a aplicação em `http://localhost:8080`.

4. Para gerar os arquivos estáticos de produção:
   ```bash
   npm run build
   ```
   Os arquivos compilados serão gerados na pasta `src/dist/` para publicação em servidor web (Apache, NGINX, IIS, etc.).

---

### Opção B: Execução via Docker / Contêineres (Opcional)

Caso prefira rodar a aplicação em ambiente isolado via Docker:

1. Na raiz do repositório (`laravel-api/` ou `vuejs-web/`), execute:
   ```bash
   docker compose up -d --build
   ```
2. A aplicação será disponibilizada em `http://localhost:8080` servida por uma imagem NGINX Alpine com o build estático.

---

## 📂 Estrutura do Repositório (FE Docs-as-Code)

```text
vuejs-web/
├── docs/                                 # BASE DE CONHECIMENTO DO SISTEMA
│   ├── architecture/                     # Arquitetura e Decisões
│   │   ├── c4-model.md                   # Modelo C4 (Contexto e Contêineres)
│   │   ├── diagrams/                     # Diagramas Mermaid do Frontend
│   │   └── adr/                          # Architecture Decision Records
│   ├── dependencies/                     # Matriz de Tecnologias e Dependências
│   │   └── tech-stack.md                 # Matriz tecnológica e versões
│   └── ai-context/                       # CONTEXTO EXCLUSIVO PARA AGENTES DE IA E MCP
│       ├── soul.md                       # Diretrizes de estilo, regras Vue e guardrails
│       ├── context.md                    # Resumo vivo do projeto para indexação
│       └── mcp-resources/                # Mapeamento de recursos para protocolo MCP
│           ├── components-map.md         # Mapeamento de Views e Componentes
│           └── store-and-api-map.md      # Mapeamento do Vuex e chamadas de API
│
├── src/                                  # CÓDIGO-FONTE DA APLICAÇÃO VUE.JS
│   ├── public/                           # Ativos públicos (index.html, logos FE, silent-check-sso)
│   ├── src/                              # Componentes, views, router, store, plugins
│   ├── .env.development                  # Configurações do ambiente de desenvolvimento
│   ├── .env.production                   # Configurações do ambiente de produção
│   ├── package.json                      # Dependências do ecossistema Node.js
│   └── vue.config.js                     # Configurações do Vue CLI / Webpack
│
├── .editorconfig                         # Padronização de formatação de código
├── .gitattributes                        # Tratamento de quebras de linha no Git
├── .gitignore                            # Ignorados globais do repositório
├── Dockerfile                            # Build multi-stage (Node -> Nginx) [Opcional]
├── docker-compose.yml                    # Orquestração do ambiente local [Opcional]
└── README.md                             # Documentação principal do repositório
```

---

## ⚙️ Variáveis de Ambiente (`src/.env.development`)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VUE_APP_API_BASE_URL` | URL base do backend em Laravel | `http://localhost:8000/api/v1` |
| `VUE_APP_KEYCLOAK_URL` | Endpoint do servidor Keycloak SSO | `https://sso.fe.unicamp.br/auth` |
| `VUE_APP_KEYCLOAK_REALM` | Realm corporativo do Keycloak | `FE-UNICAMP` |
| `VUE_APP_KEYCLOAK_CLIENT_ID` | Client ID registrado para o Frontend | `fe-web-app` |