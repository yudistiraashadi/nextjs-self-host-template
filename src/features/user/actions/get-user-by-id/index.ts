"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { getUserRolesCTE } from "@/features/user/utils/get-user-roles-cte";
import { and, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { cache } from "react";

export type GetUserByIdResponse = Awaited<ReturnType<typeof getUserById>>;

export const getUserById = cache(async function (id: string) {
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
    .leftJoin(userRolesCTE, eq(authUsers.id, userRolesCTE.userId))
    .where(and(eq(authUsers.id, id), isNull(userProfiles.deletedAt)))
    .limit(1)
    .then((res) => res[0]);
});
