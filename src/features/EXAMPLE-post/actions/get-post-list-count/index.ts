import { type GetPostListParams } from "@/features/EXAMPLE-post/actions/get-post-list";
import { getPostListCountParamsSchema } from "@/features/EXAMPLE-post/actions/get-post-list-count/util";
import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { getPostListCountFunction } from "./function";

export type GetPostListCountParams = Pick<
  GetPostListParams,
  "search" | "columnFilters"
>;

export type GetPostListCountResponse = Awaited<
  ReturnType<typeof getPostListCountFunction>
>;

// SERVER API
export const getPostListCount = createServerApi<
  GetPostListCountParams,
  GetPostListCountResponse
>({
  function: getPostListCountFunction,
  path: "/post/get-post-list-count",
  inputSchema: getPostListCountParamsSchema,
});

// TANSTACK QUERY OPTIONS
export const getPostListCountQueryOptions = (
  params: GetPostListCountParams = {},
) =>
  queryOptions({
    queryKey: ["post", "list", "count", params],
    queryFn: () => getPostListCount(params),
  });
