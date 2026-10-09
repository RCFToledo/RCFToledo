# Mapeo MCP: Vuex Store y Cliente de API

## 1. Mapeo del Vuex Store (`src/store/index.js`)

El estado global de la aplicación gestiona la sesión del usuario y los estados globales de la interfaz:

| Módulo / Atributo | Tipo | Descripción |
| :--- | :--- | :--- |
| `state.user` | `Object` | Datos del perfil de usuario autenticado extraídos del token JWT de Keycloak. |
| `state.token` | `String` | Token JWT activo recibido de Keycloak. |
| `state.isAuthenticated`| `Boolean` | Indicador que señala si el usuario posee una sesión válida y activa. |
| `state.isSessionExpired`| `Boolean` | Indicador activado cuando el refresh token de Keycloak es invalidado. |

### Mutaciones Principales
- `SET_USER`: Actualiza los datos del usuario autenticado.
- `SET_TOKEN`: Almacena el token JWT.
- `CLEAR_AUTH`: Limpia datos de usuario, token y reinicia la sesión.
- `SET_SESSION_EXPIRED`: Activa la superposición indicando el fin de la sesión.

---

## 2. Mapeo del Cliente HTTP (`src/plugins/axios.js` y `src/services/api.js`)

La integración con el backend de Laravel utiliza una instancia centralizada de Axios:

- **URL Base:** Configurada dinámicamente mediante `process.env.VUE_APP_API_BASE_URL`.
- **Request Interceptor:** Captura el token activo de Keycloak y adjunta la cabecera:
  `Authorization: Bearer <JWT_TOKEN>`
- **Response Interceptor:** Maneja los códigos de respuesta HTTP retornados por la API de Laravel:
  - `HTTP 401 (Unauthorized):` Activa la renovación del token mediante Keycloak o limpia la sesión local.
  - `HTTP 403 (Forbidden):` Redirige al usuario a la vista `/unauthorized`.
  - `HTTP 422 (Unprocessable Entity):` Retorna errores de validación de campos para visualización en formularios Vuetify.