"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save, Send, TestTube } from "lucide-react"

export default function SMSPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SMS Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure SMS provider, compliance settings, and delivery logs.
        </p>
      </div>

      <Tabs defaultValue="provider" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="provider">SMS Provider</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="provider" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Provider Configuration</CardTitle>
              <CardDescription>Configure your SMS service provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">SMS Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="telnyx">Telnyx</SelectItem>
                    <SelectItem value="messagebird">MessageBird</SelectItem>
                    <SelectItem value="vonage">Vonage (Nexmo)</SelectItem>
                    <SelectItem value="aws-sns">AWS SNS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key / Account SID</Label>
                  <Input id="apiKey" type="password" placeholder="Enter your API key..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiSecret">API Secret / Auth Token</Label>
                  <Input id="apiSecret" type="password" placeholder="Enter your API secret..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderNumber">Sender Phone Number</Label>
                <Input id="senderNumber" placeholder="+1234567890" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Must be a verified phone number from your SMS provider
                </p>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test SMS
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test SMS Functionality</CardTitle>
              <CardDescription>Send a test SMS to verify your configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testNumber">Test Phone Number</Label>
                <Input id="testNumber" placeholder="+1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testMessage">Test Message</Label>
                <Textarea
                  id="testMessage"
                  rows={3}
                  defaultValue="This is a test message from Metro Package Manager. Your SMS configuration is working correctly!"
                />
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Test SMS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Opt-In / Opt-Out Compliance</CardTitle>
              <CardDescription>Configure STOP keyword handling and consent logging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enableOptOut" defaultChecked />
                <Label htmlFor="enableOptOut">Enable STOP Keyword Processing</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stopKeywords">STOP Keywords (comma-separated)</Label>
                <Input id="stopKeywords" defaultValue="STOP, UNSUBSCRIBE, QUIT, END, CANCEL" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keywords that will automatically opt users out of SMS notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optOutResponse">Auto-Reply for Opt-Out</Label>
                <Textarea
                  id="optOutResponse"
                  rows={3}
                  defaultValue="You have been unsubscribed from SMS notifications. Reply START to re-subscribe."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startKeywords">START Keywords (comma-separated)</Label>
                <Input id="startKeywords" defaultValue="START, SUBSCRIBE, YES" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Keywords that will re-subscribe users to SMS notifications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="optInResponse">Auto-Reply for Opt-In</Label>
                <Textarea
                  id="optInResponse"
                  rows={3}
                  defaultValue="You have been subscribed to SMS notifications from Metro Package Manager. Reply STOP to unsubscribe."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="consentLogging" defaultChecked />
                <Label htmlFor="consentLogging">Enable Consent Logging</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consent Log Viewer</CardTitle>
              <CardDescription>View opt-in and opt-out history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm">
                  <div>Phone Number</div>
                  <div>Action</div>
                  <div>Timestamp</div>
                  <div>Method</div>
                </div>

                <div className="divide-y">
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                    <div>+1234567890</div>
                    <div className="text-green-600">Opted In</div>
                    <div>2024-01-15 14:30</div>
                    <div>Registration</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                    <div>+1987654321</div>
                    <div className="text-red-600">Opted Out</div>
                    <div>2024-01-15 13:45</div>
                    <div>STOP Keyword</div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                    <div>+1555123456</div>
                    <div className="text-green-600">Opted In</div>
                    <div>2024-01-15 12:15</div>
                    <div>START Keyword</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Delivery Logs & Metrics</CardTitle>
              <CardDescription>Monitor SMS delivery status and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Metrics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">Messages Sent</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">98.2%</div>
                    <div className="text-sm text-green-600 dark:text-green-400">Delivery Rate</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">23</div>
                    <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">$47.82</div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Cost (This Month)</div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex space-x-4">
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
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Search phone number..." className="w-60" />
                </div>

                {/* Delivery Log Table */}
                <div className="border rounded-lg">
                  <div className="grid grid-cols-6 gap-4 p-4 border-b font-medium text-sm">
                    <div>Timestamp</div>
                    <div>Phone Number</div>
                    <div>Template</div>
                    <div>Status</div>
                    <div>Cost</div>
                    <div>Actions</div>
                  </div>

                  <div className="divide-y">
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm">
                      <div>2024-01-15 14:30</div>
                      <div>+1234567890</div>
                      <div>Package Ready</div>
                      <div className="text-green-600">Delivered</div>
                      <div>$0.0075</div>
                      <div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm">
                      <div>2024-01-15 14:25</div>
                      <div>+1987654321</div>
                      <div>Membership Expiry</div>
                      <div className="text-green-600">Delivered</div>
                      <div>$0.0075</div>
                      <div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm">
                      <div>2024-01-15 13:45</div>
                      <div>+1555123456</div>
                      <div>Payment Failed</div>
                      <div className="text-red-600">Failed</div>
                      <div>$0.0000</div>
                      <div>
                        <Button variant="outline" size="sm">
                          Retry
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 p-4 text-sm">
                      <div>2024-01-15 12:15</div>
                      <div>+1777888999</div>
                      <div>Package Ready</div>
                      <div className="text-yellow-600">Pending</div>
                      <div>$0.0075</div>
                      <div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Throttle Settings</CardTitle>
              <CardDescription>Configure rate limiting and delivery settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="messagesPerMinute">Messages Per Minute</Label>
                  <Input id="messagesPerMinute" type="number" defaultValue="10" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Maximum SMS messages to send per minute</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messagesPerHour">Messages Per Hour</Label>
                  <Input id="messagesPerHour" type="number" defaultValue="100" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Maximum SMS messages to send per hour</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enableThrottling" defaultChecked />
                <Label htmlFor="enableThrottling">Enable Rate Limiting</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryAttempts">Retry Attempts for Failed Messages</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No Retries</SelectItem>
                    <SelectItem value="1">1 Retry</SelectItem>
                    <SelectItem value="3">3 Retries</SelectItem>
                    <SelectItem value="5">5 Retries</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retryDelay">Retry Delay (Minutes)</Label>
                <Input id="retryDelay" type="number" defaultValue="5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Message Settings</CardTitle>
              <CardDescription>Configure message formatting and delivery preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enableUnicode" />
                <Label htmlFor="enableUnicode">Enable Unicode Characters (Emojis)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enableDeliveryReceipts" defaultChecked />
                <Label htmlFor="enableDeliveryReceipts">Request Delivery Receipts</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultCountryCode">Default Country Code</Label>
                <Select defaultValue="+1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+33">+33 (France)</SelectItem>
                    <SelectItem value="+49">+49 (Germany)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="messageValidityPeriod">Message Validity Period (Hours)</Label>
                <Input id="messageValidityPeriod" type="number" defaultValue="24" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  How long the carrier should attempt to deliver the message
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Export Logs</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save SMS Settings
        </Button>
      </div>
    </div>
  )
}
