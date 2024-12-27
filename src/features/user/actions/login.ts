"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { and, eq, isNull } from "drizzle-orm";
import { permanentRedirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function login(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      username: zfd.text(z.string().min(5)),
      password: zfd.text(z.string().min(6)),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        username: errorFormatted.username?._errors,
        password: errorFormatted.password?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  const userEmail = validationResult.data.username + "@email.com";
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  // Check if user exists based on username
  const [userData] = await db
    .select({
      id: authUsers.id,
      email: authUsers.email,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .where(and(isNull(userProfiles.deletedAt), eq(authUsers.email, userEmail)))
    .limit(1);

  if (!userData) {
    return {
      error: {
        general: "Akun tidak ditemukan.",
      },
    };
  }

  // login with supabase
  const { error } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: validationResult.data.password,
  });

  // supabase error
  if (error) {
    return {
      error: {
        general: error.message,
      },
    };
  }
  // END OF DATA PROCESSING

  // redirect if success
  permanentRedirect("/dashboard");
}
