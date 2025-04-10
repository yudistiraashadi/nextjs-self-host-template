"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { type GetPostByIdParams } from ".";

export async function getPostByIdFunction(params: GetPostByIdParams) {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, params.id)))
    .limit(1)
    .then((res) => res[0]);
}
