# Matriz Tecnológica y Dependencias - Frontend

## 1. Entorno y Runtime
- **Node.js:** `>= 18.x` o `>= 20.x LTS` (Recomendado)
- **NPM:** `>= 9.x`
- **Entorno de Alojamiento:**
  - **Nativo (Sin Contenedor):** Servidor HTTP (Apache con mod_rewrite, NGINX o IIS) sirviendo archivos estáticos compilados desde `src/dist/`.
  - **Contenedorizado (Opcional):** Imagen NGINX Alpine alimentada por la etapa de compilación del Dockerfile.

---

## 2. Framework y Ecosistema Core
- **Framework Base:** Vue.js `2.x` (con soporte para migración a Vue 3)
- **UI Framework:** Vuetify `2.x` (Material Design)
- **Gestión de Estado:** Vuex `3.x`
- **Enrutamiento:** Vue Router `3.x`
- **Cliente HTTP:** Axios `1.x`
- **Cliente de Identidad / SSO:** Keycloak-JS `22.x+` (OpenID Connect / OAuth2)

---

## 3. Bibliotecas Auxiliares y UI
- **Fuentes e Iconos:** Webfontloader, Material Design Icons (`@mdi/font`)
- **Notificaciones:** Vue Toastification
- **Utilidades CSS:** VSwitch y temas personalizados en `src/plugins/`

---

## 4. Herramientas de Build y Calidad
- **Herramienta de Compilación:** Vue CLI / Webpack
- **Compilador JavaScript:** Babel (`@vue/cli-plugin-babel`)
- **Resolución de Alias de Ruta:** `jsconfig.json` (Soporte para alias `@/`)