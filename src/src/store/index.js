import { createStore } from 'vuex'

const state = {
  username: null,
  token: null,
  unicamp_id: 1,
  userData: null,
  isAuthenticated: null,
  logout: null,
  resourceAccess: []
}

const mutations = {
  setIsAuthenticated(state, newAuthenticated) {
    state.isAuthenticated = newAuthenticated
  },
  setUserData(state, newUserData) {
    state.userData = newUserData
  },
  setUsername(state, newUsername) {
    state.username = newUsername
  },
  setToken(state, newToken) {
    state.token = newToken
  },
  setLogout(state, logoutFunction) {
    state.logout = logoutFunction
  },
  setResourceAccess(state, newResourceAccess) {
    state.resourceAccess = newResourceAccess
  }
}

const actions = {
  async logout({ commit, state }) {
    if (typeof state.logout === 'function') {
      state.logout()
    }
    commit('setUserData', {})
    commit('setToken', '')
    commit('setIsAuthenticated', false)
  },
  updateUsername({ commit }, newUsername) {
    commit('setUsername', newUsername)
  },
  updateToken({ commit }, newToken) {
    commit('setToken', newToken)
  },
  updateResourceAccess({ commit }, newResourceAccess) {
    commit('setResourceAccess', newResourceAccess)
  }
}

const getters = {
  getKeycloak: state => state.keycloak,
  getResourceAccess: state => state.resourceAccess,
  getUnicamp_id: state => state.unicamp_id,
  getUsername: state => state.username,
  getToken: state => state.token,
  getUserData: state => state.userData,
  getIsAuthenticated: state => state.isAuthenticated
}

export default createStore({
  state,
  mutations,
  actions,
  getters
})