/**
 * Creates and returns a configured Auth0Client
 * @returns {Promise<Auth0Client>}
 */
function createAuth0Client(options) {
  return auth0.createAuth0Client(options);
}
