"use client";

import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { logout } from "@/features/user/actions/logout";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  Menu,
  NavLink,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHome, IconUserCircle, IconUsersGroup } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardAppshellProps = {
  children: React.ReactNode | React.ReactNode[];
  userData: GetUserByIdResponse;
};

export function DashboardAppshell({
  children,
  userData,
}: DashboardAppshellProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const isUserAdminValue = isUserAdmin(userData);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "lg", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-center space-x-4">
              {/* burger menu and brand logo */}
              <div className="flex items-center space-x-2">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="lg"
                  size="sm"
                />

                <UnstyledButton hiddenFrom="lg" onClick={toggle}>
                  Logo Mobile
                </UnstyledButton>

                <Box visibleFrom="lg">Logo Desktop</Box>
              </div>

              {/* <DatetimeComponent /> */}
            </div>

            {/* user avatar */}
            <div className="flex items-center space-x-1">
              <Menu width={150} shadow="md" trigger="click-hover">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="dark"
                    leftSection={<IconUserCircle stroke={1.5} />}
                    px={"0.25rem"}
                  >
                    <div className="text-sm font-semibold">{userData.name}</div>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <form action={logout}>
                    <Menu.Item type="submit" color="red">
                      Logout
                    </Menu.Item>
                  </form>
                </Menu.Dropdown>
              </Menu>
            </div>
            {/* end of user avatar */}
          </div>
        </Group>
      </AppShell.Header>

      {/* sidebar */}
      <AppShell.Navbar p="xs">
        <p className="p-2 text-xs text-gray-500">Menu</p>

        <NavLink
          label="Dashboard"
          onClick={toggle}
          component={Link}
          href="/dashboard"
          active={pathname === "/dashboard"}
          leftSection={<IconHome size="1.25rem" stroke={1.5} />}
        />

        {/* ADMIN MENU */}
        {isUserAdminValue ? (
          <>
            <p className="p-2 text-xs text-gray-500">Admin</p>

            <NavLink
              label="User"
              onClick={toggle}
              component={Link}
              href="/dashboard/admin/user"
              active={pathname?.startsWith("/dashboard/admin/user") ?? false}
              leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
            />
          </>
        ) : null}
        {/* END OF ADMIN MENU */}
      </AppShell.Navbar>
      <AppShell.Main className="bg-gray-100 dark:bg-inherit">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
