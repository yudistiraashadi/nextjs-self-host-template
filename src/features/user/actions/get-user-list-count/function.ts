"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { and, count, eq, ilike, isNull, or, type SQL } from "drizzle-orm";
import { type GetUserListCountParams, getUserListCountParamsSchema } from ".";

export async function getUserListCountFunction(
  params: GetUserListCountParams = {},
) {
  const { search, columnFilters } = getUserListCountParamsSchema.parse(params);

  const db = createDrizzleConnection();

  // Build the search conditions
  const searchCondition = search
    ? or(
        ilike(userTable.name, `%${search}%`),
        ilike(userTable.email, `%${search}%`),
        ilike(userTable.role, `%${search}%`),
      )
    : undefined;

  // Build column filter conditions
  const whereConditions: SQL<unknown>[] = [];

  if (searchCondition) {
    whereConditions.push(searchCondition);
  }

  if (columnFilters && columnFilters.length > 0) {
    for (const filter of columnFilters) {
      if (filter.id === "status") {
        // For status, check the banned field
        const isActive = String(filter.value) === "Active";

        if (isActive) {
          whereConditions.push(
            or(
              eq(userTable.banned, false),
              isNull(userTable.banned),
            ) as SQL<unknown>,
          );
        } else {
          whereConditions.push(eq(userTable.banned, true));
        }
      } else {
        const column = filter.id as "name" | "email" | "role";
        whereConditions.push(
          ilike(userTable[column], `%${String(filter.value)}%`),
        );
      }
    }
  }

  // Get total count for pagination
  const totalResult = await db
    .select({ count: count() })
    .from(userTable)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const total = Number(totalResult[0]?.count) || 0;

  return total;
}
