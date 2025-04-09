"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { and, desc, eq, ilike, isNull, or, SQL } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";
import type {
  MRT_ColumnFiltersState,
  MRT_SortingState,
} from "mantine-react-table";
import { z } from "zod";

export type SearchParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  columnFilters?: MRT_ColumnFiltersState;
  sorting?: MRT_SortingState;
};

const paramsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.string(), value: z.string() }))
    .optional(),
  sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })).optional(),
});

export type GetUserListResponse = Awaited<ReturnType<typeof getUserList>>;

export async function getUserList(params: SearchParams = {}) {
  const {
    search,
    page = 1,
    pageSize = 10,
    columnFilters,
    sorting,
  } = paramsSchema.parse(params);

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
  let whereConditions: SQL<unknown>[] = [];

  if (searchCondition) {
    whereConditions.push(searchCondition);
  }

  if (columnFilters && columnFilters.length > 0) {
    const validColumns = ["name", "email", "role", "status"] as const;
    for (const filter of columnFilters) {
      if (validColumns.includes(filter.id as any)) {
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
  }

  // Determine the sorting configuration
  const applySorting = (query: PgSelect) => {
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
      }
    }

    // Default sorting
    return query.orderBy(desc(userTable.createdAt));
  };

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
