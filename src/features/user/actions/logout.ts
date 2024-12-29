"use server";

import { createServerClient } from "@/db/supabase/server";
import { redirect, RedirectType } from "next/navigation";

export async function logout() {
  const supabase = await createServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  redirect("/", RedirectType.replace);
}
