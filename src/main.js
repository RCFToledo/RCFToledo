import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import store from './store';
import axios from './plugins/axios';
import keycloak from './plugins/keycloak';
import rules from './plugins/rules';
import ToastPlugin from 'vue-toast-notification';
import './plugins/theme-toastification.css';
import VueMask from '@devindex/vue-mask';

const FRONT_PATH = process.env.VUE_APP_FRONT_PATH || 'http://localhost:8080';
const BACK_PATH = process.env.VUE_APP_BACK_PATH || 'http://localhost:3000';
const KC_URL = process.env.VUE_APP_KC_URL;
const KC_REALM = process.env.VUE_APP_KC_REALM;
const KC_CLIENT_ID = process.env.VUE_APP_KC_CLIENT_ID;

loadFonts();

async function initApp() {
  try {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      enableLogging: false
    });

    if (authenticated) {
      store.commit('setIsAuthenticated', true);
      store.commit('setUserData', keycloak.tokenParsed);
      store.commit('setToken', keycloak.token);
      store.commit('setResourceAccess', keycloak.resourceAccess);
    } else {
      store.commit('setIsAuthenticated', false);
    }
  } catch (error) {
    console.error('Erro de autenticação no Keycloak:', error);
    store.commit('setIsAuthenticated', false);
  }

  mountVueApp();
}

function mountVueApp() {
  const app = createApp(App);

  app.use(store)
    .use(router)
    .use(vuetify)
    .use(VueMask)
    .use(ToastPlugin, {
      position: 'top-right',
      duration: 4000,
      dismissible: true,
    })
    .use(rules);

  app.use(axios, { keycloak });

  app.config.globalProperties.$FRONTPATH = FRONT_PATH;
  app.config.globalProperties.$BACKPATH = BACK_PATH;
  app.config.globalProperties.$KCURL = KC_URL;
  app.config.globalProperties.$KCREALM = KC_REALM;
  app.config.globalProperties.$KCCLIENTID = KC_CLIENT_ID;

  app.mount('#app');
}

initApp();