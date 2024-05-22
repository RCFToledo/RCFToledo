<template>
  <v-app>
    <!-- APP BAR -->
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon v-if="!$vuetify.display.smAndUp" @click="
        drawer = !drawer;
      rail = false;
      " style="margin-top: 40px"></v-app-bar-nav-icon>
      <a href="https://www.unicamp.br" style="text-decoration: none">
        <img src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo_unicamp.png" alt="Logo UNICAMP"
          style="height: 50px; margin-top: 15px; margin-left: 100px" />
      </a>
      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">
        <img src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo.png" alt="Faculdade de Educação"
          style="height: 50px; margin-top: 15px" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-avatar variant="plain" icon="mdi-account" style="margin-right: 10px; cursor: pointer"></v-avatar>
        <v-menu activator="parent" color="secondary" rounded>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="primary">
                  <span class="text-h5">{{ $store.getters.getUserData.given_name[0] + $store.getters.getUserData.family_name[0] }}</span>
                </v-avatar>
                <h3>{{ $store.getters.getUserData.given_name +' '+ $store.getters.getUserData.family_name }}</h3>
                <p class="text-caption mt-1">{{ $store.getters.getUserData.email }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn variant="text" rounded> Editar conta </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn variant="text" rounded @click="this.$store.logout('setLogout')"> Sair da sessão </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>

      <!--<Logout />
      <AuthenticateBtn v-if="$store.state.token == null" :showCard="false" />
       -->
    </v-app-bar>
    <!--FOOTER-->
    <v-footer dense color="primary" app>
      <p class="text-center w-100">
        © {{ new Date().getFullYear() }} - Faculdade de Educação - UNICAMP -
        todos os direitos reservados
      </p>
    </v-footer>
    <!--NAVIGATION DRAWER-->
    <!--
    <v-navigation-drawer v-model="drawer" color="secondary" :permanent="$vuetify.display.smAndUp">
      <v-list-item>
        <v-list density="compact" nav>
          <v-list-item title="BAPEX" class="d-flex justify-center"></v-list-item>
          <v-divider></v-divider>
          <v-list-group value="peopleGroups" fluid expand-icon="mdi-chevron-down-box"
            collapse-icon="mdi-chevron-up-box">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Pessoas e Grupos" v-if="$store.getters.getResourceAccess?.research || $store.getters.getResourceAccess?.people"></v-list-item>
            </template>
<div v-for="items in peopleGroups" :key="items.title">
  <v-list-item :title="items.title" :prepend-icon="items.icon" :value="items.title" :to="items.to"></v-list-item>
</div>
</v-list-group>
<v-list-group value="organizationalEntities" fluid expand-icon="mdi-chevron-down-box"
  collapse-icon="mdi-chevron-up-box">
  <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Entidades Organizacionais" v-if="$store.getters.getResourceAccess?.bapex || $store.getters.getResourceAccess?.people"></v-list-item>
            </template>
  <div v-for="items in organizationalEntities" :key="items.title">
    <v-list-item :title="items.title" :prepend-icon="items.icon" :value="items.title" :to="items.to"></v-list-item>
  </div>
</v-list-group>
<v-list-group value="actionsThemes" fluid expand-icon="mdi-chevron-down-box" collapse-icon="mdi-chevron-up-box">
  <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" title="Ações" v-if="$store.getters.getResourceAccess?.bapex"></v-list-item>
            </template>
  <div v-for="items in actionsThemes" :key="items.title">
    <v-list-item :title="items.title" :prepend-icon="items.icon" :value="items.title" :to="items.to"></v-list-item>
  </div>
</v-list-group>
<v-list-item :title="reports.title" :prepend-icon="reports.icon" :value="reports.title" :to="reports.to"></v-list-item>
<v-divider></v-divider>
</v-list>
</v-list-item>
<v-divider></v-divider>
</v-navigation-drawer>-->
    <v-navigation-drawer
      v-model="drawer"
      color="secondary"
      :permanent="$vuetify.display.smAndUp"
    >
      <v-list-item>
        <v-list density="compact" nav>
          <v-list-item
            title="BAPEX"
            class="d-flex justify-center"
          ></v-list-item>
          <v-divider></v-divider>
          <v-list-group
            v-for="category in filteredCategories"
            :key="category.categoryId"
            :value="category.categoryId"
            fluid
            expand-icon="mdi-chevron-down-box"
            collapse-icon="mdi-chevron-up-box"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="category.category"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="item in filteredItems(category)"
              :key="item.id"
              :title="item.title"
              :prepend-icon="item.icon"
              :to="item.to"
            ></v-list-item>
          </v-list-group>
          <v-divider></v-divider>
        </v-list>
      </v-list-item>
      <v-divider></v-divider>
    </v-navigation-drawer>
    <!-- MAIN -->
    <v-main class="custom-main">
      <v-container fluid>
        <Toast :baseZIndex="9999"></Toast>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
//import AuthenticateBtn from "./components/AuthenticateBtn.vue";
//import LogoutBtn from "./components/LogoutBtn.vue";
import store from './store';
import { mapGetters } from 'vuex';
export default {
  name: "App",
  created() {
    console.log(store.getters.getIsAuthenticated);
  },
  beforeCreate() {
    // Subscreva a mudança da variável global do Vuex
    this.$store.watch(
      () => this.$store.getters.getIsAuthenticated,
      (newValue, oldValue) => {
        // Verifique se a variável mudou de null para true
        if (oldValue === null && newValue === true) {
          // Execute o código desejado
          console.log('A variável global do Vuex mudou de null para true.');
          console.log(this.$store.getters.getIsAuthenticated);
          // Por exemplo, redirecione para outra rota
        }
      }
    );
  },
  methods: {
  hasCategoryAccess(category) {
    return category.items.some(item => this.hasItemAccess(item));
  },
  hasItemAccess(item) {
  if (this.resourceAccess) {
    return this.resourceAccess.some(resource => {
      return Object.values(resource).some(access => {
        return access.roles.includes(item.id);
      });
    });
  } else {
    return false; // Retorna falso se resourceAccess for nulo
  }

}},computed: {
  filteredCategories() {
    return this.menu.filter(category => {
      return category.items.some(item => this.hasItemAccess(item));
    });
  },
  filteredItems() {
    return category => {
      return category.items.filter(item => this.hasItemAccess(item));
    };
  },
    ...mapGetters(['getIsAuthenticated']),
    isAuthenticated() {
       return store.getters.getIsAuthenticated;
    }  
},
  data() {
    return {
      rail: true,
      drawer: true,
      model: true,
      resourceAccess: null,
      isAuth: null,
      menu: [
        {
          categoryId: "research",
          category: "Grupos de Pesquisas",
          items: [
            {
              id: "research.view",
              title: "Grupos de Pesquisas",
              icon: "mdi-account-group",
              to: "/research-groups",
            },
          ],
        },
        {
          categoryId: "bapex",
          category: "Ações e Colaborações",
          items: [
            {
              id: "action.view",
              title: "Ações",
              icon: "mdi-account-cog",
              to: "/actions",
            },
            {
              id: "institution.view",
              title: "Instiuições Parceiras",
              icon: "mdi-bank",
              to: "/institutions-partners",
            },
            {
              id: "action_subject.view",
              title: "Ações (Temas Relacionados)",
              icon: "mdi-table",
              to: "/actions-subjects",
            },
            {
              id: "report.view",
              title: "Relatórios",
              icon: "mdi-file-chart-outline",
              to: "/reports",
            },
          ],
        },
        {
          categoryId: "people",
          category: "Pessoas e Componentes Institucionais",
          items: [
            {
              id: "person.view",
              title: "Pessoas",
              icon: "mdi-account-multiple",
              to: "/people",
            },
            {
              id: "institution.view",
              title: "Instituições",
              icon: "mdi-school",
              to: "/institutions",
            },
            {
              id: "department.view",
              title: "Departamentos",
              icon: "mdi-briefcase",
              to: "/departments",
            },
            {
              id: "sector.view",
              title: "Setores",
              icon: "mdi-view-list",
              to: "/sectors",
            },
          ],
        },
      ],
      /*,
      reports: {
        title: "Relatórios",
        icon: "mdi-file-chart-outline",
        to: "/reports",        
      },
      peopleGroups: [
        {
          title: "Pessoas",
          icon: "mdi-account-multiple",
          to: "/people",
        },
        {
          title: "Grupos de Pesquisas",
          icon: "mdi-account-group",
          to: "/research-groups",
        },
      ],
      actionsThemes: [
        {
          title: "Ações",
          icon: "mdi-account-cog",
          to: "/actions",
        },
        {
          title: "Ações (Temas Relacionados)",
          icon: "mdi-table",
          to: "/actions-subjects",
        },
      ],
      organizationalEntities: [
        {
          title: "Instituições",
          icon: "mdi-school",
          to: "/institutions",
        },
        {
          title: "Instiuições Parceiras",
          icon: "mdi-bank",
          to: "/institutions-partners",
        },
        {
          title: "Departamentos",
          icon: "mdi-briefcase",
          to: "/departments",
        },
        {
          title: "Setores",
          icon: "mdi-view-list",
          to: "/sectors",
        },
      ],*/
    };
  },
};
</script>
<style>
.custom-main {
  background-color: #f5f5f5;
  /* Altere a cor de fundo para a cor desejada */
}
</style>