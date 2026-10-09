<template>
  <v-overlay
    v-model="showOverlay"
    class="d-flex align-center justify-center"
    opacity="0.6"
  >
    <v-card class="pa-6" max-width="450" outlined elevation="12">
      <v-card-title class="text-h6">Sessão Expirada</v-card-title>
      <v-card-text>
        <p>
          Sua sessão expirou. Para continuar preenchendo o formulário, você precisa revalidar a sessão.
        </p>
        <!-- 
        <p class="text-caption grey--text">
          <strong>Atenção:</strong> se você recarregar ou fechar a página, poderá perder os dados preenchidos.
        </p>
        -->
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" @click="revalidateSession">Revalidar Sessão</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>

<script>
import keycloak from '@/plugins/keycloak'

export default {
  name: 'SessionExpiredOverlay',
  data() {
    return {
      showOverlay: false
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      if (keycloak.authenticated && keycloak.isTokenExpired()) {
        this.showOverlay = true
        clearInterval(this.interval)
      }
    }, 2000);
  },
  beforeUnmount() {
    clearInterval(this.interval)
  },
  methods: {
    checkSession() {
    },
    revalidateSession() {
      // Redireciona para login e mantém a página atual
      keycloak.login({ redirectUri: window.location.href })
    }
  }
}
</script>

<style scoped>
/* Deixa o overlay mais "modal" e centralizado */
.v-overlay__content {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
</style>
