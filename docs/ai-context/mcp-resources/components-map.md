# Mapeamento MCP: Componentes, Views e Módulos do Frontend

## Views Principais (`src/views/`)
- **`HomeView.vue`:** Página inicial e painel principal do sistema.
- **`AdminView.vue`:** Área administrativa protegida por guard de autenticação.
- **`Unauthorized.vue`:** Tela de acesso negado exibida quando o usuário não possui a role necessária.

## Componentes de Infraestrutura (`src/components/`)
- **`AuthGuard.vue`:** Envoltório de verificação de permissão e autenticação para blocos ou páginas.
- **`SessionExpiredOverlay.vue`:** Modal exibido quando a sessão do Keycloak expira ou o refresh token é invalidado.

## Serviços e Plugins (`src/plugins/` & `src/services/`)
- **`axios.js`:** Intercepta requisições anexando o token JWT e captura respostas HTTP 401/403.
- **`keycloak.js`:** Gerencia a instância do Keycloak, login, logout e refresh token.
- **`api.js`:** Centraliza as chamadas de API direcionadas ao backend em Laravel.