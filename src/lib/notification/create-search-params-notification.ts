import { type NotificationType } from "./types";

/**
 * Creates search parameters for notification messages in URLs
 * @param message - The notification message
 * @param title - The title of the notification
 * @param type - The type of notification (success, error, info, warning). Default is success
 * @returns URLSearchParams object with notification parameters
 */
export function createSearchParamsNotification({
  message,
  title,
  type = "success",
}: {
  message: string;
  title?: string;
  type?: NotificationType;
}): URLSearchParams {
  const searchParams = new URLSearchParams();

  searchParams.set("notification-message", message);
  searchParams.set("notification-type", type);

  if (title) {
    searchParams.set("notification-title", title);
  }

  return searchParams;
}
