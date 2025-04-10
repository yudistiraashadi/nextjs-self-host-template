import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user as userTable } from "@/db/drizzle/schema";
import { type GetUserListParams } from "@/features/user/actions/get-user-list";
import { createServerApi } from "@/lib/server-api/create-server-api";
import { count, ilike, or } from "drizzle-orm";
import { z } from "zod";

export type GetUserListCountParams = Omit<
  GetUserListParams,
  "page" | "pageSize"
>;

const paramsSchema = z.object({
  search: z.string().optional(),
});

export type GetUserListCountResponse = Awaited<
  ReturnType<typeof getUserListCountFunction>
>;

async function getUserListCountFunction(params: GetUserListCountParams = {}) {
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
}

export const getUserListCount = createServerApi<
  GetUserListCountParams,
  GetUserListCountResponse
>({
  function: getUserListCountFunction,
  path: "/user/get-user-list-count",
  inputSchema: paramsSchema,
});
