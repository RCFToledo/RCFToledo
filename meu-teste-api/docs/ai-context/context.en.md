# Living Project Summary (Context for LLMs/MCP)

- **Project Name:** Vue.js Frontend Skeleton - FE Unicamp
- **Department:** School of Education - FE / Unicamp
- **Team:** TIC-FE Unicamp
- **Core Stack:** Vue.js, Vuetify, Vue Router, Vuex, Axios, Keycloak-JS
- **Structure:** Docs-as-Code Model (Documentation in `docs/`, App Code in `src/`)
- **Integration Map:**
  - `src/plugins/keycloak.js`: Keycloak SSO Integration.
  - `src/plugins/axios.js` & `src/services/api.js`: HTTP client integrated with Laravel API.
  - `src/middleware/AuthGuard.js`: Route protection and access control check.
  - `src/store/index.js`: Global application state (authenticated user data, themes, and notifications).