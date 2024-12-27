import { DashboardAppshell } from "@/components/appshell/dashboard-appshell";
import { authGuard } from "@/features/user/guards/auth-guard";
import { tryCatchAsync } from "@/lib/utils/try-catch-async";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AUTH GUARD
  const [userData, userError] = await tryCatchAsync(authGuard());

  if (!userData || userError) {
    return redirect("/");
  }
  // END OF AUTH GUARD

  return <DashboardAppshell userData={userData}>{children}</DashboardAppshell>;
}
