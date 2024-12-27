"use client";

import { createUser } from "@/features/user/actions/create-user";
import { getAllUserRoleQueryOptions } from "@/features/user/actions/get-all-user-role/query-options";
import { getAllUserQueryOptions } from "@/features/user/actions/get-all-user/query-options";
import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id/query-options";
import { updateUser } from "@/features/user/actions/update-user";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  Divider,
  Modal,
  MultiSelect,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";

type CreateOrUpdateUserModalFormProps = {
  userData?: GetUserByIdResponse | null;
  isOpen: boolean;
  onClose: () => void;
  successCallback?: () => void;
};

export function CreateOrUpdateUserModalForm({
  userData,
  isOpen,
  onClose,
  successCallback,
}: CreateOrUpdateUserModalFormProps) {
  // QUERY DATA
  const queryClient = useQueryClient();

  const userRoleData = useQuery(getAllUserRoleQueryOptions());
  // END QUERY DATA

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
          queryClient.invalidateQueries(getAllUserQueryOptions());

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
          defaultValue={
            userData?.userRole?.map((role) => role.id.toString()) ?? ["1"]
          }
          data={userRoleData.data?.map((role) => ({
            value: role.id.toString(),
            label: role.name,
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

        {/* username */}
        <TextInput
          required
          label="Username"
          name="username"
          error={actionState?.error?.username}
          defaultValue={userData?.username ?? ""}
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
            Simpan
          </Button>
        </div>
      </form>
    </Modal>
  );
}
