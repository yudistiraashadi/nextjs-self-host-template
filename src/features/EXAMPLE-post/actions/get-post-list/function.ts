"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import type { PgSelect } from "drizzle-orm/pg-core";
import { type GetPostListParams } from "./index";

export async function getPostListFunction(params: GetPostListParams = {}) {
  const { search, page = 1, pageSize = 10, columnFilters, sorting } = params;

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

  // Determine the sorting configuration
  function applySorting<T extends PgSelect>(query: T) {
    if (sorting && sorting.length > 0) {
      const sortItem = sorting[0];

      if (sortItem.id === "title") {
        return sortItem.desc
          ? query.orderBy(desc(posts.title))
          : query.orderBy(posts.title);
      } else if (sortItem.id === "content") {
        return sortItem.desc
          ? query.orderBy(desc(posts.content))
          : query.orderBy(posts.content);
      } else if (sortItem.id === "isProtected") {
        return sortItem.desc
          ? query.orderBy(desc(posts.isProtected))
          : query.orderBy(posts.isProtected);
      }
    }

    // Default sorting
    return query.orderBy(desc(posts.createdAt));
  }

  // Execute the query
  const query = db
    .select()
    .from(posts)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .$dynamic();

  return await applySorting(query);
}
