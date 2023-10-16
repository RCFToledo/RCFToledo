/*import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'fe',
  url: 'https://test-contas.fe.unicamp.br:8443/',
  clientId: 'bapex',
};

export default new Keycloak(keycloakConfig);
 */

import Keycloak from 'keycloak-js';

const keycloakConfig = {
  realm: 'fe',
  url: 'http://localhost:8080/',
  clientId: 'myclient',
};

export default new Keycloak(keycloakConfig);