import { queryOptions } from "@tanstack/react-query";
import { getUserById } from ".";

export const getUserByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: [
      "user",
      {
        id: id,
      },
    ],
    queryFn: () => getUserById(id),
  });
