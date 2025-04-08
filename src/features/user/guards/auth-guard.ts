import "server-only";

import { authClient } from "@/auth/client";
import { cache } from "react";

type Role = "user" | "admin";

export const authGuard = cache(async function (allowedRoles: Role[] = []) {
  const currentSession = await authClient.getSession();

  if (!currentSession.data) {
    throw new Error("[AuthGuard Error] User not found");
  }

  if (allowedRoles.length > 0) {
    if (!currentSession.data.user.role) {
      throw new Error("[AuthGuard Error] Role not found");
    }

    // ref: https://www.better-auth.com/docs/plugins/admin#roles
    const userRoles = currentSession.data.user.role.split(",");

    if (userRoles) {
      const hasPermission = userRoles.some((role) =>
        allowedRoles.includes(role as Role),
      );

      if (!hasPermission) {
        throw new Error("[AuthGuard Error] User not authorized");
      }
    }
  }

  return currentSession;
});
