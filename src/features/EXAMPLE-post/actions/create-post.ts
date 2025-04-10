"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createPost(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    title: zfd.text(z.string().min(1).max(100)),
    content: zfd.text(z.string().min(1).max(1000)),
    isProtected: zfd.checkbox(),
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
        general: undefined,
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
      await tx.insert(posts).values({
        title: validationResult.data.title,
        content: validationResult.data.content,
        isProtected: validationResult.data.isProtected,
      });
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to create post",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "Post created successfully",
  };
}
