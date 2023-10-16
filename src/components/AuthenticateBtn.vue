<template>
  <v-container fluid v-if="showCard" class="authenticated-info">
    <v-card elevation="3">
      <v-card-title class="headline">
        <v-icon left>mdi-lock</v-icon>
      </v-card-title>
      <v-card-text>
        <p>Essas são informações restritas do módulo {{ moduleName }}.</p>
        <p>Por favor, faça login para acessar este módulo.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="authenticate">Entrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
  <v-btn v-if="!showCard" @click="authenticate"> Entrar </v-btn>
</template>

<script>
//import keycloak from "../../keycloak";
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'fe',
  url: 'http://localhost:8080/',
  clientId: 'myclient',
};

const keycloak = new Keycloak(keycloakConfig); 

export default {
  props: {
    moduleName: {
      type: String,
      required: false,
    },
    showCard: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    authenticate() {
      console.log('entrou');
      if (!keycloak.authenticated) {
        keycloak
          .init({ onLoad: "login-required" })
          .then((authenticated) => {
            if (authenticated) {
              console.log(authenticated);
              const userData = keycloak.idTokenParsed;
              console.log(userData);
              console.log("ok------------------------------------------------------------------");
              //window.location.href = "URL_do_seu_endpoint_de_login";
            }
          })
          .catch((error) => {
            console.error("Erro na inicialização do Keycloak:", error);
          });
      } else {
        console.log('-----------------');
        // O Keycloak já está autenticado, coloque aqui o código apropriado
      }
      console.log('saiu');
    },
  },
};
</script>

<style scoped>
.authenticated-info {
  width: 100%;
  display: block;
  justify-content: center;
  align-items: center;
}
</style>
