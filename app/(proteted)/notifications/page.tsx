"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, Bell } from "lucide-react"
import SettingsLayout from "@/components/settings-layout"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    packageArrival: true,
    packagePickupReady: true,
    packagePickupReminder: true,
    packagePickupFinalReminder: true,
    packageDeliveredToLocker: true,
    packageDeliveryConfirmation: true,
    delayNotice: true,
    specialHandlingRequired: true,
    accountOrSubscription: false,
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsLayout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-black">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Manage how and when you receive notifications</p>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Save Changes
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8 bg-white dark:bg-black">
          {/* Notification Preferences */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Notification Preferences</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                To prevent any lapses in delivery, please keep one communication method active.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange("email", value)}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">SMS Text Messages</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Get text message alerts</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(value) => handleNotificationChange("sms", value)}
                />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mobile app and browser notifications</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange("push", value)}
                />
              </div>
            </div>
          </div>

          {/* When You'll Be Notified */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">When You'll Be Notified</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose the events that trigger notifications, like delivery updates or when package is processing.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Package Arrival</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When your package arrives at the hub</p>
                </div>
                <Switch
                  checked={notifications.packageArrival}
                  onCheckedChange={(value) => handleNotificationChange("packageArrival", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Package Pickup Ready</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When your package is ready for pickup</p>
                </div>
                <Switch
                  checked={notifications.packagePickupReady}
                  onCheckedChange={(value) => handleNotificationChange("packagePickupReady", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Package Pickup Reminder</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reminder to pick up your package</p>
                </div>
                <Switch
                  checked={notifications.packagePickupReminder}
                  onCheckedChange={(value) => handleNotificationChange("packagePickupReminder", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Package Pickup Final Reminder</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Final reminder before package return</p>
                </div>
                <Switch
                  checked={notifications.packagePickupFinalReminder}
                  onCheckedChange={(value) => handleNotificationChange("packagePickupFinalReminder", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Package Delivered to Locker/Alternative Location
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    When package is placed in alternative location
                  </p>
                </div>
                <Switch
                  checked={notifications.packageDeliveredToLocker}
                  onCheckedChange={(value) => handleNotificationChange("packageDeliveredToLocker", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Package Delivery Confirmation</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Confirmation of successful delivery</p>
                </div>
                <Switch
                  checked={notifications.packageDeliveryConfirmation}
                  onCheckedChange={(value) => handleNotificationChange("packageDeliveryConfirmation", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Delay Notice</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When there are delivery delays</p>
                </div>
                <Switch
                  checked={notifications.delayNotice}
                  onCheckedChange={(value) => handleNotificationChange("delayNotice", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Special Handling Required</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">When packages need special attention</p>
                </div>
                <Switch
                  checked={notifications.specialHandlingRequired}
                  onCheckedChange={(value) => handleNotificationChange("specialHandlingRequired", value)}
                />
              </div>

              <div className="flex items-start justify-between py-4">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Account or Subscription</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Account updates and subscription changes</p>
                </div>
                <Switch
                  checked={notifications.accountOrSubscription}
                  onCheckedChange={(value) => handleNotificationChange("accountOrSubscription", value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}
