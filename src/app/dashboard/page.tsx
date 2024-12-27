import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { authGuard } from "@/features/user/guards/auth-guard";
import { tryCatchAsync } from "@/lib/utils/try-catch-async";
import { redirect } from "next/navigation";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // AUTH GUARD
  const [userData, userError] = await tryCatchAsync(authGuard());

  if (!userData || userError) {
    return redirect("/");
  }
  // END OF AUTH GUARD

  return (
    <DashboardSectionContainer>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
    </DashboardSectionContainer>
  );
}
