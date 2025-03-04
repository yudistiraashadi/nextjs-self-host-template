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
  const [currentUser, currentUserError] = await tryCatchAsync(authGuard());

  if (!currentUser || currentUserError) {
    return redirect("/");
  }

  const userData = currentUser;
  // END OF AUTH GUARD

  return <DashboardAppshell userData={userData}>{children}</DashboardAppshell>;
}
