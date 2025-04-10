"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deletePost(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().uuid()),
  });

  const validationResult = await zfd
    .formData(validationRules)
    .safeParseAsync(formData);

  // error validation
  if (!validationResult.success) {
    const errorFlattened =
      validationResult.error.format() as z.inferFormattedError<
        typeof validationRules
      >;

    return {
      error: {
        general: errorFlattened.id?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      await tx.delete(posts).where(eq(posts.id, validationResult.data.id));
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to delete post",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "Post deleted successfully",
  };
}
