import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { getUserListFunction } from "./function";
import { getUserListParamsSchema, userListValidColumns } from "./util";

export type GetUserListParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  columnFilters?: {
    id: (typeof userListValidColumns)[number];
    value: string;
  }[];
  sorting?: {
    id: (typeof userListValidColumns)[number];
    desc: boolean;
  }[];
};

export type GetUserListResponse = Awaited<
  ReturnType<typeof getUserListFunction>
>;

// SERVER API
export const getUserList = createServerApi<
  GetUserListParams,
  GetUserListResponse
>({
  function: getUserListFunction,
  path: "/user/get-user-list",
  inputSchema: getUserListParamsSchema,
});

// TANSTACK QUERY OPTIONS
export const getUserListQueryOptions = (params: GetUserListParams = {}) =>
  queryOptions({
    queryKey: ["user", "list", params],
    queryFn: () => getUserList(params),
  });
