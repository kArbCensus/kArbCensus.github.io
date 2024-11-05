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
initializeAuth0().then((result) => useAuth0(result));
//# sourceMappingURL=login-script.js.map