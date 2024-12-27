import { type GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";

export function isUserAdmin(user: GetUserByIdResponse) {
  return user.userRole.some((role) => role.id === 2);
}
