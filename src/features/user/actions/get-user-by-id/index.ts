import { createServerApi } from "@/server-api/create-server-api";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { getUserByIdFunction } from "./function";

export type GetUserByIdParams = { id: string };
export type GetUserByIdResponse = Awaited<
  ReturnType<typeof getUserByIdFunction>
>;

// SERVER API
export const getUserById = createServerApi<
  GetUserByIdParams,
  GetUserByIdResponse
>({
  function: getUserByIdFunction,
  path: "/user/get-user-by-id",
  inputSchema: z.object({
    id: z.string(),
  }),
});

// TANSTACK QUERY OPTIONS
export const getUserByIdQueryOptions = (params: GetUserByIdParams) =>
  queryOptions({
    queryKey: [
      "user",
      {
        id: params.id,
      },
    ],
    queryFn: () => getUserById(params),
  });
