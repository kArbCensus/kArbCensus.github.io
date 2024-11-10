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
var client = null;
var token = null;
function authenticate() {
    initializeAuth0().then(() => checkAuth());
}
/**
 * Sets `client` to a new and configured Auth0Client.
 */
function initializeAuth0() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch("/auth_config.json");
        var config = (yield res.json());
        // Create Auth0 client using configuration
        config.authorizationParams = Object.assign(Object.assign({}, config.authorizationParams), { redirect_uri: window.location.href });
        client = yield createAuth0Client(config);
    });
}
/**
 * Handles logging in and sets `token` to a valid token string.
 */
function checkAuth() {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if just logged in
        yield checkCallback();
        // Get authentication data
        const isAuth = yield client.isAuthenticated();
        console.log(`Authenticated: ${isAuth}`);
        // If authenticated, get client token, else perform login
        if (isAuth) {
            try {
                token = yield client.getTokenSilently();
                // TODO: Remove debug log in production
                console.log("Access Token: ", token);
                console.log(`Is admin? ${isAdmin()}`);
            }
            catch (error) {
                console.error("Token renewal failed: ", error.message);
            }
        }
        else {
            yield client.loginWithRedirect();
        }
    });
}
/**
 * Performs a redirect callback if necessary.
 */
function checkCallback() {
    return __awaiter(this, void 0, void 0, function* () {
        // Detect url parameters from redirect
        const isCalledBack = location.search.includes("state=") &&
            (location.search.includes("code=") || location.search.includes("error="));
        // Trigger callback and remove parameters
        if (isCalledBack) {
            yield client.handleRedirectCallback();
            console.log("Handling redirect callback");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
}
/**
 * Determines whether the current user has administrator permissions.
 * @returns {boolean} if the user is an administrator
 */
function isAdmin() {
    const decodedToken = jwtDecode(token);
    // TODO: Remove debug log in production
    console.log("Decoded Token: ", decodedToken);
    return decodedToken["https://kArbCensus.github.io/roles"].includes("admin");
}
authenticate();
//# sourceMappingURL=authenticate.js.map