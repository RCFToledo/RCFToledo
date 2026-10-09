# Matriz Tecnológica e Dependências - Frontend

## 1. Ambiente e Runtime
- **Node.js:** `>= 18.x` ou `>= 20.x LTS` (Recomendado)
- **NPM:** `>= 9.x`
- **Ambiente de Hospedagem:**
  - **Nativo (Sem Contêiner):** Servidor HTTP (Apache com mod_rewrite, NGINX ou IIS) servindo os arquivos compilados da pasta `src/dist/`.
  - **Contêiner (Opcional):** Imagem NGINX Alpine alimentada pelo estágio de build do Dockerfile.

---

## 2. Framework e Ecossistema Core
- **Framework Base:** Vue.js `2.x` (com suporte à transição para Vue 3)
- **UI Framework:** Vuetify `2.x` (Material Design)
- **Gerenciador de Estado:** Vuex `3.x`
- **Roteamento:** Vue Router `3.x`
- **Cliente HTTP:** Axios `1.x`
- **Cliente de Identidade / SSO:** Keycloak-JS `22.x+` (OpenID Connect / OAuth2)

---

## 3. Bibliotecas Auxiliares e UI
- **Fontes e Ícones:** Webfontloader, Material Design Icons (`@mdi/font`)
- **Notificações:** Vue Toastification
- **Utilitários CSS:** VSwitch e temas customizados em `src/plugins/`

---

## 4. Ferramentas de Build e Qualidade
- **Build Tool:** Vue CLI / Webpack
- **Compilador JavaScript:** Babel (`@vue/cli-plugin-babel`)
- **Configuração de Resolução de Atalhos:** `jsconfig.json` (Suporte ao alias `@/`)