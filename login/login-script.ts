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

// TODO: Break into separate functions
async function setupAuth0(client: Auth0Client) {
  // Get login button and add function
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await loginWithRedirect(client);
  });

  // Detect url parameters to trigger callback and remove parameters
  if (
    location.search.includes("state=") &&
    (location.search.includes("code=") || location.search.includes("error="))
  ) {
    await handleRedirectCallback(client);
    console.log("Handling redirect callback");
    window.history.replaceState({}, document.title, "/");
  }

  // Get logout button and add function
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    logout(client, {
      clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
      logoutParams: {
        returnTo:
          window.location.protocol + "//" + window.location.host + "/login/",
      },
    });
  });

  // Get authentication data
  const isAuth = await isAuthenticated(client);
  console.log(`Authenticated: ${isAuth}`);
}

initializeAuth0().then((result: Auth0Client) => setupAuth0(result));
