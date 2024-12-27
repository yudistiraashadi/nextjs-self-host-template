"use client";

import { login } from "@/features/user/functions/login";
import { Alert, Button, Modal, PasswordInput, TextInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { startTransition, useActionState } from "react";

export function LoginForm({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    login,
    undefined,
  );

  return (
    <Modal opened={isOpen} centered onClose={onClose} title={"Login"}>
      <form
        action={actionDispatch}
        onSubmit={(e) => {
          e.preventDefault();

          startTransition(() => {
            actionDispatch(new FormData(e.currentTarget));
          });
        }}
      >
        {actionState?.error?.general ? (
          <Alert
            variant="light"
            color="red"
            icon={<IconInfoCircle />}
            mb="1rem"
          >
            {actionState.error.general}
          </Alert>
        ) : null}

        <TextInput
          label="Email"
          name="email"
          required
          error={actionState?.error.email}
        />
        <PasswordInput
          label="Password"
          name="password"
          className="mt-4"
          required
          error={actionState?.error.password}
        />

        <Button
          type="submit"
          fullWidth
          className="mt-12"
          loading={isActionPending}
        >
          Login
        </Button>
      </form>
    </Modal>
  );
}
