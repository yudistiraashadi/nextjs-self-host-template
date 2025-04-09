import "server-only";

import { auth } from "@/auth";
import { type UserRole } from "@/features/user/constants";
import { headers } from "next/headers";
import { cache } from "react";

export const authGuard = cache(async function (allowedRoles: UserRole[] = []) {
  const currentUser = await auth.api.getSession({
    headers: await headers(),
  });

  if (!currentUser) {
    throw new Error("[AuthGuard Error] User not found");
  }

  if (allowedRoles.length > 0) {
    if (!currentUser.user.role) {
      throw new Error("[AuthGuard Error] Role not found");
    }

    // ref: https://www.better-auth.com/docs/plugins/admin#roles
    const userRoles = currentUser.user.role.split(",");

    if (userRoles) {
      const hasPermission = userRoles.some((role) =>
        allowedRoles.includes(role as UserRole),
      );

      if (!hasPermission) {
        throw new Error("[AuthGuard Error] User not authorized");
      }
    }
  }

  return currentUser;
});
