"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, Shield, CreditCard, Users, Bell, BarChart3, Mail, MessageSquare, Zap, Package } from "lucide-react"

const settingsNavigation = [
  {
    name: "General",
    href: "/admin/sys-settings",
    icon: Settings,
  },
  {
    name: "Security",
    href: "/admin/sys-settings/security",
    icon: Shield,
  },
  {
    name: "Stripe",
    href: "/admin/sys-settings/stripe",
    icon: CreditCard,
  },
  {
    name: "Membership",
    href: "/admin/sys-settings/membership",
    icon: Users,
  },
  {
    name: "Notifications",
    href: "/admin/sys-settings/notifications",
    icon: Bell,
  },
  {
    name: "Metrics",
    href: "/admin/sys-settings/metrics",
    icon: BarChart3,
  },
  {
    name: "Email",
    href: "/admin/sys-settings/email",
    icon: Mail,
  },
  {
    name: "SMS",
    href: "/admin/sys-settings/sms",
    icon: MessageSquare,
  },
  {
    name: "Communication",
    href: "/admin/sys-settings/communication",
    icon: Zap,
  },
  {
    name: "Package Settings",
    href: "/admin/sys-settings/package-settings",
    icon: Package,
  },
]

interface SystemSettingsLayoutProps {
  children: React.ReactNode
}

export function SystemSettingsLayout({ children }: SystemSettingsLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
        </div>
        <nav className="px-3 pb-6">
          <ul className="space-y-1">
            {settingsNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
