import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // sharp webpack configuration
  // ref: https://github.com/vercel/vercel/issues/11052#issuecomment-2263565471
  webpack: (config) => ({
    ...config,
    externals: [
      ...config.externals,
      {
        sharp: "commonjs sharp",
      },
    ],
  }),
  // allow images from Supabase storage
  // ref: https://nextjs.org/docs/messages/next-image-unconfigured-host
  //  images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "utebebrolnerwfsiioep.supabase.co",
  //       port: "",
  //       pathname: "/**",
  //     },
  //   ],
  // },
  experimental: {
    // serverActions: {
    //   bodySizeLimit: "200mb",
    // },
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
