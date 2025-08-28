"use client"

import type { ReactNode } from "react"
import DesktopSidebar from "@/components/desktop-sidebar"
import MobileFooter from "@/components/mobile-footer"

interface DesktopLayoutProps {
  children: ReactNode
}

export default function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <DesktopSidebar />
      <div className="flex-1 bg-white dark:bg-black">
        <div className="mx-auto max-w-md md:max-w-4xl">{children}</div>
        <div className="md:hidden">
          <MobileFooter />
        </div>
      </div>
    </div>
  )
}
