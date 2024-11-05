// Use in-line import to keep declaration "ambient"
type Auth0Client = import("@auth0/auth0-spa-js").Auth0Client;

declare function initializeAuth0(): Promise<Auth0Client>;
declare function useAuth0(auth0Client: Auth0Client): Promise<void>;
