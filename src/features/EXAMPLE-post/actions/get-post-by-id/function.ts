"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { getMediaUrl } from "@/lib/utils/s3-storage";
import { and, eq } from "drizzle-orm";
import { type GetPostByIdParams } from ".";

export async function getPostByIdFunction(params: GetPostByIdParams) {
  const db = createDrizzleConnection();

  const post = await db
    .select()
    .from(posts)
    .where(and(eq(posts.id, params.id)))
    .limit(1)
    .then((res) => res[0]);

  if (!post) return null;

  // Convert image path to URL
  return {
    ...post,
    image: await getMediaUrl(post.image, {
      isPrivate: true,
      expiresIn: 3600,
    }),
  };
}
