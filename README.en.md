# Vue.js Web - Skeleton Base Frontend (FE Unicamp)

Single Page Application (SPA) developed in **Vue.js** and **Vuetify** for the School of Education (FE/Unicamp). This project serves as a standardized skeleton repository adhering to the **Docs-as-Code (FE/Unicamp)** methodology, featuring centralized SSO authentication via **Keycloak (OIDC/PKCE)**, HTTP token interception via **Axios**, route access control (**Vue Router Guards**), and an optimized context for **AI Agent** interaction.

---

## 🛠️ Execution Modes (Native or Containerized)

The application is designed to be flexible and can run **natively with Node.js** or **containerized with Docker** (optional).

### Option A: Native Execution (Node.js/NPM) - Recommended for Development

1. Navigate to the source code directory:
   ```bash
   cd src
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run serve
   ```
   Access the application at `http://localhost:8080`.

4. Build static files for production:
   ```bash
   npm run build
   ```
   The compiled files will be generated in `src/dist/` for deployment to a web server (Apache, NGINX, IIS, etc.).

---

### Option B: Execution via Docker / Containers (Optional)

If you prefer running the application in an isolated Docker environment:

1. At the repository root, execute:
   ```bash
   docker compose up -d --build
   ```
2. The application will be available at `http://localhost:8080` served by an NGINX Alpine container with the static build.

---

## 📂 Repository Structure (FE Docs-as-Code)

```text
vuejs-web/
├── docs/                                 # SYSTEM KNOWLEDGE BASE
│   ├── architecture/                     # Architecture & Decisions
│   │   ├── c4-model.md                   # C4 Model (Context & Containers)
│   │   ├── diagrams/                     # Frontend Mermaid Diagrams
│   │   └── adr/                          # Architecture Decision Records
│   ├── dependencies/                     # Tech Matrix & Dependencies
│   │   └── tech-stack.md                 # Tech stack and versioning
│   └── ai-context/                       # EXCLUSIVE CONTEXT FOR AI AGENTS & MCP
│       ├── soul.md                       # Style guidelines, Vue rules & guardrails
│       ├── context.md                    # Living project summary
│       └── mcp-resources/                # Resource mapping for MCP protocol
│           ├── components-map.md         # Views and Components Mapping
│           └── store-and-api-map.md      # Vuex Store and API Calls Mapping
│
├── src/                                  # VUE.JS APPLICATION SOURCE CODE
│   ├── public/                           # Public assets (index.html, FE logos, silent-check-sso)
│   ├── src/                              # Components, views, router, store, plugins
│   ├── .env.development                  # Development environment variables
│   ├── .env.production                   # Production environment variables
│   ├── package.json                      # Node.js ecosystem dependencies
│   └── vue.config.js                     # Vue CLI / Webpack configuration
│
├── .editorconfig                         # Code formatting standardization
├── .gitattributes                        # Git line-ending handling
├── .gitignore                            # Global repository ignore rules
├── Dockerfile                            # Multi-stage build (Node -> Nginx) [Optional]
├── docker-compose.yml                    # Local environment orchestration [Optional]
└── README.md                             # Main repository documentation
```

---

## ⚙️ Environment Variables (`src/.env.development`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `VUE_APP_API_BASE_URL` | Base URL of the Laravel Backend API | `http://localhost:8000/api/v1` |
| `VUE_APP_KEYCLOAK_URL` | Keycloak SSO server endpoint | `https://sso.fe.unicamp.br/auth` |
| `VUE_APP_KEYCLOAK_REALM` | Corporate Keycloak Realm | `FE-UNICAMP` |
| `VUE_APP_KEYCLOAK_CLIENT_ID` | Registered Client ID for Frontend | `fe-web-app` |