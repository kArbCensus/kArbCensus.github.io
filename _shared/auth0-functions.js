/**
 * Creates and returns a configured Auth0Client.
 * @param {import("@auth0/auth0-spa-js").Auth0ClientOptions} options client options
 * @returns {Promise<import("@auth0/auth0-spa-js").Auth0Client>}
 */
function createAuth0Client(options) {
  return auth0.createAuth0Client(options);
}
