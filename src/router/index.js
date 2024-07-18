import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'; // Verifique o caminho correto para o seu arquivo store

import HomeView from '../views/HomeView.vue'
import InstitutionsView from '../views/InstitutionsView.vue'
import DepartmentsView from '../views/DepartmentsView.vue'
import SectorsView from '../views/SectorsView.vue'
import PeopleView from '../views/PeopleView.vue'
import ResearchGroupsView from '../views/ResearchGroupsView.vue'
import InstitutionsPartnerView from '../views/InstitutionsPartnerView.vue'
import ActionsView from '../views/ActionsView.vue'
import ActionsSubjectsView from '../views/ActionsSubjectsView.vue'
import ReportsView from '../views/ReportsView.vue'
import keycloak from '../plugins/keycloak';
import ActionsExtensionActivitiesView from '../views/ActionsExtensionActivitiesView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/institutions',
    name: 'institutions',
    component: InstitutionsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/departments',
    name: 'departments',
    component: DepartmentsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/sectors',
    name: 'sectors',
    component: SectorsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/people',
    name: 'people',
    component: PeopleView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/research-groups',
    name: 'ResearchGroups',
    component: ResearchGroupsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/institutions-partners',
    name: 'InstitutionsPartners',
    component: InstitutionsPartnerView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/actions',
    name: 'actions',
    component: ActionsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/actions/extension-activies',
    name: 'ActionsExtensionActivities',
    component: ActionsExtensionActivitiesView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/actions-subjects',
    name: 'ActionsSubjects',
    component: ActionsSubjectsView,
    meta: { requiresAuth: true } 
  },
  {
    path: '/reports',
    name: 'reports',
    component: ReportsView
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