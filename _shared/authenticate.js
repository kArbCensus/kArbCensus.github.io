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
function initializeAuth0() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Fetch domain and clientId from /auth_config.json
        const config = {
            domain: "dev-i8zcr46nupiabdjj.us.auth0.com",
            clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
        };
        // Create Auth0 client using configuration
        const options = Object.assign(Object.assign({}, config), { authorizationParams: {
                redirect_uri: window.location.href,
            } });
        client = yield createAuth0Client(options);
    });
}
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
            }
            catch (error) {
                console.error("Token renewal failed: ", error.message);
            }
        }
        else {
            yield client.loginWithRedirect();
            console.log("Would log in");
        }
    });
}
function checkCallback() {
    return __awaiter(this, void 0, void 0, function* () {
        // Detect url parameters to trigger callback and remove parameters
        const isCalledBack = location.search.includes("state=") &&
            (location.search.includes("code=") || location.search.includes("error="));
        if (isCalledBack) {
            yield client.handleRedirectCallback();
            console.log("Handling redirect callback");
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
}
initializeAuth0().then(() => checkAuth());
//# sourceMappingURL=authenticate.js.map