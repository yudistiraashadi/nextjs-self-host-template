"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { UnifyIntersection } from "@/lib/types";
import { Button, ButtonProps } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";

type BackButtonProps = UnifyIntersection<
  ButtonProps & {
    children?: React.ReactNode;
    confirmation?: boolean;
    href?: string;
  }
>;

/**
 * Back Button
 *
 * @param param0
 * @returns
 */
export function BackButton({
  children = "Kembali",
  variant = "transparent",
  confirmation = false,
  href,
  ...buttonProps
}: BackButtonProps) {
  const router = useRouter();

  if (href) {
    return (
      <Button
        component={Link}
        variant={variant}
        href={href}
        leftSection={<IconArrowLeft size={14} />}
        p={0}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  } else {
    const handleClick = () => {
      if (
        confirmation &&
        !confirm("Are you sure you want to leave this page?")
      ) {
        return;
      }

      router.back();
    };

    return (
      <Button
        variant={variant}
        leftSection={<IconArrowLeft size={14} />}
        p={0}
        onClick={handleClick}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  }
}
