import { runParallelAction } from "@/lib/utils/next-server-action-parallel";
import { queryOptions } from "@tanstack/react-query";
import { getUserList, type SearchParams } from ".";

export const getUserListQueryOptions = (params: SearchParams = {}) =>
  queryOptions({
    queryKey: ["user", "list", params],
    queryFn: () => runParallelAction(getUserList(params)),
  });
