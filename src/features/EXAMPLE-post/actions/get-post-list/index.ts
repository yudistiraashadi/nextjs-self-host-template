import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getPostListFunction } from "./function";

export const postListValidColumns = [
  "title",
  "content",
  "isProtected",
] as const;

export type GetPostListParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  columnFilters?: {
    id: (typeof postListValidColumns)[number];
    value: string;
  }[];
  sorting?: {
    id: (typeof postListValidColumns)[number];
    desc: boolean;
  }[];
};

export const getPostListParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.enum(postListValidColumns), value: z.string() }))
    .optional(),
  sorting: z
    .array(z.object({ id: z.enum(postListValidColumns), desc: z.boolean() }))
    .optional(),
});

export type GetPostListResponse = Awaited<
  ReturnType<typeof getPostListFunction>
>;

// SERVER API
export const getPostList = createServerApi<
  GetPostListParams,
  GetPostListResponse
>({
  function: getPostListFunction,
  path: "/post/get-post-list",
  inputSchema: getPostListParamsSchema,
});

// TANSTACK QUERY OPTIONS
export const getPostListQueryOptions = (params: GetPostListParams = {}) =>
  queryOptions({
    queryKey: ["post", "list", params],
    queryFn: () => getPostList(params),
  });
