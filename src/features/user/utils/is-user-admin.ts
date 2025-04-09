import type { AuthGuardResponse } from "@/features/user/guards/auth-guard";

export function isUserAdmin(user: AuthGuardResponse) {
  return user.user.role?.split(",").includes("admin") ?? false;
}
