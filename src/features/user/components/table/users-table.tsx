"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { activateUser } from "@/features/user/actions/activate-user";
import { deactivateUser } from "@/features/user/actions/deactivate-user";
import { type GetAllUserResponse } from "@/features/user/actions/get-all-user";
import { getAllUserQueryOptions } from "@/features/user/actions/get-all-user/query-options";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id/query-options";
import { CreateOrUpdateUserModalForm } from "@/features/user/components/form/create-or-update-user-modal-form";
import { roleBadgeColor } from "@/features/user/constants";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Badge, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export function UsersTable() {
  const [selectedEditUser, setSelectedEditUser] = useState<
    GetAllUserResponse[number] | undefined
  >();

  // selected user id for DEACTIVATE USER and ACTIVATE USER
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  const [isOpen, { open, close }] = useDisclosure(false, {
    onClose: () => setSelectedEditUser(undefined),
  });

  // QUERY DATA
  const queryClient = useQueryClient();
  const allUserQuery = useQuery(getAllUserQueryOptions());

  // DEACTIVATE USER
  const [deactivateUserState, deactivateUserAction] = useActionState(
    deactivateUser,
    undefined,
  );

  const renderDeactivateUserModal = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);

      modals.open({
        modalId: "deactivate-user",
        title: "Non Aktifkan User",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Apakah kamu yakin untuk Non Aktifkan User ini?
            </div>

            <form
              action={(formData) => {
                formData.set("id", userId);

                deactivateUserAction(formData);
              }}
              className="mt-6"
            >
              <div className="flex gap-2">
                <Button
                  variant="default"
                  color="gray"
                  onClick={() => modals.close("deactivate-user")}
                >
                  Batal
                </Button>
                <SubmitButton color={"red"}>Non Aktifkan</SubmitButton>
              </div>
            </form>
          </>
        ),
      });
    },
    [deactivateUserAction],
  );

  const deactivateUserEffectEvent = useEffectEvent(
    (state: typeof deactivateUserState) => {
      if (state) {
        formStateNotificationHelper({
          state,
          successCallback: () => {
            modals.close("deactivate-user");

            queryClient.invalidateQueries(getAllUserQueryOptions());

            if (selectedUserId) {
              queryClient.removeQueries(
                getUserByIdQueryOptions(selectedUserId),
              );

              setSelectedUserId(undefined);
            }
          },
        });
      }
    },
  );

  useEffect(
    () => deactivateUserEffectEvent(deactivateUserState),
    [deactivateUserState, deactivateUserEffectEvent],
  );
  // END OF DEACTIVATE USER

  // ACTIVATE USER
  const [activateUserState, activateUserAction] = useActionState(
    activateUser,
    undefined,
  );

  const renderActivateUserModal = useCallback(
    (userId: string) => {
      setSelectedUserId(userId);

      modals.open({
        modalId: "activate-user",
        title: "Aktifkan User",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Apakah kamu yakin untuk aktifkan user ini?
            </div>

            <form
              action={(formData) => {
                formData.set("id", userId);

                activateUserAction(formData);
              }}
              className="mt-6"
            >
              <div className="flex gap-2">
                <Button
                  variant="default"
                  color="gray"
                  onClick={() => modals.close("activate-user")}
                >
                  Batal
                </Button>
                <SubmitButton color="green">Aktifkan</SubmitButton>
              </div>
            </form>
          </>
        ),
      });
    },
    [activateUserAction],
  );

  const activateUserEffectEvent = useEffectEvent(
    (state: typeof activateUserState) => {
      if (state) {
        formStateNotificationHelper({
          state,
          successCallback: () => {
            modals.close("activate-user");

            queryClient.invalidateQueries(getAllUserQueryOptions());

            if (selectedUserId) {
              queryClient.removeQueries(
                getUserByIdQueryOptions(selectedUserId),
              );

              setSelectedUserId(undefined);
            }
          },
        });
      }
    },
  );

  useEffect(
    () => activateUserEffectEvent(activateUserState),
    [activateUserState, activateUserEffectEvent],
  );
  // END OF ACTIVATE USER

  const columns = useMemo<MRT_ColumnDef<GetAllUserResponse[number]>[]>(
    () => [
      {
        accessorKey: "username",
        header: "Username",
        filterFn: "contains",
      },
      {
        accessorKey: "name",
        header: "Nama",
        filterFn: "contains",
      },
      {
        id: "userRole",
        accessorFn: (row) => row.userRole?.map((role) => role.name).join(", "),
        header: "Role",
        filterFn: "contains",
        filterVariant: "multi-select",
        enableColumnFilterModes: false,
        mantineFilterSelectProps: {
          data: [
            { value: "super admin", label: "Super Admin" },
            { value: "user", label: "User" },
          ],
        },
        enableGlobalFilter: true,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            {row.original.userRole?.map((role) => (
              <Badge
                key={role.id}
                color={roleBadgeColor.get(role.id) ?? "green"}
              >
                {role.name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => (row.deletedAt ? "Non Aktif" : "Aktif"),
        header: "Status",
        filterFn: "equals",
        filterVariant: "select",
        enableColumnFilterModes: false,
        mantineFilterSelectProps: {
          data: [
            { value: "Aktif", label: "Aktif" },
            { value: "Non Aktif", label: "Non Aktif" },
          ],
        },
        enableGlobalFilter: true,
        Cell: ({ row }) => (
          <div>
            {row.original.deletedAt ? (
              <Badge color="red">Non Aktif</Badge>
            ) : (
              <Badge color="green">Aktif</Badge>
            )}
          </div>
        ),
      },
      {
        header: "Action",
        size: 100,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            {row.original.deletedAt ? (
              <Button
                color="green"
                onClick={() => renderActivateUserModal(row.original.id)}
                className="btn btn-sm btn-danger"
              >
                Aktifkan
              </Button>
            ) : (
              <>
                <Button
                  color="green"
                  onClick={() => {
                    setSelectedEditUser(row.original);
                    open();
                  }}
                  className="btn btn-sm btn-danger"
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  onClick={() => renderDeactivateUserModal(row.original.id)}
                  className="btn btn-sm btn-danger"
                >
                  Non Aktifkan
                </Button>
              </>
            )}
          </div>
        ),
      },
    ],
    [
      open,
      setSelectedEditUser,
      renderActivateUserModal,
      renderDeactivateUserModal,
    ],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: allUserQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: allUserQuery.data ?? [],
  });

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <Button color="blue" onClick={open} leftSection={<IconPlus />}>
          Tambah User
        </Button>
      </div>

      <MantineReactTable table={table} />

      {isOpen ? (
        <CreateOrUpdateUserModalForm
          isOpen={isOpen}
          onClose={close}
          userData={selectedEditUser}
        />
      ) : null}
    </section>
  );
}
