import { queryOptions } from "@tanstack/react-query";
import { getUserListCount, type CountSearchParams } from ".";

export const getUserListCountQueryOptions = (params: CountSearchParams = {}) =>
  queryOptions({
    queryKey: ["user", "list", "count", params],
    queryFn: () => getUserListCount(params),
  });
