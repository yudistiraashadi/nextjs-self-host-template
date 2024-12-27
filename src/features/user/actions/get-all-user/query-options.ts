import { queryOptions } from "@tanstack/react-query";
import { getAllUser } from ".";

export const getAllUserQueryOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => getAllUser(),
  });
