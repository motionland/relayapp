import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AdminLayout from "@/components/admin-layout"

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get("auth_token")?.value
  
    if (!token) {
      redirect("/admin/auth/login") 
    }
  return <AdminLayout>{children}</AdminLayout>
}
