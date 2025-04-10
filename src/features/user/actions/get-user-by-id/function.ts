"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user } from "@/db/drizzle/schema";
import { and, eq, ne } from "drizzle-orm";
import { type GetUserByIdParams } from ".";

export async function getUserByIdFunction(params: GetUserByIdParams) {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(user)
    .where(and(eq(user.id, params.id), ne(user.banned, true)))
    .limit(1)
    .then((res) => res[0]);
}
