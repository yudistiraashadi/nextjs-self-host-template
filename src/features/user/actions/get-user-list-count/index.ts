import { type GetUserListParams } from "@/features/user/actions/get-user-list";
import { getUserListCountParamsSchema } from "@/features/user/actions/get-user-list-count/util";
import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { getUserListCountFunction } from "./function";

export type GetUserListCountParams = Pick<
  GetUserListParams,
  "search" | "columnFilters"
>;

export type GetUserListCountResponse = Awaited<
  ReturnType<typeof getUserListCountFunction>
>;

// SERVER API
export const getUserListCount = createServerApi<
  GetUserListCountParams,
  GetUserListCountResponse
>({
  function: getUserListCountFunction,
  path: "/user/get-user-list-count",
  inputSchema: getUserListCountParamsSchema,
});

// TANSTACK QUERY OPTIONS
export const getUserListCountQueryOptions = (
  params: GetUserListCountParams = {},
) =>
  queryOptions({
    queryKey: ["user", "list", "count", params],
    queryFn: () => getUserListCount(params),
  });
