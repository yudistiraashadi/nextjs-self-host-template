"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { posts } from "@/db/drizzle/schema";
import { getS3Client } from "@/lib/utils/s3-storage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import path from "node:path";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createPost(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    title: zfd.text(z.string().min(1).max(100)),
    content: zfd.text(z.string().min(1).max(1000)),
    isProtected: zfd.checkbox(),
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
        general: undefined,
        title: errorFlattened.title?._errors,
        content: errorFlattened.content?._errors,
        isProtected: errorFlattened.isProtected?._errors,
        image: errorFlattened.image?._errors,
      },
    };
  }
  // END OF VALIDATION

  try {
    // DATA PROCESSING
    const db = createDrizzleConnection();
    const currentId = uuidv7();

    // Process image upload if any
    let imageKey: string | undefined;
    if (validationResult.data.image) {
      try {
        // Get the original file type (jpg, png, etc.)
        const originalFileExtension = path.extname(
          validationResult.data.image.name,
        );
        const s3Client = getS3Client();

        // Convert file to buffer before uploading
        const fileBuffer = await validationResult.data.image.arrayBuffer();

        await s3Client.send(
          new PutObjectCommand({
            Bucket: "post",
            Key: currentId + originalFileExtension,
            Body: Buffer.from(fileBuffer),
            ContentType: validationResult.data.image.type,
          }),
        );

        imageKey = "post/" + currentId + originalFileExtension;
      } catch (error: Error | any) {
        return {
          error: {
            general:
              "Failed to process image: " + (error?.message || "Unknown error"),
          },
        };
      }
    }
    await db.transaction(async (tx) => {
      await tx.insert(posts).values({
        title: validationResult.data.title,
        content: validationResult.data.content,
        isProtected: validationResult.data.isProtected,
        image: imageKey, // Store the image key/path in the database
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
