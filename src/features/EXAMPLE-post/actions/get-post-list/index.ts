import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { getPostListFunction } from "./function";
import { getPostListParamsSchema, postListValidColumns } from "./util";

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
