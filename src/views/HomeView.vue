<template>
  <div>
    <div v-if="!isAuthenticated">
      <h1>Sistema BAPEX</h1>
      <p>Você não está autenticado!</p>
      <button @click="login">Entrar</button>
    </div>
    <div v-else>
      <h1>Sistema BAPEX</h1>
      <p>Você está autenticado!</p>
      <button @click="confirmLogout">Sair</button>
      <div>
        <h2>Dados do Usuário</h2>
        <p>Nome: {{ userData.given_name + ' ' + userData.family_name }}</p>
        <p>Email: {{ userData.email }}</p>
        <!-- Adicione outros campos conforme necessário -->
      </div>
      <div>
        <h2>Token de Acesso</h2>
        <pre>{{ accessToken }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import keycloak from '../plugins/keycloak';
export default {
  name: "HomeView",
  data() {
    return {
      isAuthenticated: false,
      userData: {},
      accessToken: "", // Adicione esta variável para armazenar o token de acesso
    };
  },
  methods: {
    login() {
      keycloak
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          if (authenticated) {
            this.isAuthenticated = true;
            console.log("Autenticado com sucesso!");
            // Acesse os dados do usuário
            this.userData = keycloak.idTokenParsed;
            // Acesse o token de acesso
            this.accessToken = keycloak.token;
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
      this.isAuthenticated = false;
      // Limpe os dados do usuário e o token ao fazer logout
      this.userData = {};
      this.accessToken = "";
      console.log("Logout realizado.");
    },
  },
  created() {
    if (keycloak.authenticated) {
      this.isAuthenticated = true;
      this.userData = keycloak.idTokenParsed;
      this.accessToken = keycloak.token;
    } else {
      this.login();
    }

    keycloak.onAuthLogout = () => {
      console.log("Evento de logout do Keycloak acionado.");
    };
  },
};
</script>
