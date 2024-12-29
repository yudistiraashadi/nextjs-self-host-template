import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Mantine styles
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import "mantine-react-table/styles.css";

import { SearchParamsNotification } from "@/lib/notification/search-params-notification";
import TanstackQueryProvider from "@/lib/tanstack-query/provider";
import {
  ColorSchemeScript,
  createTheme,
  DEFAULT_THEME,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
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
};

const mantineTheme = createTheme({
  fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  headings: {
    fontFamily: `${inter.style.fontFamily}, ${DEFAULT_THEME.fontFamily}`,
  },
});

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
        className={`${inter.variable} font-sans antialiased`}
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
