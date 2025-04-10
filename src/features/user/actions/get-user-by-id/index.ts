import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user } from "@/db/drizzle/schema";
import { createServerApi } from "@/lib/server-api/create-server-api";
import { and, eq, ne } from "drizzle-orm";
import { z } from "zod";

export type GetUserByIdParams = { id: string };
export type GetUserByIdResponse = Awaited<
  ReturnType<typeof getUserByIdFunction>
>;

async function getUserByIdFunction(params: GetUserByIdParams) {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(user)
    .where(and(eq(user.id, params.id), ne(user.banned, true)))
    .limit(1)
    .then((res) => res[0]);
}

export const getUserById = createServerApi<
  GetUserByIdParams,
  GetUserByIdResponse
>({
  function: getUserByIdFunction,
  path: "/user/get-user-by-id",
  inputSchema: z.object({
    id: z.string(),
  }),
});
