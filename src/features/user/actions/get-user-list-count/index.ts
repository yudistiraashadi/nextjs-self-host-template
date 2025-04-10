"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { type SearchParams } from "@/features/user/actions/get-user-list";
import { createParallelAction } from "@/lib/utils/next-server-action-parallel";
import { count, ilike, or } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";

export type CountSearchParams = Omit<SearchParams, "page" | "pageSize">;

const paramsSchema = z.object({
  search: z.string().optional(),
});

export type GetUserListCountResponse = Awaited<
  ReturnType<typeof getUserListCount>
>;

export const getUserListCount = cache(
  createParallelAction(async (params: CountSearchParams = {}) => {
    const { search } = paramsSchema.parse(params);

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
  }),
);
