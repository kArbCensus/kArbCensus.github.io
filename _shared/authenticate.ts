import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import "./auth0-functions.js";

var client: Auth0Client = null;

async function initializeAuth0() {
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

  client = await createAuth0Client(options);
}

// TODO: Redirect when login required
async function checkAuth() {
  // Get authentication data
  const isAuth = await client.isAuthenticated();
  console.log(`Authenticated: ${isAuth}`);

  try {
    const token = await client.getTokenSilently();
    console.log("Access Token: ", token);
  } catch (error) {
    console.error("Token renewal failed: ", (error as Error).message);
  }
}

initializeAuth0().then(() => checkAuth());
