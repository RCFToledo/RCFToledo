<template>
  <v-app>
    <!-- APP BAR -->    
    <v-app-bar color="primary" app>
      <v-app-bar-nav-icon
        v-if="!$vuetify.display.smAndUp"
        @click="
          drawer = !drawer;
          rail = false;          
        "
        style="margin-top: 40px;"
      ></v-app-bar-nav-icon>
      <a href="https://www.unicamp.br" style="text-decoration: none">
        <img
          src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo_unicamp.png"
          alt="Logo UNICAMP"
          style="height: 50px; margin-top: 15px; margin-left: 100px;"
        />
      </a>
      <v-toolbar-title @click="$router.push('/')" style="cursor: pointer">
        <img
          src="https://autenticacao.fe.unicamp.br/themes/custom/fe_theme/logo.png"
          alt="Faculdade de Educação"
          style="height: 50px; margin-top: 15px"
        />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!--<Logout />-->
      <!--<AuthenticateBtn v-if="$store.state.token == null" :showCard="false" />
      <LogoutBtn v-else />-->
    </v-app-bar>
    <!--FOOTER-->
    <v-footer dense color="primary" app>
      <p class="text-center w-100">
        © {{ new Date().getFullYear() }} - Faculdade de Educação - UNICAMP -
        todos os direitos reservados
      </p>
    </v-footer>
    <!--NAVIGATION DRAWER-->

    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      rail-width="90"
      color="secondary"
      :permanent="$vuetify.display.smAndUp"
    >
      <v-list-item>
        <v-list density="compact" nav>
          <v-list-item
            :prepend-icon="
              rail ? 'mdi-chevron-right-box' : 'mdi-chevron-left-box'
            "
            @click.stop="rail = !rail"
            title="Recuar Menu"
            ><v-tooltip v-if="rail" activator="parent"
              >Expandir Menu</v-tooltip
            ></v-list-item
          >
          <v-divider></v-divider>
          <div v-for="item in items" :key="item.title">
            <v-list-item
              :prepend-icon="item.icon"
              :title="item.title"
              :to="item.to"
              ><v-tooltip v-if="rail" activator="parent">{{
                item.title
              }}</v-tooltip></v-list-item
            >
          </div>
          <v-divider></v-divider>
        </v-list>
      </v-list-item>
      <v-divider></v-divider>
    </v-navigation-drawer>

    <!-- MAIN -->
    <v-main class="custom-main">
      <v-container fluid>
        <router-view />
      </v-container>
      <Toast :baseZIndex="9999" />
    </v-main>
  </v-app>
</template>

<script>
//import AuthenticateBtn from "./components/AuthenticateBtn.vue";
//import LogoutBtn from "./components/LogoutBtn.vue";
export default {
  name: "App",
  components: {
    //AuthenticateBtn,
    //LogoutBtn,
  },
  data() {
    return {
      rail: true,
      drawer: true,
      items: [
        {
          title: "BAPEX",
          icon: "mdi-database",
          to: "/loadTeaching",
        },
        {
          title: "Instituições",
          icon: "mdi-school",
          to: "/institutions",
        },
        {
          title: "Departamentos",
          icon: "mdi-briefcase",
          to: "/departments",
        },
        {
          title: "Pessoas",
          icon: "mdi-account-multiple",
          to: "/people",
        },
      ],
    };
  },
};
</script>
  <style>
.custom-main {
  background-color: #f5f5f5; /* Altere a cor de fundo para a cor desejada */
}
</style>