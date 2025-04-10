import { queryOptions } from "@tanstack/react-query";
import { getUserById, type GetUserByIdParams } from ".";

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
