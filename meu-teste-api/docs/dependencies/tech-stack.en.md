# Technology Matrix & Dependencies - Frontend

## 1. Environment & Runtime
- **Node.js:** `>= 18.x` or `>= 20.x LTS` (Recommended)
- **NPM:** `>= 9.x`
- **Hosting Environment:**
  - **Native (No Container):** HTTP Server (Apache with mod_rewrite, NGINX, or IIS) serving compiled static files from `src/dist/`.
  - **Containerized (Optional):** NGINX Alpine image powered by Dockerfile build stage.

---

## 2. Core Framework & Ecosystem
- **Base Framework:** Vue.js `2.x` (with migration path to Vue 3)
- **UI Framework:** Vuetify `2.x` (Material Design)
- **State Management:** Vuex `3.x`
- **Routing:** Vue Router `3.x`
- **HTTP Client:** Axios `1.x`
- **Identity Client / SSO:** Keycloak-JS `22.x+` (OpenID Connect / OAuth2)

---

## 3. Auxiliary Libraries & UI
- **Fonts & Icons:** Webfontloader, Material Design Icons (`@mdi/font`)
- **Notifications:** Vue Toastification
- **CSS Utilities:** VSwitch and custom themes in `src/plugins/`

---

## 4. Build Tools & Quality
- **Build Tool:** Vue CLI / Webpack
- **JavaScript Compiler:** Babel (`@vue/cli-plugin-babel`)
- **Path Alias Resolution:** `jsconfig.json` (Support for `@/` alias)