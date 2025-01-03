import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import type { JwtPayload } from "jwt-decode";
import "./auth0-functions.js";

declare global {
  var authToken: string | null;
  var authTokenReady: Promise<void>;
  var promiseAdmin: Promise<void>;
  var isAdmin: boolean;
  var baseApiUrl: Promise<string>;

  namespace Auth {
    function logout(): void;
    function resetPassword(): void;
    var ready: Promise<void>;
  }
}

// TODO: Move the global data into Auth namespace and remove then redundant promises

globalThis.authToken = null;

// Define promise that resolves once token is set
let resolveAuthTokenReady: () => void;
globalThis.authTokenReady = new Promise<void>((resolve) => {
  resolveAuthTokenReady = resolve;
});

// Define a promise once the role based on if the user is an admin
let resolvePromiseAdmin: () => void;
globalThis.promiseAdmin = new Promise<void>((resolve) => {
  resolvePromiseAdmin = resolve;
});

// Define a promise that resolves when its able to give the base URL to any API interactions
let resolveBaseApiUrl: (value: string) => void;
globalThis.baseApiUrl = new Promise<string>((resolve) => {
  resolveBaseApiUrl = resolve;
});

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
      globalThis.authToken = token;
      resolveAuthTokenReady();
      globalThis.isAdmin = isAdmin();
      resolvePromiseAdmin();

      // Setting up the url of the api to be accessible
      const configRes = await fetch("/api_config.json");
      const { urlBase } = (await configRes.json()) as { urlBase: string };
      resolveBaseApiUrl(urlBase);

      // console.log("Access Token: ", token);
      // console.log(`Is admin? ${globalThis.isAdmin}`);
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
  // console.log("Decoded Token: ", decodedToken);

  return decodedToken["https://kArbCensus.github.io/roles"].includes("admin");
}

authenticate();

// Define namespace for functions and variables that other scripts can use
namespace Auth {
  var resolveReady: () => void;
  export var ready: Promise<void> = new Promise((resolve) => {
    resolveReady = resolve;
  });

  export function logout() {
    client.logout({
      clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  export async function resetPassword() {
    const user = await client.getUser();

    const res: Response = await fetch("/auth_config.json");
    var clientConfig = (await res.json()) as Auth0ClientOptions;

    const body = {
      client_id: clientConfig.clientId,
      email: user.email,
      connection: "Username-Password-Authentication",
    };

    const headers = { "content-type": "application/json" };

    const endpoint =
      "https://" + clientConfig.domain + "/dbconnections/change_password";

    try {
      await fetch(endpoint, {
        headers,
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (error) {
      await resetPasswordPopupDisplay(false);
      throw new Error(`Failed to reset password: ${(error as Error).message}`);
    }

    await resetPasswordPopupDisplay(true);
  }

  resolveReady();
}

/**
 * Provides the user with an alert that displays whether or not a
 * password reset email could be sent.
 * @param wasSuccess If an reset email was sent correctly.
 */
async function resetPasswordPopupDisplay(wasSuccess: boolean) {
  // Grabbing where content will go
  const template = document.getElementById("password-change-template") as HTMLTemplateElement;
  const placeHolder = document.getElementById("password-change-placeholder");

  // Adjusting the template based off if if the reset was successful
  const templateClass = template.content.querySelector("#template-pass-class");
  const templateText = template.content.querySelector("#template-pass-text"); 
  if(wasSuccess){
    templateClass.className = "alert alert-success alert-dismissible fade show";
    templateText.textContent = "We've just sent you an email to change your password.";
  }
  else{
    templateClass.className = "alert alert-danger alert-dismissible fade show";
    templateText.textContent = "Error while resetting password! Please try again later.";
  }

  // Set up for a new user feedback popup
  placeHolder.innerHTML = "";
  const content = template.content.cloneNode(true);

  // Applying the new alert
  placeHolder.appendChild(content);
}

globalThis.Auth = Auth;
