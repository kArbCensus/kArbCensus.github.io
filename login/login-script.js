var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "./auth0-functions.js";
function initializeAuth0() {
    // TODO: Fetch domain and clientId from /auth_config.json
    const config = {
        domain: "dev-i8zcr46nupiabdjj.us.auth0.com",
        clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
    };
    // Create Auth0 client using configuration
    const options = Object.assign(Object.assign({}, config), { authorizationParams: {
            redirect_uri: window.location.href,
        } });
    return createAuth0Client(options);
}
// TODO: Break into separate functions
function setupAuth0(client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get login button and add function
        const loginButton = document.getElementById("login");
        loginButton.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            yield loginWithRedirect(client);
        }));
        // Detect url parameters to trigger callback and remove parameters
        if (location.search.includes("state=") &&
            (location.search.includes("code=") || location.search.includes("error="))) {
            yield handleRedirectCallback(client);
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
                    returnTo: window.location.protocol + "//" + window.location.host + "/login/",
                },
            });
        });
        // Get authentication data
        const isAuth = yield isAuthenticated(client);
        console.log(`Authenticated: ${isAuth}`);
    });
}
initializeAuth0().then((result) => setupAuth0(result));
//# sourceMappingURL=login-script.js.map