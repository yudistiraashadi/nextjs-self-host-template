import { HomeAppshell } from "@/components/appshell/home-appshell";
import { authGuard } from "@/features/user/guards/auth-guard";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await authGuard();

  return <HomeAppshell userData={currentUser}>{children}</HomeAppshell>;
}
