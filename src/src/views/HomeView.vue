<template>
  <v-app class="bg-grey-lighten-4">
    <!-- NAVIGATION DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="mdAndUp"
      :temporary="!mdAndUp"
      width="280"
      class="border-0 elevation-1"
    >
      <div class="d-flex flex-column h-100 bg-white">
        <!-- LOGO / BRANDING -->
        <div class="pa-6 border-b d-flex align-center ga-3">
          <v-avatar color="primary" rounded="lg" size="40" class="elevation-2">
            <v-icon icon="mdi-database-cog" size="24" color="white" />
          </v-avatar>
          <div>
            <div class="text-subtitle-1 font-weight-black text-primary leading-tight">
              VueJS-Web
            </div>
            <div class="text-caption text-medium-emphasis">
              Painel Administrativo
            </div>
          </div>
        </div>

        <!-- MENU DE NAVEGAÇÃO -->
        <div class="pa-3 flex-grow-1">
          <div class="px-3 py-2 text-overline text-medium-emphasis font-weight-bold">
            Módulos Principais
          </div>

          <v-list nav density="comfortable" class="pa-0">
            <v-list-item
              v-for="item in steps"
              :key="item.step"
              :value="item.step"
              :disabled="item.disabled"
              :class="['nav-item mb-1 rounded-lg', { 'nav-item-active': step === item.step }]"
              @click="selectStep(item.step)"
            >
              <template #prepend>
                <v-icon
                  :icon="item.icon"
                  :color="step === item.step ? 'primary' : 'grey-darken-1'"
                  class="mr-3"
                />
              </template>

              <v-list-item-title class="font-weight-medium">
                {{ item.label }}
              </v-list-item-title>

              <template v-if="step === item.step" #append>
                <v-badge dot color="primary" inline />
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- CONTEÚDO PRINCIPAL -->
    <v-main>
      <!-- BOTÃO MENU MOBILE -->
      <div v-if="!mdAndUp" class="pa-2 bg-white border-b d-flex align-center">
        <v-btn icon="mdi-menu" variant="text" @click="drawer = !drawer" />
        <span class="font-weight-bold ml-2">{{ currentStepLabel }}</span>
      </div>

      <v-container fluid class="pa-6 pt-0">
        <!-- VISÃO GERAL -->
        <div class="pa-6 pt-0">
          <!-- CARD BEM-VINDO -->
          <v-card
            class="mb-6 overflow-hidden rounded-xl border-0 shadow-lg elevation-2"
            color="primary"
            variant="flat"
          >
            <div class="pa-4 pa-md-5 position-relative bg-gradient-header">
              <v-row class="align-center" density="compact">
                <v-col cols="12">
                  <div class="d-flex align-center">
                    <v-avatar color="white" size="44" class="elevation-2 mr-3">
                      <v-icon size="24" color="primary">mdi-hand-wave-outline</v-icon>
                    </v-avatar>

                    <div>
                      <h1 class="text-h5 font-weight-black text-white tracking-wide mb-0 mt-0" style="line-height: 1.1;">
                        Bem-vindo(a), {{ userName }}!
                      </h1>
                      <p class="text-body-2 text-white-opacity-80 mb-0 mt-1 font-weight-regular">
                        Painel administrativo para gestão dos dados cadastrais do seu departamento.
                      </p>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </div>
      </v-container>
    </v-main>

    <!-- BOTÃO DE AJUDA FLUTUANTE -->
    <v-btn
      color="primary"
      prepend-icon="mdi-help-circle-outline"
      size="large"
      elevation="6"
      class="help-btn-floating text-none font-weight-bold rounded-pill"
      @click="showContacts = true"
    >
      Precisa de ajuda?
    </v-btn>

    <!-- MODAL DE SUPORTE -->
    <v-dialog v-model="showContacts" max-width="480">
      <v-card class="rounded-xl overflow-hidden elevation-8">
        <v-card-title class="pa-4 bg-primary text-white d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon icon="mdi-headset" class="mr-3" />
            <span class="text-h6 font-weight-bold">Suporte Técnico</span>
          </div>
          <v-btn icon="mdi-close" variant="text" color="white" size="small" @click="showContacts = false" />
        </v-card-title>

        <v-card-text class="pa-6">
          <p class="text-body-1 text-high-emphasis mb-4">
            Em caso de dúvidas ou inconsistências no sistema, entre em contato com nossa equipe:
          </p>

          <v-card variant="outlined" class="pa-4 rounded-lg bg-grey-lighten-5 border">
            <div class="d-flex align-center">
              <v-avatar color="blue-lighten-5" class="mr-3">
                <v-icon icon="mdi-email-outline" color="primary" />
              </v-avatar>
              <div>
                <div class="text-caption text-medium-emphasis font-weight-bold text-uppercase">
                  E-mail de Contato
                </div>
                <a
                  href="mailto:ticfe@unicamp.br"
                  class="text-body-1 font-weight-bold text-primary text-decoration-none"
                >
                  ticfe@unicamp.br
                </a>
              </div>
            </div>
          </v-card>
        </v-card-text>

        <v-card-actions class="pa-4 px-6 bg-grey-lighten-4 justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            class="text-none font-weight-bold px-6 rounded-lg"
            @click="showContacts = false"
          >
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      sessionExpired: false,
      mdAndUp: true,
      drawer: true,
      step: 1,
      steps: [
        { step: 1, label: 'Visão Geral', icon: 'mdi-view-dashboard-outline' },
      ],
      showContacts: false,
    };
  },

  computed: {
    user() {
      return this.$store.getters.getUserData || {};
    },
    currentStepLabel() {
      const cur = this.steps.find(s => s.step === this.step);
      return cur ? cur.label : '';
    },
    userName() {
      if (this.user.given_name && this.user.family_name) {
        return `${this.user.given_name} ${this.user.family_name}`;
      }
      return this.user.name || this.user.given_name || 'Usuário';
    }
  },

  methods: {
    selectStep(s) {
      const item = this.steps.find(i => i.step === s);
      if (!item || item.disabled) return;
      this.step = s;
      if (!this.mdAndUp) this.drawer = false;
    },
  },
};
</script>

<style scoped>
.text-white-opacity-80 {
  color: rgba(255, 255, 255, 0.85) !important;
}

.nav-item {
  transition: all 0.2s ease-in-out;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.04) !important;
}

.nav-item-active {
  background-color: #e3f2fd !important;
  color: #005691 !important;
  font-weight: 700 !important;
}

.help-btn-floating {
  position: fixed !important;
  bottom: 50px !important;
  right: 24px !important;
  z-index: 1000 !important;
  padding-left: 20px !important;
  padding-right: 20px !important;
}
</style>