"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function updatePost(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().uuid()),
    title: zfd.text(z.string().min(1).max(100)),
    content: zfd.text(z.string().min(1).max(1000)),
    isProtected: zfd.numeric(z.number().min(0).max(1)),
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
        title: errorFlattened.title?._errors,
        content: errorFlattened.content?._errors,
        isProtected: errorFlattened.isProtected?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(posts)
        .set({
          title: validationResult.data.title,
          content: validationResult.data.content,
          isProtected: validationResult.data.isProtected === 1,
        })
        .where(eq(posts.id, validationResult.data.id));
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to update post",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "Post updated successfully",
  };
}
