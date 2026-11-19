# Mapeamento MCP: Vuex Store e Cliente de API

## 1. Mapeamento do Vuex Store (`src/store/index.js`)

O estado global da aplicação gerencia a sessão do usuário e os estados globais da interface:

| Módulo / Atributo | Tipo | Descrição |
| :--- | :--- | :--- |
| `state.user` | `Object` | Dados do perfil do usuário autenticado extraídos do token JWT do Keycloak. |
| `state.token` | `String` | Token JWT ativo recebido do Keycloak. |
| `state.isAuthenticated`| `Boolean` | Flag indicando se o usuário possui sessão válida e ativa. |
| `state.isSessionExpired`| `Boolean` | Flag ativada quando o refresh token do Keycloak é invalidado. |

### Mutations Principais
- `SET_USER`: Atualiza os dados do usuário autenticado.
- `SET_TOKEN`: Armazena o token JWT.
- `CLEAR_AUTH`: Limpa os dados do usuário, token e reinicia a sessão.
- `SET_SESSION_EXPIRED`: Ativa o overlay informando o término da sessão.

---

## 2. Mapeamento do Cliente HTTP (`src/plugins/axios.js` & `src/services/api.js`)

A integração com o backend em Laravel utiliza uma instância centralizada do Axios:

- **URL Base:** Configurada dinamicamente via `process.env.VUE_APP_API_BASE_URL`.
- **Request Interceptor:** Captura o token atual do Keycloak e anexa o cabeçalho:
  `Authorization: Bearer <JWT_TOKEN>`
- **Response Interceptor:** Trata os códigos de resposta HTTP retornados pela API Laravel:
  - `HTTP 401 (Unauthorized):` Aciona a renovação do token via Keycloak ou limpa a sessão local.
  - `HTTP 403 (Forbidden):` Redireciona o usuário para a view `/unauthorized`.
  - `HTTP 422 (Unprocessable Entity):` Retorna os erros de validação dos campos para exibição nos formulários Vuetify.