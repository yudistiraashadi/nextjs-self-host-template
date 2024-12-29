import { DashboardAppshell } from "@/components/appshell/dashboard-appshell";
import { authGuard } from "@/features/user/guards/auth-guard";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  return <DashboardAppshell userData={userData}>{children}</DashboardAppshell>;
}
