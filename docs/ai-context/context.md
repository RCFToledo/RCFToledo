# Resumo Vivo do Projeto Frontend (Contexto para LLMs/MCP)

- **Nome do Projeto:** Esqueleto de Frontend Vue.js - FE Unicamp
- **Unidade:** Faculdade de Educação - FE / Unicamp
- **Equipe:** TIC-FE Unicamp
- **Tecnologias Core:** Vue.js, Vuetify, Vue Router, Vuex, Axios, Keycloak-JS
- **Estrutura:** Modelo Docs-as-Code (Documentação em `docs/`, Código da Aplicação em `src/`)
- **Mapeamento de Integrações:**
  - `src/plugins/keycloak.js`: Conexão com o Keycloak SSO.
  - `src/plugins/axios.js` & `src/services/api.js`: Cliente HTTP integrado à API Laravel.
  - `src/middleware/AuthGuard.js`: Proteção de rotas e verificação de autorização.
  - `src/store/index.js`: Estado global da aplicação (dados do usuário autenticado, temas e notificações).