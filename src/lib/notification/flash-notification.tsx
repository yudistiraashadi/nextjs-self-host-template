import { FlashNotificationClient } from "@/lib/notification/flash-notification-client";
import { cookies } from "next/headers";

export async function FlashNotification() {
  const cookieStore = await cookies();

  const message = cookieStore.get("notification-message")?.value;
  const type = cookieStore.get("notification-type")?.value;
  const title = cookieStore.get("notification-title")?.value;

  return (
    <FlashNotificationClient message={message} title={title} type={type} />
  );
}
