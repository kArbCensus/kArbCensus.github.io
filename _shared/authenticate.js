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
// TODO: Move the global data into Auth namespace and remove then redundant promises
globalThis.authToken = null;
// Define promise that resolves once token is set
let resolveAuthTokenReady;
globalThis.authTokenReady = new Promise((resolve) => {
    resolveAuthTokenReady = resolve;
});
// Define a promise once the role based on if the user is an admin
let resolvePromiseAdmin;
globalThis.promiseAdmin = new Promise((resolve) => {
    resolvePromiseAdmin = resolve;
});
// Define a promise that resolves when its able to give the base URL to any API interactions
let resolveBaseApiUrl;
globalThis.baseApiUrl = new Promise((resolve) => {
    resolveBaseApiUrl = resolve;
});
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
        // If authenticated, get client token, else perform login
        if (yield isAuthenticated()) {
            try {
                token = yield client.getTokenSilently();
                globalThis.authToken = token;
                resolveAuthTokenReady();
                globalThis.isAdmin = isAdmin();
                resolvePromiseAdmin();
                // Setting up the url of the api to be accessible
                const configRes = yield fetch("/api_config.json");
                const { urlBase } = (yield configRes.json());
                resolveBaseApiUrl(urlBase);
                // TODO: Remove debug logs in production
                console.log("Access Token: ", token);
                console.log(`Is admin? ${globalThis.isAdmin}`);
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
 * Determines whether the current user is authenticated.
 * @returns {Promise<boolean>} `true` if the user is authenticated
 */
function isAuthenticated() {
    return client.isAuthenticated();
}
/**
 * Determines whether the current user has administrator permissions.
 * @returns {boolean} `true` if the user is an administrator
 */
function isAdmin() {
    if (!token) {
        return false;
    }
    const decodedToken = jwtDecode(token);
    // TODO: Remove debug log in production
    console.log("Decoded Token: ", decodedToken);
    return decodedToken["https://kArbCensus.github.io/roles"].includes("admin");
}
authenticate();
// Define namespace for functions and variables that other scripts can use
var Auth;
(function (Auth) {
    var resolveReady;
    Auth.ready = new Promise((resolve) => {
        resolveReady = resolve;
    });
    function logout() {
        client.logout({
            clientId: "2kldI7VhApWNbFemvlgfavjne4alLCZz",
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }
    Auth.logout = logout;
    function resetPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield client.getUser();
            const res = yield fetch("/auth_config.json");
            var clientConfig = (yield res.json());
            const body = {
                client_id: clientConfig.clientId,
                email: user.email,
                connection: "Username-Password-Authentication",
            };
            const headers = { "content-type": "application/json" };
            const endpoint = "https://" + clientConfig.domain + "/dbconnections/change_password";
            try {
                yield fetch(endpoint, {
                    headers,
                    method: "POST",
                    body: JSON.stringify(body),
                });
            }
            catch (error) {
                yield resetPasswordPopupDisplay(false);
                throw new Error(`Failed to reset password: ${error.message}`);
            }
            yield resetPasswordPopupDisplay(true);
        });
    }
    Auth.resetPassword = resetPassword;
    resolveReady();
})(Auth || (Auth = {}));
/**
 * Provides the user with an alert that displays whether or not a
 * password reset email could be sent.
 * @param wasSuccess If an reset email was sent correctly.
 */
function resetPasswordPopupDisplay(wasSuccess) {
    return __awaiter(this, void 0, void 0, function* () {
        // Grabbing where content will go
        const template = document.getElementById("password-change-template");
        const placeHolder = document.getElementById("password-change-placeholder");
        // Adjusting the template based off if if the reset was successful
        const templateClass = template.content.querySelector("#template-pass-class");
        const templateText = template.content.querySelector("#template-pass-text");
        if (wasSuccess) {
            templateClass.className = "alert alert-success alert-dismissible fade show";
            templateText.textContent = "We've just sent you an email to change your password.";
        }
        else {
            templateClass.className = "alert alert-danger alert-dismissible fade show";
            templateText.textContent = "Error while resetting password! Please try again later.";
        }
        // Set up for a new user feedback popup
        placeHolder.innerHTML = "";
        const content = template.content.cloneNode(true);
        // Applying the new alert
        placeHolder.appendChild(content);
    });
}
globalThis.Auth = Auth;
//# sourceMappingURL=authenticate.js.map