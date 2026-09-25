<template>
  <v-container class="fill-height text-center justify-center">
    <div>
      <v-icon size="80" color="error">mdi-lock-alert</v-icon>
      <h1 class="text-h4 font-weight-bold mt-4">Acesso Não Autorizado</h1>
      <p class="text-subtitle-1 grey--text text--darken-1 mt-2">
        Você não possui permissão para acessar esta página.
      </p>
      <v-btn color="primary" class="mt-4" to="/">
        Voltar para o Início
      </v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'UnauthorizedView'
}
</script>