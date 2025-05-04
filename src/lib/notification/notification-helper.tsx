"use client";

import { ReactNode } from "react";
import { toast } from "sonner";

type NotificationHelperProps = {
  type: "success" | "error";
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
  type = "success",
  message,
  title,
  callback,
}: NotificationHelperProps) {
  if (type === "success") {
    toast.success(title, {
      description: message,
    });
  } else if (type === "error") {
    toast.error(title, {
      description: message,
    });
  }

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
