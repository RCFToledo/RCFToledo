# Mapeo MCP: Componentes, Vistas y Módulos del Frontend

## Vistas Principales (`src/views/`)
- **`HomeView.vue`:** Página de inicio y panel principal del sistema.
- **`AdminView.vue`:** Área administrativa protegida por guard de autenticación.
- **`Unauthorized.vue`:** Vista de acceso denegado mostrada cuando el usuario no posee el rol requerido.

## Componentes de Infraestructura (`src/components/`)
- **`AuthGuard.vue`:** Envoltorio de verificación de permisos y autenticación para bloques o páginas.
- **`SessionExpiredOverlay.vue`:** Modal mostrado cuando expira la sesión de Keycloak o el refresh token es invalidado.

## Servicios y Plugins (`src/plugins/` y `src/services/`)
- **`axios.js`:** Intercepta peticiones adjuntando el token JWT y captura respuestas HTTP 401/403.
- **`keycloak.js`:** Gestiona la instancia de Keycloak, inicio/cierre de sesión y renovación de token.
- **`api.js`:** Centraliza las llamadas a la API RESTful hacia el backend en Laravel.