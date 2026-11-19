# ADR 0001: Autenticação OIDC Client-Side via Keycloak-JS e Guards do Vue Router

- **Status:** Aprovado
- **Data:** 2026-10-08

---

## 1. Contexto
A aplicação frontend da FE/Unicamp requer autenticação via Single Sign-On (SSO) corporativo do Keycloak. O fluxo de login deve ser transparente, suportar verificação silenciosa de sessão em background e proteger rotas com base no perfil do usuário antes da renderização da página.

---

## 2. Decisão
1. **Plugin Keycloak-JS (`src/plugins/keycloak.js`):** Inicialização do Keycloak com suporte a renovação de token silenciosa através da página pública `silent-check-sso.html`.
2. **Guards de Rota (`src/middleware/AuthGuard.js` & `src/components/AuthGuard.vue`):** Interceptação de navegação no Vue Router para verificar a autenticação e perfis (roles) do usuário antes de permitir acesso às Views restritas.
3. **Injeção de Token no Axios (`src/plugins/axios.js`):** Interceptor HTTP que anexa automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as requisições enviadas à API backend e trata expirações de token via overlay (`SessionExpiredOverlay.vue`).

---

## 3. Consequências
- Experiência fluida de Single Sign-On (SSO) integrada ao ecossistema Unicamp.
- Bloqueio preventivo de telas não autorizadas antes da chamada à API.
- Gestão centralizada de parâmetros de ambiente (`VUE_APP_KEYCLOAK_URL`, `VUE_APP_KEYCLOAK_REALM`, `VUE_APP_KEYCLOAK_CLIENT_ID`).