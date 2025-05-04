import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mantine styles

import { SearchParamsNotification } from "@/lib/notification/search-params-notification";
import TanstackQueryProvider from "@/lib/tanstack-query/provider";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Website Title",
    default: "Website Title",
  },
  description: "Website Description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} antialiased`}
      >
        <NextTopLoader />

        <TanstackQueryProvider>
          <MantineProvider theme={mantineTheme} defaultColorScheme="light">
            <ModalsProvider>
              <Notifications
                position="top-right"
                zIndex={1000}
                autoClose={10000}
              />

              <Suspense>
                <SearchParamsNotification />
              </Suspense>

              {children}
            </ModalsProvider>
          </MantineProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
