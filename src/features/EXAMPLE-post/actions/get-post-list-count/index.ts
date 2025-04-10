import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { postListValidColumns, type GetPostListParams } from "../get-post-list";
import { getPostListCountFunction } from "./function";

export type GetPostListCountParams = Pick<
  GetPostListParams,
  "search" | "columnFilters"
>;
export const getPostListCountParamsSchema = z.object({
  search: z.string().optional(),
  columnFilters: z
    .array(z.object({ id: z.enum(postListValidColumns), value: z.string() }))
    .optional(),
});

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
