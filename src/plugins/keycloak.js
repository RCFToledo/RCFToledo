import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'fe',
  url: 'https://test-contas.fe.unicamp.br:8443/',
  clientId: 'bapex-web',
};

export default new Keycloak(keycloakConfig);