# ADR 0001: Autenticación OIDC Client-Side mediante Keycloak-JS y Guards de Vue Router

- **Estado:** Aprobado
- **Fecha:** 2026-10-08

---

## 1. Contexto
La aplicación frontend de FE/Unicamp requiere autenticación mediante Single Sign-On (SSO) corporativo de Keycloak. El flujo de inicio de sesión debe ser transparente, admitir verificación silenciosa de sesión en segundo plano y proteger las rutas según los roles del usuario antes de renderizar la página.

---

## 2. Decisión
1. **Plugin Keycloak-JS (`src/plugins/keycloak.js`):** Inicialización de Keycloak con soporte para renovación silenciosa de tokens mediante la página pública `silent-check-sso.html`.
2. **Guards de Ruta (`src/middleware/AuthGuard.js` y `src/components/AuthGuard.vue`):** Intercepción de navegación en Vue Router para verificar autenticación y roles de usuario antes de permitir el acceso a Vistas restringidas.
3. **Inyección de Token en Axios (`src/plugins/axios.js`):** Interceptor HTTP que adjunta automáticamente la cabecera `Authorization: Bearer <token>` a todas las peticiones a la API backend y gestiona la expiración de tokens mediante un overlay (`SessionExpiredOverlay.vue`).

---

## 3. Consecuencias
- Experiencia fluida de Single Sign-On (SSO) integrada al ecosistema de la Unicamp.
- Bloqueo preventivo de pantallas no autorizadas antes de realizar llamadas a la API.
- Gestión centralizada de parámetros de entorno (`VUE_APP_KEYCLOAK_URL`, `VUE_APP_KEYCLOAK_REALM`, `VUE_APP_KEYCLOAK_CLIENT_ID`).