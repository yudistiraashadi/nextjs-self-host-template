import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
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
  // allow images from outside the domain
  // ref: https://nextjs.org/docs/messages/next-image-unconfigured-host
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
    ],
  },
  cacheHandler:
    process.env.NODE_ENV === "production"
      ? require.resolve("./cache-handler.mjs")
      : undefined,
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
    optimizePackageImports: [
      "clsx",
      "drizzle-orm",
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
