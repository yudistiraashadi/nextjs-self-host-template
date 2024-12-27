"use server";

import { cookies } from "next/headers";

export async function deleteNotification() {
  const cookieStore = await cookies();

  cookieStore.delete("notification-type");
  cookieStore.delete("notification-message");
  cookieStore.delete("notification-title");
}
