# Resumen Vivo del Proyecto (Contexto para LLMs/MCP)

- **Nombre del Proyecto:** Esqueleto Frontend Vue.js - FE Unicamp
- **Unidad:** Facultad de Educación - FE / Unicamp
- **Equipo:** TIC-FE Unicamp
- **Tecnologías Core:** Vue.js, Vuetify, Vue Router, Vuex, Axios, Keycloak-JS
- **Estructura:** Modelo Docs-as-Code (Documentación en `docs/`, Código de Aplicación en `src/`)
- **Mapeo de Integraciones:**
  - `src/plugins/keycloak.js`: Conexión con Keycloak SSO.
  - `src/plugins/axios.js` y `src/services/api.js`: Cliente HTTP integrado con la API de Laravel.
  - `src/middleware/AuthGuard.js`: Protección de rutas y verificación de autorizaciones.
  - `src/store/index.js`: Estado global de la aplicación (datos de usuario autenticado, temas y notificaciones).