"use client";

import { logout } from "@/features/user/actions/logout";
import type { AuthGuardResponse } from "@/features/user/guards/auth-guard";
import { AppShell, Button, Group, Menu } from "@mantine/core";
import { IconUserCircle } from "@tabler/icons-react";
import Link from "next/link";

export function HomeAppshell({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData?: AuthGuardResponse | null;
}) {
  return (
    <AppShell header={{ height: 60 }} padding="xs">
      {/* header */}
      <AppShell.Header>
        <Group h="100%" px="md">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-center space-x-4">
              Logo
            </div>

            {/* user avatar */}
            <div className="flex items-center space-x-1">
              {userData ? (
                <Menu width={150} shadow="md" trigger="click-hover">
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      color="dark"
                      leftSection={<IconUserCircle stroke={1.5} />}
                      px={"0.25rem"}
                    >
                      <div className="text-sm font-semibold">
                        {userData.user.name}
                      </div>
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item component={Link} href="/dashboard">
                      Dashboard
                    </Menu.Item>

                    <Menu.Divider />

                    <form action={logout}>
                      <Menu.Item type="submit" color="red">
                        Logout
                      </Menu.Item>
                    </form>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  variant="filled"
                  color="blue"
                >
                  Login
                </Button>
              )}
            </div>
            {/* end of user avatar */}
          </div>
        </Group>
      </AppShell.Header>
      {/* end of header */}

      <AppShell.Main className="bg-gray-100 pb-20 dark:bg-inherit">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
