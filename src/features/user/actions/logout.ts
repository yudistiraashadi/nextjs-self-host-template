"use server";

import { auth } from "@/auth";
import { headers } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/", RedirectType.replace);
}
