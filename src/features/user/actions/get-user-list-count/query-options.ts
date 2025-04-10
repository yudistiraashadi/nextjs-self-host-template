import { runParallelAction } from "@/lib/utils/next-server-action-parallel";
import { queryOptions } from "@tanstack/react-query";
import { getUserListCount, type GetUserListCountParams } from ".";

export const getUserListCountQueryOptions = (
  params: GetUserListCountParams = {},
) =>
  queryOptions({
    queryKey: ["user", "list", "count", params],
    queryFn: () => runParallelAction(getUserListCount(params)),
  });
