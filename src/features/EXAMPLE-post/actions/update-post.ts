"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { getS3Client } from "@/lib/utils/s3-storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import path from "node:path";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function updatePost(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().uuid()),
    title: zfd.text(z.string().min(1).max(100)),
    content: zfd.text(z.string().min(1).max(1000)),
    isProtected: zfd.numeric(z.number().min(0).max(1)),
    image: zfd.file().optional(),
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
        image: errorFlattened.image?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  const db = createDrizzleConnection();

  // Process image upload if any
  let imageKey: string | undefined;

  if (validationResult.data.image) {
    try {
      // Get the original file type (jpg, png, etc.)
      const originalFileExtension = path.extname(
        validationResult.data.image.name,
      );
      const s3Client = getS3Client();

      // Use the post ID as the filename
      const fileKey = validationResult.data.id + originalFileExtension;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: "post",
          Key: fileKey,
          Body: validationResult.data.image,
          ContentType: validationResult.data.image.type,
        }),
      );

      imageKey = "post/" + fileKey;
    } catch (error: Error | any) {
      return {
        error: {
          general:
            "Failed to process image: " + (error?.message || "Unknown error"),
        },
      };
    }
  }

  try {
    await db.transaction(async (tx) => {
      const updateData: any = {
        title: validationResult.data.title,
        content: validationResult.data.content,
        isProtected: validationResult.data.isProtected === 1,
      };

      // Only update the image if a new one was uploaded
      if (imageKey) {
        updateData.image = imageKey;
      }

      await tx
        .update(posts)
        .set(updateData)
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
