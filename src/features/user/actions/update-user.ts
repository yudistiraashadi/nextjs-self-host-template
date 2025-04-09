"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function updateUser(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    id: zfd.text(z.string().min(1)),
    name: zfd.text(z.string().min(1)),
    email: zfd.text(z.string().email()),
    userRole: zfd.text(z.enum(["admin", "user"])),
    password: zfd.text(z.string().min(6).optional()),
    passwordConfirmation: zfd.text(z.string().min(6).optional()),
  });

  const validationResult = await zfd
    .formData(validationRules)
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password confirmation must be same as password",
      path: ["passwordConfirmation"],
    })
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
        name: errorFormatted.name?._errors,
        email: errorFormatted.email?._errors,
        password: errorFormatted.password?._errors,
        passwordConfirmation: errorFormatted.passwordConfirmation?._errors,
        userRole: errorFormatted.userRole?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  try {
    await auth.api.updateUser({
      body: {
        id: validationResult.data.id,
        name: validationResult.data.name,
        email: validationResult.data.email,
        role: validationResult.data.userRole,
      },
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to update user",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "User updated successfully",
  };
}
