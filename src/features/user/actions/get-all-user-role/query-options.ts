import { queryOptions } from "@tanstack/react-query";
import { getAllUserRole } from ".";

export const getAllUserRoleQueryOptions = () =>
  queryOptions({
    queryKey: ["user-role"],
    queryFn: () => getAllUserRole(),
    staleTime: Infinity,
  });
