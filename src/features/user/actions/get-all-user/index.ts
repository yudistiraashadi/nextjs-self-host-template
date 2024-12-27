"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { getUserRolesCTE } from "@/features/user/utils/get-user-roles-cte";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { cache } from "react";

export type GetAllUserResponse = Awaited<ReturnType<typeof getAllUser>>;

export const getAllUser = cache(async function () {
  const db = createDrizzleConnection();

  const userRolesCTE = getUserRolesCTE(db);

  return await db
    .with(userRolesCTE)
    .select({
      username: sql<string>`SPLIT_PART(${authUsers.email}, '@', 1)`,
      ...getTableColumns(userProfiles),
      userRole: sql<
        { id: number; name: string }[]
      >`COALESCE(${userRolesCTE.roles}, '{}')`,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .innerJoin(userRolesCTE, eq(authUsers.id, userRolesCTE.userId));
});
