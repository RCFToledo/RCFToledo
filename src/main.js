import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { VDataTable } from 'vuetify/labs/VDataTable';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import store from './store';
import axios from './plugins/axios'; // Importe o seu plugin Axios
import keycloak from './plugins/keycloak';
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bapex.css';
import ExportData from './components/ExportData.vue'

//o import está dando erro
import VueMask from '@devindex/vue-mask';

loadFonts();

const app = createApp(App);
app.use(router).use(VueMask).use(vuetify).use(store).use(ToastPlugin, {position: 'top-right', duration:5000, dismissible:true});

app.component('export-data', ExportData);

// Use o plugin Axios com o objeto Keycloak
app.use(axios, { keycloak });
app.component('v-data-table', VDataTable);
app.mount('#app');


