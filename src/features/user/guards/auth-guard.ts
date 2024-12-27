import "server-only";

import { getCurrentUser } from "@/features/user/functions/get-current-user";
import { cache } from "react";

// map role id to role name
const roleMap = new Map([[1, "admin"]]);

type Role = "admin";

type AuthGuardProps = {
  allowedRoles: Role[];
};

export const authGuard = cache(async function (
  { allowedRoles }: AuthGuardProps = { allowedRoles: [] },
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error("User not found");
  }

  if (allowedRoles.length > 0) {
    const currentUserRoleArray = currentUser.userRole.map((role) =>
      roleMap.get(role.id),
    );

    if (!allowedRoles.some((role) => currentUserRoleArray.includes(role))) {
      throw new Error("Unauthorized");
    }
  }

  return currentUser;
});
