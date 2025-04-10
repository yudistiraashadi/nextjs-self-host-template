"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { getPostListCountParamsSchema } from "@/features/EXAMPLE-post/actions/get-post-list-count/util";
import { and, count, eq, ilike, or, SQL } from "drizzle-orm";
import { type GetPostListCountParams } from "./index";

export async function getPostListCountFunction(
  params: GetPostListCountParams = {},
) {
  const { search, columnFilters } = getPostListCountParamsSchema.parse(params);

  const db = createDrizzleConnection();

  // Build the search conditions
  const searchCondition = search
    ? or(ilike(posts.title, `%${search}%`), ilike(posts.content, `%${search}%`))
    : undefined;

  // Build column filter conditions
  const whereConditions: SQL<unknown>[] = [];

  if (searchCondition) {
    whereConditions.push(searchCondition);
  }

  if (columnFilters && columnFilters.length > 0) {
    for (const filter of columnFilters) {
      if (filter.id === "isProtected") {
        // For status, check the banned field
        const isProtected = String(filter.value) === "Protected";

        if (isProtected) {
          whereConditions.push(eq(posts.isProtected, true));
        } else {
          whereConditions.push(eq(posts.isProtected, false));
        }
      } else {
        const column = filter.id as "title" | "content";
        whereConditions.push(ilike(posts[column], `%${String(filter.value)}%`));
      }
    }
  }

  const totalResult = await db
    .select({ count: count() })
    .from(posts)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const total = Number(totalResult[0]?.count) || 0;

  return total;
}
