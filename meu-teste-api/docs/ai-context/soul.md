# Soul & Guardrails do Desenvolvedor (Frontend FE Unicamp)

Este documento define as diretrizes de desenvolvimento, regras de estilo e guardrails que devem ser seguidos por desenvolvedores e **Agentes de IA** ao modificar este código.

---

## 1. Diretrizes de Código Vue.js
- **Nomenclatura de Componentes:** Utilize **PascalCase** para componentes e views (ex: `AuthGuard.vue`, `SessionExpiredOverlay.vue`).
- **Atalhos de Importação:** Sempre utilize o alias `@/` para referenciar o diretório `src/src/` (ex: `import api from '@/services/api'`).
- **Single File Components (SFC):** Mantenha a estrutura padrão `<template>`, `<script>` e `<style scoped>`.

---

## 2. Autenticação e Segurança
- **Nunca Burlar a Checagem de Token:** Todas as requisições autenticadas devem ser disparadas através da instância de Axios configurada em `src/plugins/axios.js` ou `src/services/api.js`.
- **Proteção de Rotas:** Páginas que exigem autenticação ou roles específicas devem ser registradas no Vue Router em `src/router/index.js` utilizando a meta-tag `meta: { requiresAuth: true, role: '...' }`.
- **Tratamento de Token Expirado:** A renovação do token deve ocorrer em background via `silent-check-sso.html`. Se a renovação falhar, o estado da sessão deve ser limpo no Vuex e a overlay `SessionExpiredOverlay.vue` deve ser acionada.

---

## 3. Padrão Visual e Identidade da FE Unicamp
- **Componentes UI:** Utilize prioritariamente componentes nativos do **Vuetify** (`v-container`, `v-card`, `v-btn`, `v-data-table`).
- **Branding:** Respeite a paleta de cores corporativa da Faculdade de Educação da Unicamp.
- **Logotipos:** As marcas oficiais estão localizadas em `src/public/logo_fe.png` e `src/public/logo_unicamp.png`.