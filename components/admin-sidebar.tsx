"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Settings,
  Building,
  Home,
  Package,
  Users,
  BarChart3,
  FileText,
  User,
  Bell,
  Cog,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HelpCircle, LogOut, ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function AdminSidebar() {
  const pathname = usePathname()
  const [managementSectionCollapsed, setManagementSectionCollapsed] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    {
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/admin/packages",
      icon: <Package className="h-5 w-5" />,
      label: "All Packages",
    },
    {
      href: "/admin/bussiness-applications",
      icon: <FileText className="h-5 w-5" />,
      label: "Business Applications",
    },
    {
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ]

  const managementItems = [
    {
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      label: "Users",
    },
    {
      href: "/admin/warehouses",
      icon: <Building className="h-5 w-5" />,
      label: "Warehouses",
    },
    {
      href: "/admin/reports",
      icon: <BarChart3 className="h-5 w-5" />,
      label: "Reports",
    },
  ]

  const systemItems = [
    {
      href: "/admin/system",
      icon: <FileText className="h-5 w-5" />,
      label: "System Logs",
    },
    {
      href: "/admin/notifications",
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
    },
    {
      href: "/admin/sys-settings",
      icon: <Cog className="h-5 w-5" />,
      label: "System Settings",
    },
  ]

  return (
    <div
      className={`hidden md:flex md:flex-col md:min-h-screen bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 transition-all duration-300 relative ${
        sidebarCollapsed ? "md:w-16" : "md:w-64"
      }`}
    >
      {/* Vertical Toggle Button */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-8 z-10 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 shadow-sm transition-all duration-200"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>

      {/* Logo - only show when expanded */}
      {!sidebarCollapsed && (
        <div className="p-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
            <span className="text-xl font-bold text-black">M</span>
          </div>
          <span className="text-xl font-semibold dark:text-white">Metro Admin</span>
        </div>
      )}

      {/* Collapsed Logo - only show when collapsed */}
      {sidebarCollapsed && (
        <div className="p-4 flex items-center justify-center mt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
            <span className="text-sm font-bold text-black">M</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto text-sm">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(`${item.href}/`))
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-200"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}>{item.icon}</span>
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Management Section - only show when expanded */}
        {!sidebarCollapsed && (
          <div className="mt-8">
            <div
              className="flex items-center justify-between px-4 cursor-pointer group"
              onClick={() => setManagementSectionCollapsed(!managementSectionCollapsed)}
            >
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Management
              </h3>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  managementSectionCollapsed ? "" : "rotate-180"
                }`}
              />
            </div>
            <div
              className={`mt-2 overflow-hidden transition-all duration-200 ${
                managementSectionCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
              }`}
            >
              <ul className="space-y-1">
                {managementItems.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 ${
                          isActive
                            ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* System Section (moved inside Management group) */}
              <div className="mt-6 pl-2 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  System
                </h3>
                <ul className="mt-2 space-y-1">
                  {systemItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                              : "text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800">
        {sidebarCollapsed ? (
          // Collapsed profile - just avatar
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          // Expanded profile with dropdown
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-medium dark:text-white">Admin</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400">admin@metro.com</p>
                </div>
                <ChevronUp className="h-4 w-4 text-gray-400" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                <span>Documentation</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
