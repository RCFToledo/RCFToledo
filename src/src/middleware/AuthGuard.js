import keycloak from '@/plugins/keycloak'
import store from '@/store'

export function requireAuth(to) {
  if (!keycloak.authenticated) {
    keycloak.login({
      redirectUri: window.location.origin + to.fullPath
    })
    return false
  }
  if (!store.state.isAuthenticated) {
    store.commit('setIsAuthenticated', keycloak.authenticated)
    store.commit('setUserData', keycloak.idTokenParsed)
    store.commit('setToken', keycloak.token)
    store.commit('setResourceAccess', keycloak.resourceAccess)
  }
  return true
}