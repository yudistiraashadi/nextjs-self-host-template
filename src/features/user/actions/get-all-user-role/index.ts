"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userRoles } from "@/db/drizzle/schema";
import { cache } from "react";

export type GetAllUserRoleResponse = Awaited<ReturnType<typeof getAllUserRole>>;

export const getAllUserRole = cache(async function () {
  const db = createDrizzleConnection();

  return await db.select().from(userRoles);
});
