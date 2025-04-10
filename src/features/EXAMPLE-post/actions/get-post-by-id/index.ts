import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getPostByIdFunction } from "./function";

export type GetPostByIdParams = { id: string };
export type GetPostByIdResponse = Awaited<
  ReturnType<typeof getPostByIdFunction>
>;

// SERVER API
export const getPostById = createServerApi<
  GetPostByIdParams,
  GetPostByIdResponse
>({
  function: getPostByIdFunction,
  path: "/post/get-post-by-id",
  inputSchema: z.object({
    id: z.string(),
  }),
});

// TANSTACK QUERY OPTIONS
export const getPostByIdQueryOptions = (params: GetPostByIdParams) =>
  queryOptions({
    queryKey: [
      "user",
      {
        id: params.id,
      },
    ],
    queryFn: () => getPostById(params),
  });
