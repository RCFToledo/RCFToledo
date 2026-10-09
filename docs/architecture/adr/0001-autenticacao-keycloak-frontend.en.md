# ADR 0001: Client-Side OIDC Authentication via Keycloak-JS and Vue Router Guards

- **Status:** Approved
- **Date:** 2026-10-08

---

## 1. Context
The FE/Unicamp frontend application requires authentication via corporate Single Sign-On (SSO) through Keycloak. The login flow must be seamless, support background silent session checks, and protect routes based on user roles prior to page rendering.

---

## 2. Decision
1. **Keycloak-JS Plugin (`src/plugins/keycloak.js`):** Keycloak initialization with silent token refresh support via the public page `silent-check-sso.html`.
2. **Route Guards (`src/middleware/AuthGuard.js` & `src/components/AuthGuard.vue`):** Navigation interception in Vue Router to verify user authentication and roles before allowing access to restricted Views.
3. **Axios Token Injection (`src/plugins/axios.js`):** HTTP interceptor that automatically attaches the `Authorization: Bearer <token>` header to all outgoing requests to the backend API and handles token expiration via an overlay (`SessionExpiredOverlay.vue`).

---

## 3. Consequences
- Seamless Single Sign-On (SSO) experience integrated into the Unicamp ecosystem.
- Preventative blocking of unauthorized screens before triggering API calls.
- Centralized management of environment parameters (`VUE_APP_KEYCLOAK_URL`, `VUE_APP_KEYCLOAK_REALM`, `VUE_APP_KEYCLOAK_CLIENT_ID`).