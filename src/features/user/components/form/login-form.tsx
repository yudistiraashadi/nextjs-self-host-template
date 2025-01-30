"use client";

import { login } from "@/features/user/actions/login";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { startTransition, useActionState } from "react";

export function LoginForm() {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    login,
    undefined,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          actionDispatch(new FormData(e.currentTarget));
        });
      }}
      className="mt-8 rounded-lg border border-gray-200 p-8 shadow-md"
    >
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}

      <TextInput
        label="Username"
        name="username"
        required
        error={actionState?.error.username}
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
  );
}
