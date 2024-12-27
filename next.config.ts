import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // dynamicIO: true,
    // reactCompiler: true,
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: [
      "@mantine/core",
      "@mantine/dates",
      "@mantine/hooks",
      "@mantine/modals",
      "@mantine/notifications",
      "@supabase/ssr",
      "@supabase/supabase-js",
      "@tabler/icons-react",
      "nextjs-toploader",
      "dayjs",
      "clsx",
      "drizzle-orm",
      "mantine-react-table",
      "nextjs-toploader",
      "postgres",
      "sharp",
      "tailwind-merge",
      "zod",
      "zod-form-data",
    ],
  },
};

export default nextConfig;
