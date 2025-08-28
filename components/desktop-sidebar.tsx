"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Settings, Building, Home, Package, Truck, FileText, User, Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HelpCircle, LogOut } from "lucide-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function DesktopSidebar() {
  const pathname = usePathname()
  const [businessSectionCollapsed, setBusinessSectionCollapsed] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    {
      href: "/my-metro",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/packages",
      icon: <Package className="h-5 w-5" />,
      label: "Packages (29)",
    },
    {
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ]

  const businessItems = [
    {
      href: "/business-app",
      icon: <Building className="h-5 w-5" />,
      label: "Business App",
    },
    {
      href: "/business-packages",
      icon: <Package className="h-5 w-5" />,
      label: "Business Packages",
    },
    {
      href: "/create-delivery",
      icon: <Truck className="h-5 w-5" />,
      label: "Create Delivery",
    },
    {
      href: "/get-estimate",
      icon: <FileText className="h-5 w-5" />,
      label: "Get An Estimate",
    },
    {
      href: "/shipping-list",
      icon: <Package className="h-5 w-5" />,
      label: "Shipping List",
    },
    {
      href: "/members",
      icon: <User className="h-5 w-5" />,
      label: "Team Members",
    },
  ]

  const accountItems = [
    {
      href: "/address-books",
      icon: <FileText className="h-5 w-5" />,
      label: "Address Books",
    },
    {
      href: "/billing",
      icon: <FileText className="h-5 w-5" />,
      label: "Business Billing",
    },
  ]

  return (
    <div
      className={`hidden md:flex md:flex-col md:min-h-screen bg-white dark:bg-black border-r border-gray-100 dark:border-gray-800 transition-all duration-300 relative ${
        isCollapsed ? "md:w-16" : "md:w-64"
      }`}
    >
      {/* Collapse/Expand Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white flex-shrink-0">
          <span className="text-xl font-bold text-black">M</span>
        </div>
        {!isCollapsed && <span className="text-xl font-semibold dark:text-white">Metro</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto text-sm">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-200"
                  } ${item.highlight ? "bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700" : ""}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span
                    className={`flex-shrink-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : item.highlight
                          ? "text-yellow-600"
                          : "text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className={`font-medium ${item.highlight ? "text-yellow-700" : ""}`}>
                      {item.label.includes("(") ? (
                        <>
                          {item.label.split("(")[0]}
                          <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                            {item.label.split("(")[1].replace(")", "")}
                          </span>
                        </>
                      ) : (
                        item.label
                      )}
                    </span>
                  )}
                  {item.highlight && !isCollapsed && (
                    <span className="ml-auto inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-yellow-500 text-white">
                      New
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Business Section */}
        {!isCollapsed && (
          <div className="mt-8">
            <div
              className="flex items-center justify-between px-4 cursor-pointer group"
              onClick={() => setBusinessSectionCollapsed(!businessSectionCollapsed)}
            >
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Business
              </h3>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  businessSectionCollapsed ? "" : "rotate-180"
                }`}
              />
            </div>
            <div
              className={`mt-2 overflow-hidden transition-all duration-200 ${
                businessSectionCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
              }`}
            >
              <ul className="space-y-1">
                {businessItems.map((item) => {
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
                        <span
                          className={`flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium">
                          {item.label.includes("(") ? (
                            <>
                              {item.label.split("(")[0]}
                              <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                                {item.label.split("(")[1].replace(")", "")}
                              </span>
                            </>
                          ) : (
                            item.label
                          )}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              {/* Account Section (moved inside Business group) */}
              <div className="mt-6 pl-2 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Account
                </h3>
                <ul className="mt-2 space-y-1">
                  {accountItems.map((item) => {
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
                          <span
                            className={`flex-shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">
                            {item.label.includes("(") ? (
                              <>
                                {item.label.split("(")[0]}
                                <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                                  {item.label.split("(")[1].replace(")", "")}
                                </span>
                              </>
                            ) : (
                              item.label
                            )}
                          </span>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-2 rounded-lg">
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                  LF
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="flex-1">
                    <span className="font-medium dark:text-white">Lutfy</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">lutfy@example.com</p>
                  </div>
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                </>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
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
      </div>
    </div>
  )
}
