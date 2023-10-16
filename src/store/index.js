import { createStore } from "vuex";

export default createStore({
  state: {
    username: null,
    token: null,
  },
  mutations: {
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
    getUsername: state => state.username,
    getToken: state => state.token,
  },
});
