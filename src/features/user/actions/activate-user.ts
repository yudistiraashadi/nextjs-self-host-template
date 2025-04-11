"use server";

import { authGuard } from "@/features/user/guards/auth-guard";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function activateUser(prevState: any, formData: FormData) {
  // AUTH GUARD
  await authGuard(["admin"]);

  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().min(1)),
  });

  const validationResult = await zfd
    .formData(validationRules)
    .safeParseAsync(formData);

  // error validation
  if (!validationResult.success) {
    const errorFormatted =
      validationResult.error.format() as z.inferFormattedError<
        typeof validationRules
      >;

    return {
      error: {
        general: errorFormatted.id?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  try {
    await auth.api.unbanUser({
      body: {
        userId: validationResult.data.id,
      },
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to activate user",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "User activated successfully",
  };
}
