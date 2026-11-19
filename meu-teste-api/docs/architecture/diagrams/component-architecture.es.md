# Diagrama de Arquitectura de Componentes (Frontend)

```mermaid
graph TD
    subgraph Browser ["Navegador Web (SPA)"]
        Router["Vue Router (index.js)"]
        Guard["AuthGuard (Middleware / Componente)"]
        Views["Vistas (HomeView, AdminView, Unauthorized)"]
        Store["Vuex Store (Estado de Sesión)"]
        AxiosPlugin["Plugin Axios (Inyección de Token)"]
        KeycloakPlugin["Plugin Keycloak (SSO / Silent Check)"]
    end

    subgraph External ["Servicios Externos"]
        KeycloakServer["Keycloak SSO Unicamp"]
        LaravelAPI["Laravel API Backend"]
    end

    Router --> Guard
    Guard --> KeycloakPlugin
    Guard --> Store
    Views --> Store
    Views --> AxiosPlugin
    AxiosPlugin -->|Bearer JWT| LaravelAPI
    KeycloakPlugin -->|OIDC / Silent Refresh| KeycloakServer
```