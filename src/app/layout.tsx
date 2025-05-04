import { ThemeProvider } from "@/components/theme-provider";
import { SearchParamsNotification } from "@/lib/notification/search-params-notification";
import TanstackQueryProvider from "@/lib/tanstack-query/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader showSpinner={false} />

          <TanstackQueryProvider>
            <Toaster richColors closeButton />
            <Suspense>
              <SearchParamsNotification />
            </Suspense>

            {children}
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
