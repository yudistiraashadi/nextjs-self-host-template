import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: env.NEXT_PUBLIC_AUTH_URL, // set this if auth is running on a different url than the client
});
