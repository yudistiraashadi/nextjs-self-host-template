import { queryOptions } from "@tanstack/react-query";
import { getUserList, type GetUserListParams } from ".";

export const getUserListQueryOptions = (params: GetUserListParams = {}) =>
  queryOptions({
    queryKey: ["user", "list", params],
    queryFn: () => getUserList(params),
  });
