import { createStore } from "vuex";

export default createStore({
  state: {
    username: null,
    token: null,
    unicamp_id: '653964ad00e637af8ca63548',
    userData: null,
    isAuthenticated: null,
  },
  mutations: {
    setIsAuthenticated(state, newAuthenticated) {
      state.isAuthenticated = newAuthenticated;
    },
    setUserData(state, newUserData) {
      state.userData = newUserData;
    },
    setUsername(state, newUsername) {
      state.username = newUsername;
    },
    setToken(state, newToken) {
      state.token = newToken;
    },
  },
  actions: {
    updateUsername({ commit }, newUsername) {
      commit('setUsername', newUsername);
    },
    updateToken({ commit }, newToken) {
      commit('setToken', newToken);
    },
  },
  getters: {
    getUnicamp_id: state => state.unicamp_id,
    getUsername: state => state.username,
    getToken: state => state.token,
    getUserData: state => state.userData,
    getIsAuthenticated: state => state.isAuthenticated,
  },
});
