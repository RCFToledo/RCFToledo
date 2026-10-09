# Soul & Guardrails del Desarrollador (Frontend FE Unicamp)

Este documento define las directrices de desarrollo, reglas de estilo y guardrails que deben seguir los desarrolladores y los **Agentes de IA** al modificar este código fuente.

---

## 1. Directrices de Código Vue.js
- **Nomenclatura de Componentes:** Utilice **PascalCase** para componentes y vistas (ej: `AuthGuard.vue`, `SessionExpiredOverlay.vue`).
- **Alias de Importación:** Utilice siempre el alias `@/` para hacer referencia a `src/src/` (ej: `import api from '@/services/api'`).
- **Single File Components (SFC):** Mantenga la estructura estándar `<template>`, `<script>` y `<style scoped>`.

---

## 2. Autenticación y Seguridad
- **Nunca Omitir la Verificación de Token:** Todas las peticiones autenticadas deben realizarse mediante la instancia de Axios configurada en `src/plugins/axios.js` o `src/services/api.js`.
- **Protección de Rutas:** Las páginas que requieran autenticación o roles específicos deben registrarse en Vue Router en `src/router/index.js` utilizando la etiqueta meta `meta: { requiresAuth: true, role: '...' }`.
- **Manejo de Expiración de Token:** La renovación de token debe ocurrir en segundo plano a través de `silent-check-sso.html`. Si la renovación falla, se debe limpiar el estado de sesión en Vuex y activar la superposición `SessionExpiredOverlay.vue`.

---

## 3. Identidad Visual y Branding FE Unicamp
- **Componentes UI:** Utilice prioritariamente componentes nativos de **Vuetify** (`v-container`, `v-card`, `v-btn`, `v-data-table`).
- **Branding:** Respete la paleta de colores corporativa de la Facultad de Educación de la Unicamp.
- **Logotipos:** Los logotipos oficiales se encuentran en `src/public/logo_fe.png` y `src/public/logo_unicamp.png`.