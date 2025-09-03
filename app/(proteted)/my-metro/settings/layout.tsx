import SettingsLayout from "@/components/settings-layout"

export default function MyMetroSettingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SettingsLayout>
      {children}
    </SettingsLayout>
  )
}