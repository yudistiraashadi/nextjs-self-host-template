"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createUser(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    name: zfd.text(z.string().min(1).max(100)),
    email: zfd.text(z.string().email()),
    userRole: zfd.text(z.enum(["admin", "user"])),
    password: zfd.text(z.string().min(6).max(30)),
    passwordConfirmation: zfd.text(z.string().min(6).max(30)),
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
    const errorFlattened =
      validationResult.error.format() as z.inferFormattedError<
        typeof validationRules
      >;

    return {
      error: {
        general: undefined,
        name: errorFlattened.name?._errors,
        email: errorFlattened.email?._errors,
        password: errorFlattened.password?._errors,
        passwordConfirmation: errorFlattened.passwordConfirmation?._errors,
        userRole: errorFlattened.userRole?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  try {
    await auth.api.createUser({
      body: {
        email: validationResult.data.email,
        password: validationResult.data.password,
        name: validationResult.data.name,
        role: validationResult.data.userRole,
      },
    });
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to create user",
      },
    };
  }
  // END OF DATA PROCESSING

  return {
    message: "User created successfully",
  };
}
