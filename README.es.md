# Vue.js Web - Esqueleto Base Frontend (FE Unicamp)

Aplicación Single Page Application (SPA) desarrollada en **Vue.js** y **Vuetify** para la Facultad de Educación (FE/Unicamp). El proyecto sirve como repositorio esqueleto estandarizado bajo la metodología **Docs-as-Code (FE/Unicamp)**, contando con autenticación SSO centralizada mediante **Keycloak (OIDC/PKCE)**, intercepción de tokens HTTP mediante **Axios**, control de acceso en rutas (**Vue Router Guards**) y contexto optimizado para la interacción con **Agentes de IA**.

---

## 🛠️ Modos de Ejecución (Nativo o Contenedor)

La aplicación fue diseñada para ser flexible, pudiendo ejecutarse **nativamente con Node.js** o **contenedorizada con Docker** (opcional).

### Opción A: Ejecución Nativa (Node.js/NPM) - Recomendado para Desarrollo

1. Ingrese al directorio del código fuente:
   ```bash
   cd src
   ```

2. Instale las dependencias:
   ```bash
   npm install
   ```

3. Inicie el servidor de desarrollo local:
   ```bash
   npm run serve
   ```
   Acceda a la aplicación en `http://localhost:8080`.

4. Para generar los archivos estáticos de producción:
   ```bash
   npm run build
   ```
   Los archivos compilados se generarán en la carpeta `src/dist/` para su publicación en un servidor web (Apache, NGINX, IIS, etc.).

---

### Opción B: Ejecución mediante Docker / Contenedores (Opcional)

Si prefiere ejecutar la aplicación en un entorno aislado con Docker:

1. En la raíz del repositorio, ejecute:
   ```bash
   docker compose up -d --build
   ```
2. La aplicación estará disponible en `http://localhost:8080` servida por un contenedor NGINX Alpine con la compilación estática.

---

## 📂 Estructura del Repositorio (FE Docs-as-Code)

```text
vuejs-web/
├── docs/                                 # BASE DE CONOCIMIENTO DEL SISTEMA
│   ├── architecture/                     # Arquitectura y Decisiones
│   │   ├── c4-model.md                   # Modelo C4 (Contexto y Contenedores)
│   │   ├── diagrams/                     # Diagramas Mermaid del Frontend
│   │   └── adr/                          # Architecture Decision Records
│   ├── dependencies/                     # Matriz de Tecnologías y Dependencias
│   │   └── tech-stack.md                 # Matriz tecnológica y versiones
│   └── ai-context/                       # CONTEXTO EXCLUSIVO PARA AGENTES DE IA Y MCP
│       ├── soul.md                       # Guías de estilo, reglas Vue y guardrails
│       ├── context.md                    # Resumen vivo del proyecto
│       └── mcp-resources/                # Mapeo de recursos para protocolo MCP
│           ├── components-map.md         # Mapeo de Vistas y Componentes
│           └── store-and-api-map.md      # Mapeo del Vuex Store y llamadas a la API
│
├── src/                                  # CÓDIGO FUENTE DE LA APLICACIÓN VUE.JS
│   ├── public/                           # Activos públicos (index.html, logos FE, silent-check-sso)
│   ├── src/                              # Componentes, vistas, router, store, plugins
│   ├── .env.development                  # Variables de entorno de desarrollo
│   ├── .env.production                   # Variables de entorno de producción
│   ├── package.json                      # Dependencias del ecosistema Node.js
│   └── vue.config.js                     # Configuración de Vue CLI / Webpack
│
├── .editorconfig                         # Estandarización de formato de código
├── .gitattributes                        # Manejo de saltos de línea en Git
├── .gitignore                            # Reglas globales de ignorados de Git
├── Dockerfile                            # Build multi-stage (Node -> Nginx) [Opcional]
├── docker-compose.yml                    # Orquestación del entorno local [Opcional]
└── README.md                             # Documentación principal del repositorio
```

---

## ⚙️ Variables de Entorno (`src/.env.development`)

| Variable | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `VUE_APP_API_BASE_URL` | URL base de la API Backend en Laravel | `http://localhost:8000/api/v1` |
| `VUE_APP_KEYCLOAK_URL` | Endpoint del servidor Keycloak SSO | `https://sso.fe.unicamp.br/auth` |
| `VUE_APP_KEYCLOAK_REALM` | Realm corporativo de Keycloak | `FE-UNICAMP` |
| `VUE_APP_KEYCLOAK_CLIENT_ID` | Client ID registrado para el Frontend | `fe-web-app` |