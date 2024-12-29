"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { notificationHelper } from "./notification-helper";

/**
 * Notification component for search params
 *
 * @returns
 */
export function SearchParamsNotification() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const notificationType = searchParams.get("notification-type");
  const notificationMessage = searchParams.get("notification-message");
  const notificationTitle = searchParams.get("notification-title");

  useEffect(() => {
    if (notificationMessage) {
      notificationHelper({
        type: notificationType as any,
        message: notificationMessage,
        title: notificationTitle,
      });

      // Clear search params from notifications
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("notification-type");
      newSearchParams.delete("notification-message");
      newSearchParams.delete("notification-title");

      const searchParamsString = newSearchParams.toString();

      // update URL using web history API replacing the current entry
      window.history.replaceState(
        null,
        "",
        `${pathname}${searchParamsString ? `?${searchParamsString}` : ""}`,
      );
    }
  }, [notificationMessage, notificationTitle, notificationType]);

  return null;
}
