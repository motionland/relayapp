"use client"

import { useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"

export default function AdminAppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [accentColor, setAccentColor] = useState("green")
  const [fontSize, setFontSize] = useState("medium")
  const [compactMode, setCompactMode] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [highContrast, setHighContrast] = useState(false)

  const accentColors = [
    { value: "green", label: "Green", color: "bg-green-500" },
    { value: "blue", label: "Blue", color: "bg-blue-500" },
    { value: "purple", label: "Purple", color: "bg-purple-500" },
    { value: "orange", label: "Orange", color: "bg-orange-500" },
    { value: "red", label: "Red", color: "bg-red-500" },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appearance</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Customize the app appearance to match your preferences
          </p>
        </div>

        <div className="space-y-6 max-w-2xl">
          {/* Theme Selection */}
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Theme</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose your preferred theme for the admin interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer dark:text-white">
                    <Sun className="h-4 w-4" />
                    Light
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer dark:text-white">
                    <Moon className="h-4 w-4" />
                    Dark
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer dark:text-white">
                    <Monitor className="h-4 w-4" />
                    System
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Accent Color */}
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Accent Color</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Choose the accent color for buttons and highlights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {accentColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setAccentColor(color.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      accentColor === color.value
                        ? "border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.color}`} />
                    <span className="text-xs font-medium dark:text-white">{color.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Font Size</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Adjust the text size throughout the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-full dark:bg-black dark:border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium (Default)</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="extra-large">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Display Options */}
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Display Options</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customize how content is displayed in the interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">Compact Mode</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reduce spacing and padding for a more compact interface
                  </p>
                </div>
                <Switch checked={compactMode} onCheckedChange={setCompactMode} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">Animations</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Enable smooth transitions and animations</p>
                </div>
                <Switch checked={animations} onCheckedChange={setAnimations} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base dark:text-white">High Contrast</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Increase contrast for better accessibility</p>
                </div>
                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Preview</CardTitle>
              <CardDescription className="dark:text-gray-400">
                See how your settings will look in the interface
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold dark:text-white">Sample Interface</h3>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                    Action Button
                  </Button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  This is how text will appear with your current settings. The interface will adapt to your preferences.
                </p>
                <div className="flex gap-2">
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                    Active
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                    Inactive
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
