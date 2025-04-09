"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { activateUser } from "@/features/user/actions/activate-user";
import { deactivateUser } from "@/features/user/actions/deactivate-user";
import { getUserByIdQueryOptions } from "@/features/user/actions/get-user-by-id/query-options";
import { type GetUserListResponse } from "@/features/user/actions/get-user-list";
import { getUserListCountQueryOptions } from "@/features/user/actions/get-user-list-count/query-options";
import { getUserListQueryOptions } from "@/features/user/actions/get-user-list/query-options";
import { CreateOrUpdateUserModalForm } from "@/features/user/components/create-or-update-user-modal-form";
import { userRoleBadgeColor } from "@/features/user/constants";
import { useEffectEvent } from "@/lib/hooks/use-effect-event";
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
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export function UsersTable() {
  const [selectedEditUser, setSelectedEditUser] = useState<
    GetUserListResponse[number] | undefined
  >();

  // selected user id for DEACTIVATE USER and ACTIVATE USER
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  // Pagination and search state
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState<string | undefined>();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const [isOpen, { open, close }] = useDisclosure(false, {
    onClose: () => setSelectedEditUser(undefined),
  });

  // QUERY DATA
  const queryClient = useQueryClient();

  const userListQuery = useQuery(
    getUserListQueryOptions({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: globalFilter,
      columnFilters,
      sorting,
    }),
  );

  const userListCountQuery = useQuery(
    getUserListCountQueryOptions({
      search: globalFilter,
      columnFilters,
    }),
  );
  // END QUERY DATA

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
        title: "Deactivate User",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Are you sure you want to deactivate this user?
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
                  Cancel
                </Button>
                <SubmitButton color={"red"}>Deactivate</SubmitButton>
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

            queryClient.invalidateQueries({
              queryKey: ["user", "list"],
            });

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
        title: "Activate User",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Are you sure you want to activate this user?
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
                  Cancel
                </Button>
                <SubmitButton color="green">Activate</SubmitButton>
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

            queryClient.invalidateQueries({
              queryKey: ["user", "list"],
            });

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

  const columns = useMemo<MRT_ColumnDef<GetUserListResponse[number]>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        filterFn: "contains",
      },
      {
        accessorKey: "name",
        header: "Name",
        filterFn: "contains",
      },
      {
        id: "role",
        accessorFn: (row) => row.role ?? "user",
        header: "Role",
        filterFn: "equals",
        filterVariant: "select",
        enableGlobalFilter: true,
        enableColumnFilterModes: false,
        mantineFilterSelectProps: {
          data: [
            { value: "admin", label: "Admin" },
            { value: "user", label: "User" },
          ],
        },
        Cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <Badge
              color={
                userRoleBadgeColor.get(row.original.role ?? "user") ?? "blue"
              }
            >
              {row.original.role}
            </Badge>
          </div>
        ),
      },
      {
        id: "status",
        accessorFn: (row) => (row.banned ? "Non Active" : "Active"),
        header: "Status",
        filterFn: "equals",
        filterVariant: "select",
        enableGlobalFilter: true,
        enableColumnFilterModes: false,
        mantineFilterSelectProps: {
          data: [
            { value: "Active", label: "Active" },
            { value: "Non Active", label: "Non Active" },
          ],
        },
        Cell: ({ row }) => (
          <div>
            {row.original.banned ? (
              <Badge color="red">Non Active</Badge>
            ) : (
              <Badge color="green">Active</Badge>
            )}
          </div>
        ),
      },
      {
        header: "Action",
        size: 100,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            {row.original.banned ? (
              <Button
                color="green"
                onClick={() => renderActivateUserModal(row.original.id)}
                className="btn btn-sm btn-danger"
              >
                Activate
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
                  Deactivate
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
      queryResult: userListQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: userListQuery.data ?? [],
    manualPagination: true,
    manualFiltering: true,
    enableGlobalFilter: true,
    rowCount: userListCountQuery.data ?? 0,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater as MRT_ColumnFiltersState);
    },
    onSortingChange: (updater) => {
      setSorting(updater as MRT_SortingState);
    },
    state: {
      columnFilters,
      sorting,
      pagination,
      globalFilter,
      isLoading: userListQuery.isPending,
      showAlertBanner: userListQuery.isError,
      showProgressBars: userListQuery.isFetching,
    },
  });

  /**
   * do this to prevent React Compiler auto optimize
   * which will cause the table to not re-render after the data is updated
   * ref: https://github.com/TanStack/table/issues/5567
   * ref: https://github.com/TanStack/virtual/issues/743
   */
  const tableHookRef = useRef(table);

  return (
    <section className="space-y-4">
      <div className="flex justify-end">
        <Button color="blue" onClick={open} leftSection={<IconPlus />}>
          Add User
        </Button>
      </div>

      <MantineReactTable table={tableHookRef.current} />

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
