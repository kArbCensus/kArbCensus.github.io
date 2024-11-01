var auth0Client = null;

/**
 * @returns {Promise<any>}
 */
function initializeAuth0() {
  auth0.createAuth0Client({
    domain: "dev-i8zcr46nupiabdjj.us.auth0.com",
    clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
    authorizationParams: {
      redirect_uri: window.location.href,
    },
  });
}

function helloWorld() {
  console.log("Hello world!");
}

// Initialize Auth0 client
auth0
  .createAuth0Client({
    domain: "dev-i8zcr46nupiabdjj.us.auth0.com",
    clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
    authorizationParams: {
      redirect_uri: window.location.href,
    },
  })
  .then(async (auth0Client) => {
    // Get login button and add function
    const loginButton = document.getElementById("login");

    loginButton.addEventListener("click", async (e) => {
      e.preventDefault();
      await auth0Client.loginWithRedirect();
    });

    // Detect url parameters to trigger callback and remove parameters
    if (
      location.search.includes("state=") &&
      (location.search.includes("code=") || location.search.includes("error="))
    ) {
      await auth0Client.handleRedirectCallback();
      console.log("Handling redirect callback");
      window.history.replaceState({}, document.title, "/");
    }

    // Get logout button and add function
    const logoutButton = document.getElementById("logout");

    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      auth0Client.logout({
        clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
        logoutParams: {
          returnTo:
            window.location.protocol + "//" + window.location.host + "/login/",
        },
      });
    });

    // Get authentication data
    const isAuthenticated = await auth0Client.isAuthenticated();
    const userProfile = await auth0Client.getUser();

    console.log(`Authenticated: ${isAuthenticated}`);

    // Assumes an element with id "profile" in the DOM
    const profileElement = document.getElementById("profile");

    if (isAuthenticated) {
      profileElement.style.display = "block";
      profileElement.innerHTML = `
                <p>${userProfile.name}</p>
                <img src="${userProfile.picture}" />
            `;
    } else {
      profileElement.style.display = "none";
    }
  });
