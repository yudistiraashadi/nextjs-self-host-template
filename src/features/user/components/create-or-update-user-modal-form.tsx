"use client";

import { createUser } from "@/features/user/actions/create-user";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id";
import type { GetUserListResponse } from "@/features/user/actions/get-user-list";
import { updateUser } from "@/features/user/actions/update-user";
import { userRole } from "@/features/user/constants";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  Divider,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

export function CreateOrUpdateUserModalForm({
  userData,
  isOpen,
  onClose,
  successCallback,
}: {
  userData?: GetUserListResponse[number];
  isOpen: boolean;
  onClose: () => void;
  successCallback?: () => void;
}) {
  const queryClient = useQueryClient();

  // CREATE OR UPDATE USER
  const [actionState, actionDispatch, isActionPending] = useActionState(
    userData ? updateUser : createUser,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          onClose();

          // invalidate all user cache
          queryClient.invalidateQueries({
            queryKey: ["user", "list"],
          });

          // kalau update user, invalidate user yang bersangkutan
          if (userData) {
            queryClient.invalidateQueries(
              getUserByIdQueryOptions({ id: userData.id }),
            );
          }

          if (successCallback) {
            successCallback();
          }
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );
  // END CREATE OR UPDATE USER

  return (
    <Modal
      opened={isOpen}
      centered
      onClose={onClose}
      title={userData ? "Update User" : "Tambah User"}
      size={"xl"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();

          startTransition(() => {
            const formData = new FormData(e.currentTarget);

            if (userData) {
              formData.append("id", userData.id);
            }

            actionDispatch(formData);
          });
        }}
        className="grid gap-4"
      >
        {/* user roles */}
        <Select
          label="Role"
          required
          name="userRole"
          error={actionState?.error?.userRole}
          defaultValue={userData?.role ?? "user"}
          data={userRole.map((role) => ({
            value: role,
            label: role.charAt(0).toUpperCase() + role.slice(1),
          }))}
        />

        <Divider />

        {/* name */}
        <TextInput
          required
          label="Name"
          name="name"
          error={actionState?.error?.name}
          defaultValue={userData?.name ?? ""}
        />

        {/* email */}
        <TextInput
          required
          label="Email"
          name="email"
          error={actionState?.error?.email}
          defaultValue={userData?.email ?? ""}
        />

        <Divider />

        {/* password */}
        <PasswordInput
          label="Password"
          name="password"
          required={!userData}
          description={
            userData && "Leave blank if you don't want to change password"
          }
          error={actionState?.error?.password}
        />

        {/* password confirmation */}
        <PasswordInput
          label="Password Confirmation"
          name="passwordConfirmation"
          required={!userData}
          description={
            userData && "Leave blank if you don't want to change password"
          }
          error={actionState?.error?.passwordConfirmation}
        />

        <div className="mt-12 flex justify-end">
          <Button type="submit" loading={isActionPending}>
            {userData ? "Update" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
