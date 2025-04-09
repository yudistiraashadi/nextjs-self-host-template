export const userRole = ["user", "admin"] as const;

export type UserRole = (typeof userRole)[number];

export const userRoleBadgeColor = new Map([
  ["user", "blue"],
  ["admin", "red"],
]);
