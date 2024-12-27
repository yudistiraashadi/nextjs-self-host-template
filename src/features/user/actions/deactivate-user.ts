"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userProfiles } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deactivateUser(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationResult = await zfd
    .formData({
      id: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.id?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const currentDate = new Date();
      // update user
      await tx
        .update(userProfiles)
        .set({
          deletedAt: currentDate,
          updatedAt: currentDate,
        })
        .where(eq(userProfiles.id, validationResult.data.id));
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Terjadi kesalahan",
      },
    };
  }

  return {
    message: "User berhasil dinonaktifkan",
  };
}
