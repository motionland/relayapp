"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sun, Moon, Globe } from "lucide-react"
import SettingsLayout from "@/components/settings-layout"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before accessing theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted ? theme === "dark" : false

  const handleDarkModeToggle = () => {
    setTheme(isDarkMode ? "light" : "dark")
  }

  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("EST")

  return (
    <SettingsLayout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-black">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Appearance</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Customize how Metro looks and feels</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8 bg-white dark:bg-black">
          {/* Theme */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h2>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-gray-500 dark:text-gray-400">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                </div>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
            </div>
          </div>

          {/* Language & Region */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Language & Region</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Language</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
                  </div>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32 bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Timezone</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Your local timezone for notifications</p>
                  </div>
                </div>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger className="w-32 bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                    <SelectItem value="EST">EST</SelectItem>
                    <SelectItem value="CST">CST</SelectItem>
                    <SelectItem value="MST">MST</SelectItem>
                    <SelectItem value="PST">PST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}
