"use client";

import { createUser } from "@/features/user/actions/create-user";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id/query-options";
import type { GetUserListResponse } from "@/features/user/actions/get-user-list";
import { updateUser } from "@/features/user/actions/update-user";
import { userRole } from "@/features/user/constants";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  Divider,
  Modal,
  MultiSelect,
  PasswordInput,
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
            queryClient.invalidateQueries(getUserByIdQueryOptions(userData.id));
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

            // apparently MultiSelect give the value as "value1, value2, value3, ...", so
            // we need to make array of userRolesString to userRoles
            if (formData.get("userRolesString")) {
              const userRolesArray = (
                formData.get("userRolesString") as string
              ).split(",");

              userRolesArray.forEach((role) => {
                formData.append("userRoles", role);
              });
            }

            actionDispatch(formData);
          });
        }}
        className="grid gap-4"
      >
        {/* user roles */}
        <MultiSelect
          label="Role"
          required
          name="userRolesString"
          error={actionState?.error?.userRoles}
          defaultValue={userData?.role?.split(",") ?? ["user"]}
          data={userRole.map((role) => ({
            value: role,
            label: role.charAt(0).toUpperCase() + role.slice(1),
          }))}
        />

        <Divider />

        {/* name */}
        <TextInput
          required
          label="Nama Lengkap"
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
            userData && "Kosongkan jika tidak ingin mengubah password"
          }
          error={actionState?.error?.password}
        />

        {/* password confirmation */}
        <PasswordInput
          label="Konfirmasi Password"
          name="passwordConfirmation"
          required={!userData}
          description={
            userData && "Kosongkan jika tidak ingin mengubah password"
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
