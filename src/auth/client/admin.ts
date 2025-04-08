import { admin } from "better-auth/plugins";
import { createAuthClient } from "better-auth/react";

export const authAdminClient = createAuthClient({
  // baseURL: env.BASE_URL, // the base url of your auth server
  plugins: [admin()],
});
