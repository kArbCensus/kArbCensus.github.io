import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import type { JwtPayload } from "jwt-decode";
import "./auth0-functions.js";

interface ArbJwtPayload extends JwtPayload {
  "https://kArbCensus.github.io/roles": Array<string>;
}

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
  var config = (await res.json()) as Auth0ClientOptions;

  // Create Auth0 client using configuration
  config.authorizationParams = {
    ...config.authorizationParams,
    redirect_uri: window.location.href,
  };

  client = await createAuth0Client(config);
}

/**
 * Handles logging in and sets `token` to a valid token string.
 */
async function checkAuth() {
  // Check if just logged in
  await checkCallback();

  // If authenticated, get client token, else perform login
  if (await isAuthenticated()) {
    try {
      token = await client.getTokenSilently();
      // TODO: Remove debug logs in production
      console.log("Access Token: ", token);
      console.log(`Is admin? ${isAdmin()}`);
    } catch (error) {
      console.error("Token renewal failed: ", (error as Error).message);
    }
  } else {
    await client.loginWithRedirect();
  }
}

/**
 * Performs a redirect callback if necessary.
 */
async function checkCallback() {
  // Detect url parameters from redirect
  const isCalledBack: boolean =
    location.search.includes("state=") &&
    (location.search.includes("code=") || location.search.includes("error="));

  // Trigger callback and remove parameters
  if (isCalledBack) {
    await client.handleRedirectCallback();
    console.log("Handling redirect callback");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

/**
 * Determines whether the current user is authenticated.
 * @returns {Promise<boolean>} `true` if the user is authenticated
 */
function isAuthenticated(): Promise<boolean> {
  return client.isAuthenticated();
}

/**
 * Determines whether the current user has administrator permissions.
 * @returns {boolean} `true` if the user is an administrator
 */
function isAdmin(): boolean {
  if (!token) {
    return false;
  }

  const decodedToken = jwtDecode<ArbJwtPayload>(token);
  // TODO: Remove debug log in production
  console.log("Decoded Token: ", decodedToken);

  return decodedToken["https://kArbCensus.github.io/roles"].includes("admin");
}

authenticate();
