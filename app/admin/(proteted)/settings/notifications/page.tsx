"use client"

import { useEffect, useState, useCallback } from "react"
import { Switch } from "@/components/ui/switch"
import { Mail, MessageCircle, Bell } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/redux"
import {
  getAdminNotificationSettings,
  updateAdminNotificationSettings,
  updateAdminNotifyPreference,
  UpdateNotificationRequest,
} from "@/redux/feature/notification"

export default function SettingsNotification() {
  const dispatch = useAppDispatch()
  const { notification, preference, error } = useAppSelector(
    (state) => state.notification
  )

  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  const debounce = (fn: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }

  const debouncedUpdateNotification = useCallback(
  debounce(
    (
      key: "is_email" | "is_sms" | "is_push_notification",
      value: boolean
    ) => {
      setSavingKey(key)

      const current: UpdateNotificationRequest = notification || {}

      const payload = {
        is_email: key === "is_email" ? value : current.is_email ?? false,
        is_sms: key === "is_sms" ? value : current.is_sms ?? false,
        is_push_notification:
          key === "is_push_notification"
            ? value
            : current.is_push_notification ?? false,
      }

      dispatch(updateAdminNotificationSettings(payload))
        .finally(() => setSavingKey(null))
    },
    500
  ),
  [dispatch, notification]
)


  const debouncedUpdatePreference = useCallback(
    debounce((
      key:
        | "is_package_arrival"
        | "is_pickup_ready"
        | "is_pickup_reminder",
      value: boolean
    ) => {
      setSavingKey(key)
      dispatch(updateAdminNotifyPreference({ [key]: value }))
        .finally(() => setSavingKey(null))
    }, 500),
    [dispatch]
  )

  useEffect(() => {
    dispatch(getAdminNotificationSettings({}))
      .finally(() => setInitialLoading(false))
  }, [dispatch])

  return (
    <div className="p-6 max-h-[100vh] overflow-y-auto">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage how and when you receive notifications
          </p>
        </div>

        {/* Notification Preferences */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Notification Preferences
          </h2>
          <div className="space-y-4 py-5">
            {/* Email */}
            <div className="flex items-center justify-between pb-5">
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <Switch
                checked={notification?.is_email ?? false}
                disabled={initialLoading || savingKey === "is_email"}
                loading={initialLoading || savingKey === "is_email"}
                onCheckedChange={(val) =>
                  debouncedUpdateNotification("is_email", val)
                }
              />
            </div>

            {/* SMS */}
            <div className="flex items-center justify-between pb-5">
              <div className="flex items-center space-x-4">
                <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    SMS Text Messages
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Get text message alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={notification?.is_sms ?? false}
                disabled={initialLoading || savingKey === "is_sms"}
                loading={initialLoading || savingKey === "is_sms"}
                onCheckedChange={(val) =>
                  debouncedUpdateNotification("is_sms", val)
                }
              />
            </div>

            {/* Push */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Push Notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Mobile app and browser notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={notification?.is_push_notification ?? false}
                disabled={initialLoading || savingKey === "is_push_notification"}
                loading={initialLoading || savingKey === "is_push_notification"}
                onCheckedChange={(val) =>
                  debouncedUpdateNotification("is_push_notification", val)
                }
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            When You'll Be Notified
          </h2>
          <div className="space-y-4 py-8">
            {/* Package Arrival */}
            <div className="flex items-center justify-between pb-5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Package Arrival
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  When your package arrives at the hub
                </p>
              </div>
              <Switch
                checked={preference?.is_package_arrival ?? false}
                disabled={initialLoading || savingKey === "is_package_arrival"}
                loading={initialLoading || savingKey === "is_package_arrival"}
                onCheckedChange={(val) =>
                  debouncedUpdatePreference("is_package_arrival", val)
                }
              />
            </div>

            {/* Pickup Ready */}
            <div className="flex items-center justify-between pb-5">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Package Pickup Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  When your package is ready for pickup
                </p>
              </div>
              <Switch
                checked={preference?.is_pickup_ready ?? false}
                disabled={initialLoading || savingKey === "is_pickup_ready"}
                loading={initialLoading || savingKey === "is_pickup_ready"}
                onCheckedChange={(val) =>
                  debouncedUpdatePreference("is_pickup_ready", val)
                }
              />
            </div>

            {/* Pickup Reminder */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Package Pickup Reminder
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Reminder to pick up your package
                </p>
              </div>
              <Switch
                checked={preference?.is_pickup_reminder ?? false}
                disabled={initialLoading || savingKey === "is_pickup_reminder"}
                loading={initialLoading || savingKey === "is_pickup_reminder"}
                onCheckedChange={(val) =>
                  debouncedUpdatePreference("is_pickup_reminder", val)
                }
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
}
