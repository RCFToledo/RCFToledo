import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'; // Verifique o caminho correto para o seu arquivo store
import HomeView from '@/views/HomeView.vue';

import keycloak from '../plugins/keycloak';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true } 
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {  
  // Verifica se a rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {    
    // Se o Keycloak não estiver inicializado ou não estiver autenticado, redirecione para a página de login
    if ((!keycloak.initialized || !keycloak.authenticated) && !keycloak.idTokenParsed) {
      keycloak
        .init({ onLoad: "login-required" })
        .then((authenticated) => {
          if (authenticated) { 
            store.commit('setIsAuthenticated', keycloak.authenticated);
            store.commit('setUserData', keycloak.idTokenParsed);
            store.commit('setToken', keycloak.token);
            store.commit('setResourceAccess', keycloak.resourceAccess);

            next('/'); // Continua para a próxima rota
          } else {
            console.error("Falha na autenticação.");
            next('/'); // Redireciona para a página inicial
          }
        })
        .catch((error) => {
          console.error("Erro na inicialização do Keycloak:", error);
          next('/'); // Redireciona para a página inicial
        });
    } else {
      next(); // Continua para a próxima rota se já estiver autenticado
    }
  } else {
    next(); // Se a rota não requer autenticação, continua para a próxima rota
  }
});

export default router