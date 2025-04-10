import { createServerApi } from "@/lib/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getUserListFunction } from "./function";

const validColumns = ["name", "email", "role", "status"] as const;

export type GetUserListParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  columnFilters?: {
    id: (typeof validColumns)[number];
    value: string;
  }[];
  sorting?: {
    id: (typeof validColumns)[number];
    desc: boolean;
  }[];
};

export const getUserListParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.enum(validColumns), value: z.string() }))
    .optional(),
  sorting: z
    .array(z.object({ id: z.enum(validColumns), desc: z.boolean() }))
    .optional(),
});

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
