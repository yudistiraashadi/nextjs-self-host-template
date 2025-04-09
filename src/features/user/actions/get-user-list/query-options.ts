import { queryOptions } from "@tanstack/react-query";
import { getUserList, type SearchParams } from ".";

export const getUserListQueryOptions = (
  params: SearchParams = {
    search: "",
    page: 1,
    pageSize: 10,
  },
) =>
  queryOptions({
    queryKey: ["user", "list", params],
    queryFn: () => [getUserList(params)][0],
  });
