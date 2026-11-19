# Developer Soul & Guardrails (Frontend FE Unicamp)

This document defines development guidelines, style rules, and guardrails to be followed by developers and **AI Agents** when modifying this codebase.

---

## 1. Vue.js Coding Guidelines
- **Component Naming:** Use **PascalCase** for components and views (e.g., `AuthGuard.vue`, `SessionExpiredOverlay.vue`).
- **Import Path Aliases:** Always use the `@/` alias to reference `src/src/` (e.g., `import api from '@/services/api'`).
- **Single File Components (SFC):** Maintain the standard structure: `<template>`, `<script>`, and `<style scoped>`.

---

## 2. Authentication & Security
- **Never Bypass Token Verification:** All authenticated requests must be triggered through the configured Axios instance in `src/plugins/axios.js` or `src/services/api.js`.
- **Route Protection:** Pages requiring authentication or specific roles must be registered in Vue Router at `src/router/index.js` using meta tags `meta: { requiresAuth: true, role: '...' }`.
- **Token Expiration Handling:** Token refresh must happen in the background via `silent-check-sso.html`. If refresh fails, session state must be cleared in Vuex and the `SessionExpiredOverlay.vue` overlay must be displayed.

---

## 3. FE Unicamp Visual Guidelines & Branding
- **UI Components:** Primarily use native **Vuetify** components (`v-container`, `v-card`, `v-btn`, `v-data-table`).
- **Branding:** Respect the corporate color palette of FE/Unicamp.
- **Logos:** Official logos are located in `src/public/logo_fe.png` and `src/public/logo_unicamp.png`.