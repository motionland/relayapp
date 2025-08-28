"use client"

import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <AdminSidebar />
      <div className="flex-1 bg-white dark:bg-black">
        <div className="mx-auto max-w-full">{children}</div>
      </div>
    </div>
  )
}
