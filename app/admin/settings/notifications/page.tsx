"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Mail, MessageCircle, Bell } from "lucide-react"

export default function SettingsNotification() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [packageArrival, setPackageArrival] = useState(true)
  const [packagePickupReady, setPackagePickupReady] = useState(true)
  const [packagePickupReminder, setPackagePickupReminder] = useState(true)

  return (
    <>
      <div className="p-6 max-h-[100vh] overflow-y-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">Notifications</h1>
              <p className="text-gray-300 mt-2">Manage how and when you receive notifications</p>
            </div>
            <Button className="bg-white hover:bg-gray-200 text-black">
              Save Changes
            </Button>
          </div>

          {/* Notification Preferences Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Notification Preferences</h2>
              <p className="text-gray-300">To prevent any lapses in delivery, please keep one communication method active.</p>
            </div>

            <div className="space-y-4 py-5">
              {/* Email Notifications */}
              <div className="flex items-center justify-between pb-5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email Notifications</h3>
                    <p className="text-gray-300 text-sm">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              {/* SMS Text Messages */}
              <div className="flex items-center justify-between pb-5">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">SMS Text Messages</h3>
                    <p className="text-gray-300 text-sm">Get text message alerts</p>
                  </div>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg">
                    <Bell className="h-5 w-5 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Push Notifications</h3>
                    <p className="text-gray-300 text-sm">Mobile app and browser notifications</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
          </div>

          {/* When You'll Be Notified Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">When You'll Be Notified</h2>
              <p className="text-gray-300">Choose the events that trigger notifications, like delivery updates or when package is processing.</p>
            </div>

            <div className="space-y-4 py-8">
              {/* Package Arrival */}
              <div className="flex items-center justify-between pb-5">
                <div>
                  <h3 className="font-semibold text-white">Package Arrival</h3>
                  <p className="text-gray-300 text-sm">When your package arrives at the hub</p>
                </div>
                <Switch
                  checked={packageArrival}
                  onCheckedChange={setPackageArrival}
                />
              </div>

              {/* Package Pickup Ready */}
              <div className="flex items-center justify-between pb-5">
                <div>
                  <h3 className="font-semibold text-white">Package Pickup Ready</h3>
                  <p className="text-gray-300 text-sm">When your package is ready for pickup</p>
                </div>
                <Switch
                  checked={packagePickupReady}
                  onCheckedChange={setPackagePickupReady}
                />
              </div>

              {/* Package Pickup Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Package Pickup Reminder</h3>
                  <p className="text-gray-300 text-sm">Reminder to pick up your package</p>
                </div>
                <Switch
                  checked={packagePickupReminder}
                  onCheckedChange={setPackagePickupReminder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}