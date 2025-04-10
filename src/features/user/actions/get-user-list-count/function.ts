"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { count, ilike, or } from "drizzle-orm";
import { type GetUserListCountParams, getUserListCountParamsSchema } from ".";

export async function getUserListCountFunction(
  params: GetUserListCountParams = {},
) {
  // sleep 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const { search } = getUserListCountParamsSchema.parse(params);

  const db = createDrizzleConnection();

  // Build the search conditions
  const searchCondition = search
    ? or(
        ilike(userTable.name, `%${search}%`),
        ilike(userTable.email, `%${search}%`),
        ilike(userTable.role, `%${search}%`),
      )
    : undefined;

  // Get total count for pagination
  const totalResult = await db
    .select({ count: count() })
    .from(userTable)
    .where(searchCondition);

  const total = Number(totalResult[0]?.count) || 0;

  return total;
}
