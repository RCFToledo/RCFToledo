import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import store from './store';
import axios from './plugins/axios'; // Importe o seu plugin Axios
import keycloak from './plugins/keycloak';


loadFonts();

const app = createApp(App);
app.use(router).use(vuetify).use(store);

// Use o plugin Axios com o objeto Keycloak
app.use(axios, { keycloak });
app.component('v-data-table', VDataTable);
app.mount('#app');


