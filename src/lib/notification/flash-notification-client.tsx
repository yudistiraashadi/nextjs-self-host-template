"use client";

import { deleteNotification } from "@/lib/notification/delete-notification";
import { notificationHelper } from "@/lib/notification/notification-helper";
import { useEffect } from "react";

type FlashNotificationClientProps = {
  message?: string;
  type?: string;
  title?: string;
};

export function FlashNotificationClient({
  message,
  type,
  title,
}: FlashNotificationClientProps) {
  useEffect(() => {
    if (!!message) {
      notificationHelper({
        type: type as any,
        message,
        title,
      });

      deleteNotification();
    }
  }, [message, title, type]);

  return null;
}
