import { HomeAppshell } from "@/components/appshell/home-appshell";
import { authGuard } from "@/features/user/guards/auth-guard";
import { tryCatchAsync } from "@/lib/utils/try-catch-async";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser] = await tryCatchAsync(authGuard());

  return <HomeAppshell userData={currentUser}>{children}</HomeAppshell>;
}
