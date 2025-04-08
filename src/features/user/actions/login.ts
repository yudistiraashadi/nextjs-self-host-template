"use server";

import { auth } from "@/auth";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function login(prevState: any, formData: FormData) {
  // VALIDATION
  const validationRules = z.object({
    email: zfd.text(z.string().email()),
    password: zfd.text(z.string().min(6)),
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
        email: errorFormatted.email?._errors,
        password: errorFormatted.password?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  try {
    const data = await auth.api.signInEmail({
      body: {
        email: validationResult.data.email,
        password: validationResult.data.password,
      },
    });

    if (!data.user) {
      return {
        error: {
          general: "Invalid email or password",
        },
      };
    }
  } catch (error: Error | any) {
    return {
      error: {
        general: error?.message || "Failed to login",
      },
    };
  }
  // END OF DATA PROCESSING

  // redirect if success
  redirect("/dashboard", RedirectType.replace);
}
