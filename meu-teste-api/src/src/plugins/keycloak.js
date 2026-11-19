import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  realm: process.env.VUE_APP_KC_REALM,
  url: process.env.VUE_APP_KC_URL,
  clientId: process.env.VUE_APP_KC_CLIENT_ID
})

window.keycloak = keycloak
export default keycloak