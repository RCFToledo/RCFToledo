<template>
  <div>
    <div v-if="$store.getters.getIsAuthenticad">
      <h1>Sistema BAPEX</h1>
      <p>Você não está autenticado!</p>
      <button @click="login">Entrar</button>
    </div>
    <div v-else>
      <h1>Sistema BAPEX</h1>
      <p>Você está autenticado!</p>
      <button @click="confirmLogout">Sair</button>
      <h2>Dados do Usuário</h2>
      <div>
        <p>
          Nome:
          {{
            $store != null && $store.getters.getUserData != null
              ? $store.getters.getUserData.given_name +
              " " +
              $store.getters.getUserData.family_name
              : ""
          }}
        </p>
        <p>
          Email:
          {{
            $store != null && $store.getters.getUserData != null
              ? $store.getters.getUserData.email
              : ""
          }}
        </p>
        <!-- Adicione outros campos conforme necessário -->
      </div>
      <div>
        <h2>Token de Acesso</h2>
        <pre>{{ $store.getters.getToken }}</pre>
      </div>
      <p>
        {{ $store != null && $store.getters.getResourceAccess != null
        ? $store.getters.getResourceAccess : ""
        }}
      </p>
    </div>
  </div>
</template>

<script>
import keycloak from '../plugins/keycloak';
export default {
  name: "HomeView",
  methods: {
    login() {
      keycloak
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          if (authenticated) {
            this.$store.commit('setIsAuthenticated', true);
            console.log("Autenticado com sucesso!");
            // Acesse os dados do usuário
            this.$store.commit('setUserData', keycloak.idTokenParsed);
            // Acesse o token de acesso
            this.$store.commit('setToken', keycloak.token);
            this.$store.commit('setResourceAccess', keycloak.resourceAccess);
          } else {
            console.error("Falha na autenticação.");
          }
        })
        .catch((error) => {
          console.error("Erro na inicialização do Keycloak:", error);
        });
    },
    confirmLogout() {
      const confirmLogout = confirm("Tem certeza de que deseja sair?");
      if (confirmLogout) {
        this.logout();
      }
    },
    logout() {
      keycloak.logout();
      this.$store.commit('setIsAuthenticated', false);
      // Limpe os dados do usuário e o token ao fazer logout
      this.$store.commit('setUserData', {});
      this.$store.commit('setToken', "");
      console.log("Logout realizado.");
    },
  },
  created() {
    console.log(keycloak)
    if (keycloak.authenticated) {
      this.$store.commit('setIsAuthenticated', true);
      this.$store.commit('setUserData', keycloak.idTokenParsed);
      this.$store.commit('setToken', keycloak.token);
      this.$store.commit('setResourceAccess', keycloak.resourceAccess);
    } else {
      this.login();
    }
    keycloak.onAuthLogout = () => {
      console.log("Evento de logout do Keycloak acionado.");
    };
  },
};
</script>
