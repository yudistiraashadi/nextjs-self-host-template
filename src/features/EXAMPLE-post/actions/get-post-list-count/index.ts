import { postListValidColumns } from "@/features/EXAMPLE-post/actions/get-post-list";
import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getPostListCountFunction } from "./function";

const getPostListCountParamsSchema = z.object({
  search: z.string().optional(),
  columnFilters: z
    .array(z.object({ id: z.enum(postListValidColumns), value: z.string() }))
    .optional(),
});

export type GetPostListCountParams = z.input<
  typeof getPostListCountParamsSchema
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
