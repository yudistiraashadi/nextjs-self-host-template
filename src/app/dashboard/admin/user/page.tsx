import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllUserRoleQueryOptions } from "@/features/user/actions/get-all-user-role/query-options";
import { getAllUserQueryOptions } from "@/features/user/actions/get-all-user/query-options";
import { UsersTable } from "@/features/user/components/table/users-table";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
};

export default async function AdminUser() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getAllUserRoleQueryOptions()),
    queryClient.prefetchQuery(getAllUserQueryOptions()),
  ]);

  return (
    <DashboardSectionContainer>
      <h2 className="text-2xl font-semibold">User</h2>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <UsersTable />
      </HydrationBoundary>
    </DashboardSectionContainer>
  );
}
