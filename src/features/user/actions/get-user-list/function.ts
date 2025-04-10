"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { and, desc, eq, ilike, isNull, or, SQL } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";
import { type GetUserListParams } from ".";
import { getUserListParamsSchema } from "./util";

export async function getUserListFunction(params: GetUserListParams = {}) {
  const {
    search,
    page = 1,
    pageSize = 10,
    columnFilters,
    sorting,
  } = getUserListParamsSchema.parse(params);

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

  // Determine the sorting configuration
  function applySorting<T extends PgSelect>(query: T) {
    if (sorting && sorting.length > 0) {
      const sortItem = sorting[0];

      if (sortItem.id === "name") {
        return sortItem.desc
          ? query.orderBy(desc(userTable.name))
          : query.orderBy(userTable.name);
      } else if (sortItem.id === "email") {
        return sortItem.desc
          ? query.orderBy(desc(userTable.email))
          : query.orderBy(userTable.email);
      } else if (sortItem.id === "role") {
        return sortItem.desc
          ? query.orderBy(desc(userTable.role))
          : query.orderBy(userTable.role);
      } else if (sortItem.id === "status") {
        return sortItem.desc
          ? query.orderBy(desc(userTable.banned))
          : query.orderBy(userTable.banned);
      }
    }

    // Default sorting
    return query.orderBy(desc(userTable.createdAt));
  }

  // Execute the query
  const query = db
    .select()
    .from(userTable)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .$dynamic();

  return await applySorting(query);
}
