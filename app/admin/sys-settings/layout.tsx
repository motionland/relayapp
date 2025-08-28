"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Settings,
  Mail,
  CreditCard,
  Users,
  Bell,
  MessageSquare,
  Shield,
  UserCog,
  Code,
  BarChart3,
  ChevronRight,
  MessageCircle,
  Package,
} from "lucide-react"

interface SystemSettingsLayoutProps {
  children: React.ReactNode
}

export default function SystemSettingsLayout({ children }: SystemSettingsLayoutProps) {
  const pathname = usePathname()

  const settingsItems = [
    {
      href: "/admin/sys-settings",
      icon: <Settings className="h-5 w-5" />,
      label: "General",
    },
    {
      href: "/admin/sys-settings/package-settings",
      icon: <Package className="h-5 w-5" />,
      label: "Package Settings",
    },
    {
      href: "/admin/sys-settings/communication",
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Communication",
    },
    {
      href: "/admin/sys-settings/email",
      icon: <Mail className="h-5 w-5" />,
      label: "Email Settings",
    },
    {
      href: "/admin/sys-settings/sms",
      icon: <MessageSquare className="h-5 w-5" />,
      label: "SMS",
    },
    {
      href: "/admin/sys-settings/stripe",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Stripe Integration",
    },
    {
      href: "/admin/sys-settings/membership",
      icon: <Users className="h-5 w-5" />,
      label: "Membership",
    },
    {
      href: "/admin/sys-settings/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
    },
    {
      href: "/admin/sys-settings/security",
      icon: <Shield className="h-5 w-5" />,
      label: "Security",
    },
    {
      href: "/admin/sys-settings/user-management",
      icon: <UserCog className="h-5 w-5" />,
      label: "System User Management",
    },
    {
      href: "/admin/sys-settings/scripts",
      icon: <Code className="h-5 w-5" />,
      label: "Scripts",
    },
    {
      href: "/admin/sys-settings/metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "App Metrics",
    },
  ]

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* System Settings Sidebar */}
      <div className="w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">System Settings</h1>
        </div>

        <nav className="px-3">
          {settingsItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 mx-3 mb-1 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-black overflow-auto">{children}</div>
    </div>
  )
}
