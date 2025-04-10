"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { deletePost } from "@/features/EXAMPLE-post/actions/delete-post";
import { getPostByIdQueryOptions } from "@/features/EXAMPLE-post/actions/get-post-by-id";
import {
  getPostListQueryOptions,
  type GetPostListParams,
  type GetPostListResponse,
} from "@/features/EXAMPLE-post/actions/get-post-list";
import { getPostListCountQueryOptions } from "@/features/EXAMPLE-post/actions/get-post-list-count";
import { CreateOrUpdatePostModalForm } from "@/features/EXAMPLE-post/components/create-or-update-post-modal-form";
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
  type MRT_PaginationState,
} from "mantine-react-table";
import Image from "next/image";
import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export function PostsTable() {
  const [selectedEditPost, setSelectedEditPost] = useState<
    GetPostListResponse[number] | undefined
  >();

  // selected post id for DELETE POST and CREATE POST
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

  // Pagination and search state
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = useState<string | undefined>();
  const [columnFilters, setColumnFilters] = useState<
    GetPostListParams["columnFilters"]
  >([]);
  const [sorting, setSorting] = useState<GetPostListParams["sorting"]>([]);

  const [isOpen, { open, close }] = useDisclosure(false, {
    onClose: () => setSelectedEditPost(undefined),
  });

  // QUERY DATA
  const queryClient = useQueryClient();

  const postListQuery = useQuery(
    getPostListQueryOptions({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: globalFilter,
      columnFilters,
      sorting,
    }),
  );

  const postListCountQuery = useQuery(
    getPostListCountQueryOptions({
      search: globalFilter,
      columnFilters,
    }),
  );
  // END QUERY DATA

  // DELETE POST
  const [deletePostState, deletePostAction] = useActionState(
    deletePost,
    undefined,
  );

  const renderDeletePostModal = useCallback(
    (postId: string) => {
      setSelectedPostId(postId);

      modals.open({
        modalId: "delete-post",
        title: "Delete Post",
        centered: true,
        children: (
          <>
            <div className="text-sm">
              Are you sure you want to delete this post?
            </div>

            <form
              action={(formData) => {
                formData.set("id", postId);

                deletePostAction(formData);
              }}
              className="mt-6"
            >
              <div className="flex gap-2">
                <Button
                  variant="default"
                  color="gray"
                  onClick={() => modals.close("delete-post")}
                >
                  Cancel
                </Button>
                <SubmitButton color={"red"}>Delete</SubmitButton>
              </div>
            </form>
          </>
        ),
      });
    },
    [deletePostAction],
  );

  const deletePostEffectEvent = useEffectEvent(
    (state: typeof deletePostState) => {
      if (state) {
        formStateNotificationHelper({
          state,
          successCallback: () => {
            modals.close("delete-post");

            queryClient.invalidateQueries({
              queryKey: ["post", "list"],
            });

            if (selectedPostId) {
              queryClient.removeQueries(
                getPostByIdQueryOptions({ id: selectedPostId }),
              );

              setSelectedPostId(undefined);
            }
          },
        });
      }
    },
  );

  useEffect(
    () => deletePostEffectEvent(deletePostState),
    [deletePostState, deletePostEffectEvent],
  );
  // END OF DELETE POST

  const columns = useMemo<MRT_ColumnDef<GetPostListResponse[number]>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        filterFn: "contains",
      },
      {
        accessorKey: "content",
        header: "Content",
        filterFn: "contains",
      },
      {
        accessorKey: "image",
        header: "Image",
        filterFn: "contains",
        enableColumnFilter: false,
        Cell: ({ row }) =>
          row.original.image ? (
            <Image
              src={row.original.image}
              alt={row.original.title}
              width={100}
              height={75}
              style={{ objectFit: "cover" }}
            />
          ) : null,
      },
      {
        accessorKey: "createdAt",
        header: "Date Created",
        filterFn: "contains",
        Cell: ({ row }) => (
          <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
        ),
      },
      {
        accessorKey: "isProtected",
        header: "Protection",
        filterFn: "equals",
        filterVariant: "select",
        enableGlobalFilter: true,
        enableColumnFilterModes: false,
        mantineFilterSelectProps: {
          data: [
            { value: "true", label: "Protected" },
            { value: "false", label: "Public" },
          ],
        },
        Cell: ({ row }) => (
          <div>
            {row.original.isProtected ? (
              <Badge color="red">Protected</Badge>
            ) : (
              <Badge color="green">Public</Badge>
            )}
          </div>
        ),
      },
      {
        header: "Action",
        size: 100,
        Cell: ({ row }) => (
          <div className="flex flex-col gap-2">
            <Button
              color="green"
              onClick={() => {
                setSelectedEditPost(row.original);
                open();
              }}
            >
              Edit
            </Button>
            <Button
              color="red"
              onClick={() => renderDeletePostModal(row.original.id)}
            >
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [open, setSelectedEditPost, renderDeletePostModal],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: postListQuery,
    }),
    columns,
    data: postListQuery.data ?? [],
    manualPagination: true,
    manualFiltering: true,
    enableGlobalFilter: true,
    rowCount: postListCountQuery.data ?? 0,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: (updater) => {
      setColumnFilters(updater as GetPostListParams["columnFilters"]);
    },
    onSortingChange: (updater) => {
      setSorting(updater as GetPostListParams["sorting"]);
    },
    state: {
      columnFilters,
      sorting,
      pagination,
      globalFilter,
      isLoading: postListQuery.isPending,
      showAlertBanner: postListQuery.isError,
      showProgressBars: postListQuery.isFetching,
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
          Add Post
        </Button>
      </div>

      <MantineReactTable table={tableHookRef.current} />

      {isOpen ? (
        <CreateOrUpdatePostModalForm
          isOpen={isOpen}
          onClose={close}
          postData={selectedEditPost}
        />
      ) : null}
    </section>
  );
}
