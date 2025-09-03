"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminNotificationsPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your notification preferences and stay updated on important events
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Choose what email notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Critical system issues and maintenance notifications
                </p>
              </div>
              <Switch id="system-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="user-activity">User Activity</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">New user registrations and account changes</p>
              </div>
              <Switch id="user-activity" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="package-alerts">Package Alerts</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">High-priority package issues and delays</p>
              </div>
              <Switch id="package-alerts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reports">Weekly Reports</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Weekly summary reports and analytics</p>
              </div>
              <Switch id="reports" />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Manage browser and mobile push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-push">Browser Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Show notifications in your browser</p>
              </div>
              <Switch id="browser-push" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mobile-push">Mobile Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications to your mobile device</p>
              </div>
              <Switch id="mobile-push" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Frequency</CardTitle>
            <CardDescription>Control how often you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email-frequency">Email Frequency</Label>
              <Select defaultValue="immediate">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quiet-hours">Quiet Hours</Label>
              <Select defaultValue="none">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Quiet Hours</SelectItem>
                  <SelectItem value="evening">6 PM - 8 AM</SelectItem>
                  <SelectItem value="night">10 PM - 6 AM</SelectItem>
                  <SelectItem value="weekend">Weekends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-green-600 hover:bg-green-700 text-white">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
