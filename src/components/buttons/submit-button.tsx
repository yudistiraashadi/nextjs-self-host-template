"use client";

import { UnifyIntersection } from "@/lib/types";
import { Button, ButtonProps } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = UnifyIntersection<
  ButtonProps & {
    children?: React.ReactNode;
    formAction?: string | ((formData: FormData) => void) | undefined;
    onClick?: () => void;
  }
>;

/**
 * Submit button
 *
 * @param param0
 * @returns
 */
export function SubmitButton({
  children = "Submit",
  variant = "filled",
  formAction,
  onClick,
  loading,
  ...buttonProps
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const [isLoading, setIsLoading] = useState(loading);

  // loading state kita listen dari props luar. dari useFormStatus
  // kita listen saat pending = true saja, tidak peduli pas dia ganti jadi false
  useEffect(
    function loadingPropEffect() {
      setIsLoading(loading);
    },
    [loading],
  );

  useEffect(
    function pendingEffect() {
      // only listen to pending is true since bug in useFormStatus: https://github.com/facebook/react/issues/30368
      if (pending) {
        setIsLoading(true);

        // wait 30 seconds to reset the loading state
        const timeout = setTimeout(() => {
          setIsLoading(false);
        }, 30000);
      }
    },
    [pending],
  );

  return (
    <Button
      type="submit"
      variant={variant}
      loading={isLoading}
      {...buttonProps}
      formAction={formAction}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
