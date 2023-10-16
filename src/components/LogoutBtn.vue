<template>
  <div>
    <v-btn prepend-icon="mdi-logout" @click="confirmLogout"> Sair </v-btn>
    <ConfirmSnackbar
      v-model="showConfirm"
      snackbarText="Deseja encerrar a sessão?"
      @confirm="logout"
      @cancel="!showConfirm"
    />
  </div>
</template>
  <script>
import ConfirmSnackbar from "./ConfirmSnackbar.vue";
export default {  
  components: {
    ConfirmSnackbar,
  },
  data() {
    return {
      showConfirm: false,
    };
  },
  computed: {    
    newToken: {
      get() {
        return this.$store.state.token;
      },
      set(value) {
        this.$store.commit("setToken", value);
      },
    },
  },
  methods: {
    confirmLogout() {
      this.showConfirm = true;
    },
    async logout() {
      try {
        // Realize a chamada API para encerrar a sessão no backend
        const response = await this.$axios.get("Logout/", {params: { token: this.$store.state.token}}); // Substitua pela URL correta              
        if (response.data[0].success) {
          // Sessão encerrada com sucesso
          window.location.href = "https://autenticacao.fe.unicamp.br/fe-sso/logout?client_id=cargadidatica";          
          this.newToken = null;
          this.$router.push("/"); // Substitua pela rota correta
        } else {
          // Algo deu errado no logout
         console.log('Algo deu errado no logout');
        }
      } catch (error) {
        // Erro na chamada API
        console.log('Erro ao se comunicar com o servidor');
        
      
      }
    },
  },
};
</script>
  