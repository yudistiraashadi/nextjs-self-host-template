import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getUserListFunction } from "./function";

export const userListValidColumns = [
  "name",
  "email",
  "role",
  "status",
] as const;

const getUserListParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.enum(userListValidColumns), value: z.string() }))
    .optional(),
  sorting: z
    .array(z.object({ id: z.enum(userListValidColumns), desc: z.boolean() }))
    .optional(),
});

export type GetUserListParams = z.input<typeof getUserListParamsSchema>;

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
