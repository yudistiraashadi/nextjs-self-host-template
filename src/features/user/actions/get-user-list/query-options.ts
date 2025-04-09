import { queryOptions } from "@tanstack/react-query";
import { getUserList, type SearchParams } from ".";

export const getUserListQueryOptions = (params: SearchParams = {}) =>
  queryOptions({
    queryKey: ["user", "list", params],
    queryFn: () => getUserList(params),
  });
