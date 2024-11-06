/**
 * Creates and returns a configured Auth0Client
 * @returns {Promise<Auth0Client>}
 */
function createAuth0Client(options) {
  return auth0.createAuth0Client(options);
}

async function loginWithRedirect(client) {
  return client.loginWithRedirect();
}

async function handleRedirectCallback(client) {
  return client.handleRedirectCallback();
}

function logout(client, options) {
  return client.logout(options);
}

function isAuthenticated(client) {
  return client.isAuthenticated();
}

function getTokenSilently(client, options) {
  return client.getTokenSilently(options);
}
