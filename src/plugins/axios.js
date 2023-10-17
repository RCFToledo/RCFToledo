import axios from 'axios';

const authInterceptor = (config, keycloak) => {
  // Verifique se o usuário está autenticado no Keycloak
  if (keycloak.authenticated) {
    // Obtém o token do Keycloak
    const token = keycloak.token;

    // Defina o cabeçalho Authorization com o token
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export default {
  install: (app, { keycloak }) => {
    // Configure o Axios da maneira que você deseja
    axios.defaults.baseURL = 'http://177.220.83.21:3000/';
    axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

    // Adicione o interceptor global para definir o cabeçalho Authorization
    axios.interceptors.request.use((config) => authInterceptor(config, keycloak));

    // Adicione o Axios ao objeto Vue para que você possa usá-lo em todo o aplicativo
    app.config.globalProperties.$axios = axios;
  },
};
