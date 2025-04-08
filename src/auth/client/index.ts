import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: env.BASE_URL, // the base url of your auth server
  plugins: [adminClient()],
});
