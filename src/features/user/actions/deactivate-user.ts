"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deactivateUser(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().uuid()),
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

  // PROCESS
  try {
    await auth.api.banUser({
      body: {
        userId: validationResult.data.id,
      },
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to deactivate user",
      },
    };
  }

  return {
    message: "User deactivated successfully",
  };
  // END OF PROCESS
}
