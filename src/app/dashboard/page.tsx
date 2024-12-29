import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { authGuard } from "@/features/user/guards/auth-guard";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }
  // END OF AUTH GUARD

  return (
    <DashboardSectionContainer>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
    </DashboardSectionContainer>
  );
}
