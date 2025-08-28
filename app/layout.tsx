import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { WarehouseProvider } from "@/contexts/warehouse-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Warehouse Package Pickup</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-white dark:bg-black text-gray-900 dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <WarehouseProvider>
            <main>{children}</main>
          </WarehouseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
