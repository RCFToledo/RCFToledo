import { createApp } from 'vue'
import App from './App.vue' // <-- Adicionado o ./
import router from './router'
import { vuetify } from './plugins/vuetify' // Importa a configuração

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')