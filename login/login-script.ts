import type { Auth0Client, Auth0ClientOptions } from "@auth0/auth0-spa-js";
import "../_shared/auth0-functions.js";

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
async function authenticate(client: Auth0Client) {
  // Get login button and add function
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", async (e) => {
    e.preventDefault();
    await client.loginWithRedirect();
  });

  // Detect url parameters to trigger callback and remove parameters
  if (
    location.search.includes("state=") &&
    (location.search.includes("code=") || location.search.includes("error="))
  ) {
    await client.handleRedirectCallback();
    console.log("Handling redirect callback");
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Get logout button and add function
  const logoutButton = document.getElementById("logout");

  logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    client.logout({
      clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
      logoutParams: {
        returnTo:
          window.location.origin + "/login/",
      },
    });
  });

  // Get authentication data
  const isAuth = await client.isAuthenticated();
  console.log(`Authenticated: ${isAuth}`);
}

initializeAuth0().then((result: Auth0Client) => authenticate(result));
