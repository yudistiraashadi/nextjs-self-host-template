import { type GetUserListParams } from "@/features/user/actions/get-user-list";
import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getUserListCountFunction } from "./function";

export type GetUserListCountParams = Omit<
  GetUserListParams,
  "page" | "pageSize"
>;

export const getUserListCountParamsSchema = z.object({
  search: z.string().optional(),
});

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
