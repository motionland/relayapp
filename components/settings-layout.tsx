"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { User, Bell, Shield, Lock, CreditCard, Palette, Building, HelpCircle, ChevronRight } from "lucide-react"
import MobileFooter from "@/components/mobile-footer"
import DesktopSidebar from "@/components/desktop-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const settingsItems = [
    {
      href: "/profile",
      icon: <User className="h-5 w-5" />,
      label: "Personal info",
      description: "Update your personal information",
    },
    {
      href: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      description: "Manage your notification preferences",
    },
    {
      href: "/security",
      icon: <Shield className="h-5 w-5" />,
      label: "Security",
      description: "Password and security settings",
    },
    {
      href: "/privacy",
      icon: <Lock className="h-5 w-5" />,
      label: "Privacy",
      description: "Control your privacy settings",
    },
    {
      href: "/billing",
      icon: <CreditCard className="h-5 w-5" />,
      label: "Billing & Plans",
      description: "Manage your subscription",
    },
    {
      href: "/settings",
      icon: <Palette className="h-5 w-5" />,
      label: "Appearance",
      description: "Customize the app appearance",
    },
    {
      href: "/my-metro/settings/business",
      icon: <Building className="h-5 w-5" />,
      label: "Business Settings",
      description: "Manage business account settings",
    },
    {
      href: "/help",
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      description: "Get help and contact support",
    },
  ]

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <div className="pb-16">{children}</div>
        <MobileFooter />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Settings Content */}
      <div className="flex-1 flex">
        {/* Settings Navigation */}
        <div className="w-80 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
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
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <span
                    className={isActive ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}
                  >
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-black">{children}</div>
      </div>
    </div>
  )
}
