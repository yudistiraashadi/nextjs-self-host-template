import { getPostListQueryOptions } from "@/features/EXAMPLE-post/actions/get-post-list";
import { getPostListCountQueryOptions } from "@/features/EXAMPLE-post/actions/get-post-list-count";
import { PostsTable } from "@/features/EXAMPLE-post/components/posts-table";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  const queryClient = getQueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(
      getPostListQueryOptions({
        page: 1,
        pageSize: 10,
        columnFilters: [],
        sorting: [],
      }),
    ),
    queryClient.prefetchQuery(
      getPostListCountQueryOptions({
        columnFilters: [],
      }),
    ),
  ]);

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold">Home</h2>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostsTable />
      </HydrationBoundary>
    </section>
  );
}
