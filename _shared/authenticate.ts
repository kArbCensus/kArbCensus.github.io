import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import "./auth0-functions.js";

var client: Auth0Client = null;
var token: string = null;

function authenticate() {
  initializeAuth0().then(() => checkAuth());
}

/**
 * Sets `client` to a new and configured Auth0Client.
 */
async function initializeAuth0() {
  const res: Response = await fetch("/auth_config.json");
  const config = (await res.json()) as Auth0ClientOptions;

  // Create Auth0 client using configuration
  const options: Auth0ClientOptions = {
    ...config,
    authorizationParams: {
      redirect_uri: window.location.href,
    },
  };

  client = await createAuth0Client(options);
}

/**
 * Handles logging in and setting `token` to a valid token string.
 */
async function checkAuth() {
  // Check if just logged in
  await checkCallback();

  // Get authentication data
  const isAuth: Boolean = await client.isAuthenticated();
  console.log(`Authenticated: ${isAuth}`);

  // If authenticated, get client token, else perform login
  if (isAuth) {
    try {
      token = await client.getTokenSilently();
      // TODO: Remove debug log in production
      console.log("Access Token: ", token);
    } catch (error) {
      console.error("Token renewal failed: ", (error as Error).message);
    }
  } else {
    await client.loginWithRedirect();
  }
}

async function checkCallback() {
  // Detect url parameters to trigger callback and remove parameters
  const isCalledBack: Boolean =
    location.search.includes("state=") &&
    (location.search.includes("code=") || location.search.includes("error="));

  if (isCalledBack) {
    await client.handleRedirectCallback();
    console.log("Handling redirect callback");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

authenticate();
