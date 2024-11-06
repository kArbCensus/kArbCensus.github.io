// Use in-line import to keep declaration "ambient"
type Auth0Client = import("@auth0/auth0-spa-js").Auth0Client;
type ClientOptions = import("@auth0/auth0-spa-js").Auth0ClientOptions;
type LogoutOptions = import("@auth0/auth0-spa-js").LogoutOptions;

declare function createAuth0Client(options: ClientOptions): Promise<Auth0Client>;
declare function loginWithRedirect(client: Auth0Client): Promise<void>;
declare function handleRedirectCallback(client: Auth0Client): Promise<void>;
declare function logout(client: Auth0Client, options: LogoutOptions): Promise<void>;
declare function isAuthenticated(client: Auth0Client): Promise<boolean>;