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
import './plugins/VSwitch.css';
import JsonCSV from 'vue-json-csv';
//import VueChartJS from 'vue-chartjs';
import VueMask from '@devindex/vue-mask';
import MyAutocomplete from './components/MyAutocomplete.vue';
//import VueMoment from 'vue-moment';

  

loadFonts();

const app = createApp(App);
  
  // Configuração do z-index para o vue-toast-notification
app.use(store).use(router).use(VueMask).use(vuetify).use(ToastPlugin, {position: 'top-right', duration:4000, dismissible:true});  

app.component('download-csv', JsonCSV).component('my-autocomplete', MyAutocomplete);


app.use(axios, { keycloak });
app.mount('#app');

