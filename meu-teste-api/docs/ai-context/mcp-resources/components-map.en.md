# MCP Resource Mapping: Components, Views & Frontend Modules

## Main Views (`src/views/`)
- **`HomeView.vue`:** Home page and main application dashboard.
- **`AdminView.vue`:** Restricted administrative area protected by auth guard.
- **`Unauthorized.vue`:** Access denied view rendered when the user lacks required roles.

## Infrastructure Components (`src/components/`)
- **`AuthGuard.vue`:** Authentication and permission checking wrapper for components or pages.
- **`SessionExpiredOverlay.vue`:** Modal displayed when the Keycloak session expires or refresh token is invalidated.

## Services & Plugins (`src/plugins/` & `src/services/`)
- **`axios.js`:** Intercepts requests to attach JWT tokens and captures HTTP 401/403 status codes.
- **`keycloak.js`:** Manages Keycloak instance, login, logout, and token refresh.
- **`api.js`:** Centralizes REST API calls directed to the Laravel backend.