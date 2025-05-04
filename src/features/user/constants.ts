export const userRole = ["user", "admin"] as const;

export type UserRole = (typeof userRole)[number];
