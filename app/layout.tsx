import type React from "react";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { WarehouseProvider } from "@/contexts/warehouse-context";
import { ReduxProviders } from "@/redux";
import AppInitializer from "@/components/appInitializer";
import NextAuthSessionProvider from "@/components/session-provider";
import AdminLayout from "@/components/admin-layout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Warehouse Package Pickup</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-white">
        <NextAuthSessionProvider>
          <ReduxProviders>
            <AppInitializer>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <WarehouseProvider>
                  <AdminLayout>
                    <main>{children}</main>
                  </AdminLayout>
                </WarehouseProvider>
              </ThemeProvider>
            </AppInitializer>
          </ReduxProviders>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
