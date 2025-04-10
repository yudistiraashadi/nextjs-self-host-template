"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { user } from "@/db/drizzle/schema";
import { createParallelAction } from "@/lib/utils/next-server-action-parallel";
import { and, eq, ne } from "drizzle-orm";
import { cache } from "react";

export type GetUserByIdResponse = Awaited<ReturnType<typeof getUserById>>;

export const getUserById = cache(
  createParallelAction(async function (id: string) {
    const db = createDrizzleConnection();

    return await db
      .select()
      .from(user)
      .where(and(eq(user.id, id), ne(user.banned, true)))
      .limit(1)
      .then((res) => res[0]);
  }),
);
