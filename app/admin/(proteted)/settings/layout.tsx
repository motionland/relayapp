import type React from "react"
import AdminSettingsLayout from "@/components/admin-settings-layout"

export default function AdminSettingsLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminSettingsLayout>{children}</AdminSettingsLayout>
}
