// Use in-line imports to keep declaration "ambient"
type Auth0Client = import("@auth0/auth0-spa-js").Auth0Client;
type Auth0ClientOptions = import("@auth0/auth0-spa-js").Auth0ClientOptions;
type JwtPayload = import("jwt-decode").JwtPayload;
type JwtDecodeOptions = import("jwt-decode").JwtDecodeOptions;

/**
 * Creates and returns a configured Auth0Client.
 * @param {Auth0ClientOptions} options client options
 * @returns {Promise<Auth0Client>}
 */
declare function createAuth0Client(
  options: Auth0ClientOptions
): Promise<Auth0Client>;

declare function jwtDecode<T = JwtPayload>(
  token: string,
  options?: JwtDecodeOptions & {
    header: true;
  }
): T;
