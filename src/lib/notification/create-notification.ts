"use server";

import { cookies } from "next/headers";

type createNotificationActionProps = {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  title?: string;
};

export async function createNotification({
  type = "info",
  message,
  title,
}: createNotificationActionProps) {
  const cookieStore = await cookies();

  cookieStore.set("notification-type", type);
  cookieStore.set("notification-message", message);

  if (title) {
    cookieStore.set("notification-title", title);
  }
}
