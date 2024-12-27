"use server";

import { createServerClient } from "@/db/supabase/server";
import { revalidateTag } from "next/cache";
import { permanentRedirect } from "next/navigation";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { getUserById } from "./get-user-by-id";
import { getUserByIdCacheKeyHashed } from "./get-user-by-id/cache-key";

export async function login(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      email: zfd.text(z.string().email()),
      password: zfd.text(z.string().min(6)),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        email: errorFormatted.username?._errors,
        password: errorFormatted.password?._errors,
      },
    };
  }
  // END OF VALIDATION

  // DATA PROCESSING
  const supabase = await createServerClient();

  // login with supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: validationResult.data.email,
    password: validationResult.data.password,
  });

  // supabase error
  if (!data || error) {
    return {
      error: {
        general: error?.message ?? "Something went wrong",
      },
    };
  }
  // END OF DATA PROCESSING

  revalidateTag(getUserByIdCacheKeyHashed(data.user.id));
  const userData = await getUserById(data.user.id);

  // redirect for admin
  if (
    userData.userRole.length > 0 &&
    userData.userRole.some((role) => role.id === 1)
  ) {
    permanentRedirect("/admin");
  }

  // redirect for user
  permanentRedirect("/");
}
