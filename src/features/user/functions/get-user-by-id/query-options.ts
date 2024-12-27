import { queryOptions } from "@tanstack/react-query";
import { getUserById } from ".";
import { getUserByIdCacheKey } from "./cache-key";

export const getUserByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: getUserByIdCacheKey(id),
    queryFn: () => getUserById(id),
  });
