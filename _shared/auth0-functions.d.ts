// Use in-line imports to keep declaration "ambient"
type Auth0Client = import("@auth0/auth0-spa-js").Auth0Client;
type Auth0ClientOptions = import("@auth0/auth0-spa-js").Auth0ClientOptions;
type LogoutOptions = import("@auth0/auth0-spa-js").LogoutOptions;
type GetTokenSilentlyOptions = import("@auth0/auth0-spa-js").GetTokenSilentlyOptions;

declare function createAuth0Client(options: Auth0ClientOptions): Promise<Auth0Client>;
declare function loginWithRedirect(client: Auth0Client): Promise<void>;
declare function handleRedirectCallback(client: Auth0Client): Promise<void>;
declare function logout(client: Auth0Client, options: LogoutOptions): Promise<void>;
declare function isAuthenticated(client: Auth0Client): Promise<boolean>;
declare function getTokenSilently(client: Auth0Client, options?: GetTokenSilentlyOptions): Promise<string>;