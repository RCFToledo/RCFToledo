# MCP Resource Mapping: Vuex Store & API Client

## 1. Vuex Store Mapping (`src/store/index.js`)

The global application state manages user session and UI global states:

| Module / Attribute | Type | Description |
| :--- | :--- | :--- |
| `state.user` | `Object` | Authenticated user profile extracted from Keycloak JWT token. |
| `state.token` | `String` | Active JWT token received from Keycloak. |
| `state.isAuthenticated`| `Boolean` | Flag indicating whether the user has a valid active session. |
| `state.isSessionExpired`| `Boolean` | Flag triggered when Keycloak refresh token is invalidated. |

### Main Mutations
- `SET_USER`: Updates authenticated user data.
- `SET_TOKEN`: Stores the JWT token.
- `CLEAR_AUTH`: Clears user data, token, and resets session.
- `SET_SESSION_EXPIRED`: Activates session expiration overlay.

---

## 2. HTTP Client Mapping (`src/plugins/axios.js` & `src/services/api.js`)

Integration with the Laravel backend uses a centralized Axios instance:

- **Base URL:** Dynamically configured via `process.env.VUE_APP_API_BASE_URL`.
- **Request Interceptor:** Retrieves active Keycloak token and attaches header:
  `Authorization: Bearer <JWT_TOKEN>`
- **Response Interceptor:** Handles HTTP status codes returned by the Laravel API:
  - `HTTP 401 (Unauthorized):` Triggers token refresh via Keycloak or clears local session.
  - `HTTP 403 (Forbidden):` Redirects user to `/unauthorized`.
  - `HTTP 422 (Unprocessable Entity):` Returns field validation errors for Vuetify form display.