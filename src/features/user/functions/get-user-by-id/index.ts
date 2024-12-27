"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { getUserRolesCTE } from "@/features/user/utils/get-user-roles-cte";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { unstable_cacheTag } from "next/cache";
import { getUserByIdCacheKeyHashed } from "./cache-key";

export type GetUserByIdResponse = Awaited<ReturnType<typeof getUserById>>;

export const getUserById = async function (id: string) {
  "use cache";
  unstable_cacheTag(getUserByIdCacheKeyHashed(id));

  const db = createDrizzleConnection();

  const userRolesCTE = getUserRolesCTE(db);

  return await db
    .with(userRolesCTE)
    .select({
      email: authUsers.email,
      ...getTableColumns(userProfiles),
      userRole: sql<
        { id: number; name: string }[]
      >`COALESCE(${userRolesCTE.roles}, '{}')`,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .leftJoin(userRolesCTE, eq(authUsers.id, userRolesCTE.userId))
    .limit(1)
    .then((res) => res[0]);
};
