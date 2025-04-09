"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { desc, ilike, or } from "drizzle-orm";
import { z } from "zod";

export type SearchParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

const paramsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
});

export type GetUserListResponse = Awaited<ReturnType<typeof getUserList>>;
export async function getUserList(params: SearchParams = {}) {
  const { search, page = 1, pageSize = 10 } = paramsSchema.parse(params);

  const db = createDrizzleConnection();

  // Build the search conditions
  const searchCondition = search
    ? or(
        ilike(userTable.name, `%${search}%`),
        ilike(userTable.email, `%${search}%`),
        ilike(userTable.role, `%${search}%`),
      )
    : undefined;

  // Get paginated users with their roles
  return await db
    .select()
    .from(userTable)
    .where(searchCondition)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .orderBy(desc(userTable.createdAt));
}
