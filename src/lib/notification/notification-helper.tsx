"use client";

import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconX } from "@tabler/icons-react";
import { ReactNode } from "react";

type NotificationHelperProps = {
  type: "success" | "error" | "info" | "warning";
  message: ReactNode;
  title?: ReactNode;
  callback?: () => void;
};

type FormStateNotificationHelperProps = {
  state:
    | {
        error: {
          general: ReactNode;
        };
        message?: undefined;
      }
    | {
        message: ReactNode;
        error?: undefined;
      };
  successCallback?: () => void;
};

/**
 * Notification helper
 *
 * @returns
 */
export function notificationHelper({
  type = "info",
  message,
  title,
  callback,
}: NotificationHelperProps) {
  let icon: ReactNode = <></>;
  let color = "";

  switch (type) {
    case "success":
      icon = <IconCheck />;
      color = "green";
      title = title ?? "Success";
      break;

    case "error":
      icon = <IconX />;
      color = "red";
      title = title ?? "Error";
      break;

    case "warning":
      icon = <IconExclamationMark />;
      color = "yellow";
      title = title ?? "Warning";
      break;

    case "info":
    default:
      color = "blue";
      title = title ?? "Info";
      break;
  }

  notifications.show({
    title,
    message,
    color,
    icon,
  });

  if (callback) {
    callback();
  }
}

/**
 * Form state notification helper
 *
 * @returns
 */
export function formStateNotificationHelper({
  state,
  successCallback,
}: FormStateNotificationHelperProps) {
  if (state?.error?.general) {
    notificationHelper({
      type: "error",
      message: state.error.general,
    });
  }

  if (state?.message) {
    notificationHelper({
      type: "success",
      message: state.message,
    });

    if (successCallback) {
      successCallback();
    }
  }
}
