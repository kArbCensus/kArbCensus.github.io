import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import "./auth0-functions.js";

function initializeAuth0() {
  // TODO: Fetch domain and clientId from /auth_config.json
  const config = {
    domain: "dev-i8zcr46nupiabdjj.us.auth0.com",
    clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
  };

  // Create Auth0 client using configuration
  const options: Auth0ClientOptions = {
    ...config,
    authorizationParams: {
      redirect_uri: window.location.href,
    },
  };

  return createAuth0Client(options);
}

initializeAuth0().then((result: Auth0Client) => useAuth0(result));
