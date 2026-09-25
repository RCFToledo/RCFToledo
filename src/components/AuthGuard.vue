<template>
  <div>
    <!-- Sessão expirada -->
    <v-alert
      v-if="sessionExpired"
      type="error"
      class="mb-6"
      border="left"
      colored-border
      elevation="2"
    >
      Sua sessão expirou. Faça login novamente.
      <v-btn color="primary" class="ml-4" @click="redirectToLogin">Ir para login</v-btn>
    </v-alert>

    <!-- Conteúdo protegido -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import keycloak from '@/plugins/keycloak';

export default {
  name: 'AuthGuard',
  data() {
    return {
      sessionExpired: false,
    };
  },
  mounted() {
    this.checkSession();
  },
  methods: {
    checkSession() {
      /*
      if (!keycloak.authenticated || keycloak.isTokenExpired()) {
        this.sessionExpired = true;
      }
      */
    },
    redirectToLogin() {
      keycloak.login({ redirectUri: window.location.href });
    },
  },
};
</script>

<style scoped>
</style>
