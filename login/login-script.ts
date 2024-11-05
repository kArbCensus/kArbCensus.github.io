import type { Auth0Client } from "@auth0/auth0-spa-js";
import "./auth0-functions.js";

initializeAuth0().then((result: Auth0Client) => useAuth0(result));
