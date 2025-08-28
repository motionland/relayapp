"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, Trash2, Eye } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure email, SMS, and push notifications with event triggers and templates.
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
          <TabsTrigger value="triggers">Event Triggers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Enable or disable different notification methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications via email</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Send notifications via SMS</p>
                  </div>
                  <Switch id="smsNotifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Send browser and mobile push notifications
                    </p>
                  </div>
                  <Switch id="pushNotifications" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show notifications within the application
                    </p>
                  </div>
                  <Switch id="inAppNotifications" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure default notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultFrequency">Default Frequency</Label>
                  <Select defaultValue="immediate">
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="quietHours">Quiet Hours</Label>
                  <Select defaultValue="22-08">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Quiet Hours</SelectItem>
                      <SelectItem value="22-08">10 PM - 8 AM</SelectItem>
                      <SelectItem value="23-07">11 PM - 7 AM</SelectItem>
                      <SelectItem value="00-06">12 AM - 6 AM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="respectTimezone" defaultChecked />
                <Label htmlFor="respectTimezone">Respect user timezone for quiet hours</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Event Triggers</CardTitle>
                  <CardDescription>Configure when notifications are sent</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trigger
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Package Ready Trigger */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">Package Ready for Pickup</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Notify customer when their package is ready for pickup
                      </p>
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          Email
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          SMS
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" className="mr-1" />
                          Push
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch defaultChecked />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Membership Expiry Trigger */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">Membership Expiry Warning</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Notify members when their subscription is about to expire
                      </p>
                      <div className="mt-2">
                        <Label className="text-sm">Send notification</Label>
                        <Select defaultValue="7">
                          <SelectTrigger className="w-32 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day before</SelectItem>
                            <SelectItem value="3">3 days before</SelectItem>
                            <SelectItem value="7">7 days before</SelectItem>
                            <SelectItem value="14">14 days before</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          Email
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" className="mr-1" />
                          SMS
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch defaultChecked />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Package Delivered Trigger */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">Package Delivered</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Notify customer when package has been delivered to locker
                      </p>
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          Email
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          SMS
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          Push
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch defaultChecked />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Payment Failed Trigger */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">Payment Failed</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Notify customer when payment fails
                      </p>
                      <div className="mt-2 flex space-x-4 text-sm">
                        <span className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-1" />
                          Email
                        </span>
                        <span className="flex items-center">
                          <input type="checkbox" className="mr-1" />
                          SMS
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Switch defaultChecked />
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>Customize notification message templates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Package Ready Template</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageReadyEmail">Email Template</Label>
                    <Textarea
                      id="packageReadyEmail"
                      rows={4}
                      defaultValue="Hi {{customerName}},

Your package from {{carrier}} is ready for pickup!

Pickup Code: {{pickupCode}}
Location: {{locationName}}"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packageReadySMS">SMS Template</Label>
                    <Textarea
                      id="packageReadySMS"
                      rows={4}
                      defaultValue="Package ready! Code: {{pickupCode}} at {{locationName}}. Reply STOP to opt out."
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">Save Template</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Membership Expiry Template</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryEmail">Email Template</Label>
                    <Textarea
                      id="expiryEmail"
                      rows={4}
                      defaultValue="Hi {{customerName}},

Your {{planName}} membership expires in {{daysLeft}} days.

Renew now to continue enjoying our services: {{renewalLink}}"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expirySMS">SMS Template</Label>
                    <Textarea
                      id="expirySMS"
                      rows={4}
                      defaultValue="Your {{planName}} expires in {{daysLeft}} days. Renew: {{renewalLink}}"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm">Save Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Log Viewer</CardTitle>
              <CardDescription>View recent notification delivery logs and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="24h">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last Hour</SelectItem>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg">
                  <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm">
                    <div>Timestamp</div>
                    <div>Type</div>
                    <div>Recipient</div>
                    <div>Event</div>
                    <div>Status</div>
                  </div>

                  <div className="divide-y">
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div>2024-01-15 14:30</div>
                      <div>Email</div>
                      <div>john@example.com</div>
                      <div>Package Ready</div>
                      <div className="text-green-600">Delivered</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div>2024-01-15 14:25</div>
                      <div>SMS</div>
                      <div>+1234567890</div>
                      <div>Package Ready</div>
                      <div className="text-green-600">Delivered</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div>2024-01-15 13:45</div>
                      <div>Email</div>
                      <div>jane@example.com</div>
                      <div>Membership Expiry</div>
                      <div className="text-red-600">Failed</div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                      <div>2024-01-15 12:15</div>
                      <div>Push</div>
                      <div>user_12345</div>
                      <div>Package Delivered</div>
                      <div className="text-green-600">Delivered</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Export Logs</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Notification Settings
        </Button>
      </div>
    </div>
  )
}
