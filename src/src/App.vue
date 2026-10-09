<template>
  <div class="home-container">
    <v-overlay v-model="systemUnavailable" persistent class="align-center justify-center">
      <v-card max-width="520" class="text-center pa-8 rounded-xl" elevation="12">
        <v-icon size="72" color="warning" class="mb-4">mdi-server-network-off</v-icon>
        <v-card-title class="text-h5 font-weight-bold mb-2 justify-center">
          Sistema Temporariamente Indisponível
        </v-card-title>
        <v-card-text class="text-body-1 text-grey-darken-2">
          O sistema está em manutenção no momento.<br />
          Por favor, tente novamente mais tarde.<br />
          Em caso de dúvida, entre em contato com suporte<br />
          técnico através do email
          <a href="mailto:ticfe@unicamp.br">ticfe@unicamp.br</a>.
        </v-card-text>
      </v-card>
    </v-overlay>
  </div>
  <v-app>
    <!-- SESSION EXPIRED OVERLAY -->
    <SessionExpiredOverlay v-if="$route.meta.requiresAuth" />

    <!-- APP BAR -->
    <v-app-bar color="primary" app>
      <!-- Logos -->
      <a target="_blank" href="https://www.unicamp.br" style="text-decoration: none">
        <img src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo_unicamp.png"
             alt="Logo UNICAMP"
             style="height: 50px; margin-top: 9px; margin-left: 100px" />
      </a>

      <a target="_blank" href="https://www.fe.unicamp.br" style="text-decoration: none">
        <img src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo.png"
             alt="Faculdade de Educação"
             style="height: 50px; margin-top: 9px; margin-left: 20px" />
      </a>
      <v-spacer></v-spacer>

      <!-- Desktop -->
      <div v-if="$vuetify.display.mdAndUp" style="display: flex; align-items: center; margin-right: 40px;">
        <template v-if="isAuthenticated">
          <v-menu activator="parent" color="secondary" rounded>
            <template #activator="{ props }">
              <v-btn 
                v-bind="props" 
                variant="outlined" 
                rounded 
                color="white" 
                style="display: flex; align-items: center; text-transform: none; font-weight: 500; white-space: nowrap;"
              >
                <v-icon left style="color: white; margin-right: 4px;">mdi-account</v-icon>
                {{ user.given_name || userName }}
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar color="primary">
                    <span class="text-h5 text-white">{{ userInitials }}</span>
                  </v-avatar>
                  <h3>{{ (user.given_name || '') + ' ' + (user.family_name || '') }}</h3>
                  <p class="text-caption mt-1">{{ user.email }}</p>
                  <v-btn variant="text" rounded @click="logout">Sair da sessão</v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
        <template v-else>
          <v-btn 
            variant="outlined" 
            rounded 
            color="white" 
            style="display: flex; align-items: center; text-transform: none; font-weight: 500;"
            @click="login"
          >
            <v-icon left style="color: white; margin-right: 4px;">mdi-account</v-icon>
            Login
          </v-btn>
        </template>
      </div>

      <!-- Mobile -->
      <div v-else style="margin-right: 10px;">
        <v-menu color="secondary" rounded offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon>
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div v-if="isAuthenticated" class="text-center">
                <v-avatar color="primary" class="mb-2">
                  <span class="text-h5 text-white">{{ userInitials }}</span>
                </v-avatar>
                <h3>{{ (user.given_name || '') + ' ' + (user.family_name || '') }}</h3>
                <p class="text-caption mt-1">{{ user.email }}</p>
                <v-btn variant="text" rounded block @click="logout">Sair da sessão</v-btn>
              </div>
              <div v-else class="text-center">
                <v-btn variant="text" rounded block @click="login">Login</v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- FOOTER -->
    <v-footer dense color="primary" app>
      <p class="text-center w-100 ma-0 text-white">
        © {{ new Date().getFullYear() }} - Faculdade de Educação - UNICAMP - todos os direitos reservados
      </p>
    </v-footer>

    <!-- MAIN -->
    <v-main class="custom-main">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
//import { apiPublic } from './plugins/axios';
import axios from './plugins/axios';
import keycloak from './plugins/keycloak';
import SessionExpiredOverlay from './components/SessionExpiredOverlay.vue';

export default {
  name: 'App',
  components: { SessionExpiredOverlay },
  data() {
    return {
      systemUnavailable: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUserData || {};
    },
    userName() {
      return this.user.given_name || this.user.name || 'Luiz';
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    userInitials() {
      if (!this.user) return 'L';
      const first = this.user.given_name ? this.user.given_name[0] : 'L';
      const last = this.user.family_name ? this.user.family_name[0] : '';
      return (first + last).toUpperCase();
    },
  },
  async created() {
    await this.checkServerAvailable();
  },
  methods: {
    async checkServerAvailable() {
      try {
        const response = await axios.get(`${this.$BACKPATH}/health`, { skipAuth: true, timeout: 3000 });
        if (response.data?.data?.status !== "ok") {
          this.systemUnavailable = true;
        }
      } catch (error) {
        // Ignora erro em dev local se a API estiver desligada
      }
    },
    login() {
      keycloak.login({ redirectUri: `${this.$FRONTPATH}` });
    },
    logout() {
      keycloak.logout({ redirectUri: window.location.origin + '/' });
      this.$store.commit('setIsAuthenticated', false);
      this.$store.commit('setUserData', { given_name: '', family_name: '', email: '', kc_uuid: '' });
      this.$store.commit('setToken', '');
    },
  },
};
</script>

<style>
.custom-main {
  background-color: #f5f5f5;
}
</style>