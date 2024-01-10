import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import router from './router';
import store from './store';
import axios from './plugins/axios'; // Importe o seu plugin Axios
import keycloak from './plugins/keycloak';
import ToastPlugin from 'vue-toast-notification';
import './plugins/theme-toastification.css';
import JsonCSV from 'vue-json-csv';
//import VueChartJS from 'vue-chartjs';
import VueMask from '@devindex/vue-mask';
//import VueMoment from 'vue-moment';

  

loadFonts();

const app = createApp(App);
  
  // Configuração do z-index para o vue-toast-notification
app.use(router).use(VueMask).use(vuetify).use(store).use(ToastPlugin, {position: 'top-right', duration:5000000000, dismissible:true});  

app.component('download-csv', JsonCSV)


app.use(axios, { keycloak });
app.mount('#app');

