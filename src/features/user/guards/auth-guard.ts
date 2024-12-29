import "server-only";

import { getCurrentUser } from "@/features/user/actions/get-current-user";
import { cache } from "react";

// map role id to role name
const roleMap = new Map([
  [1, "user"],
  [2, "admin"],
]);

type Role = "user" | "admin";

export const authGuard = cache(async function (allowedRoles: Role[] = []) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      error: "User not found",
    };
  }

  if (allowedRoles.length > 0) {
    const currentUserRoleArray = currentUser.userRole.map((role) =>
      roleMap.get(role.id),
    );

    if (!allowedRoles.some((role) => currentUserRoleArray.includes(role))) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }
  }

  return {
    success: true,
    data: currentUser,
  };
});
