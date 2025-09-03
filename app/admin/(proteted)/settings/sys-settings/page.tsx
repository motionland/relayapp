"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Mail,
  Server,
  CreditCard,
  Users,
  Bell,
  MessageSquare,
  Shield,
  UserCog,
  Code,
  BarChart3,
  TestTube,
  Save,
  Eye,
  Send,
  Download,
  Play,
  AlertCircle,
  CheckCircle,
  Package,
} from "lucide-react"

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [testEmailSent, setTestEmailSent] = useState(false)
  const [testSmsSent, setTestSmsSent] = useState(false)

  const handleTestEmail = () => {
    setTestEmailSent(true)
    setTimeout(() => setTestEmailSent(false), 3000)
  }

  const handleTestSms = () => {
    setTestSmsSent(true)
    setTimeout(() => setTestSmsSent(false), 3000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Configure system-wide settings and integrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-6 lg:grid-cols-11 w-full">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="email-templates" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="email-provider" className="flex items-center gap-1">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">SMTP</span>
          </TabsTrigger>
          <TabsTrigger value="stripe" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Stripe</span>
          </TabsTrigger>
          <TabsTrigger value="membership" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notify</span>
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">SMS</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <UserCog className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="scripts" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Scripts</span>
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Metrics</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>App Name & Branding</CardTitle>
              <CardDescription>Configure your application's branding and identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="app-name">App Name</Label>
                  <Input id="app-name" defaultValue="Metro Package Manager" />
                </div>
                <div>
                  <Label htmlFor="app-tagline">Tagline</Label>
                  <Input id="app-tagline" defaultValue="Smart Package Management" />
                </div>
              </div>
              <div>
                <Label htmlFor="app-description">App Description</Label>
                <Textarea
                  id="app-description"
                  defaultValue="Comprehensive package management solution for businesses"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Your company details for legal and contact purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Metro Solutions Inc." />
                </div>
                <div>
                  <Label htmlFor="company-email">Contact Email</Label>
                  <Input id="company-email" type="email" defaultValue="contact@metro.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="company-address">Address</Label>
                <Textarea id="company-address" defaultValue="123 Business Ave, Suite 100, City, State 12345" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Configure timezone and language preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Default Time Zone</Label>
                  <Select defaultValue="america/new_york">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                      <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save General Settings
            </Button>
          </div>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="email-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email templates sent to users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Welcome Email</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sent when new users sign up</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password Reset</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sent when users request password reset</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Membership Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Membership status updates</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Custom Email Template Builder</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input id="template-name" placeholder="Enter template name" />
                  </div>
                  <div>
                    <Label htmlFor="template-subject">Subject Line</Label>
                    <Input id="template-subject" placeholder="Email subject" />
                  </div>
                  <div>
                    <Label htmlFor="template-content">Email Content</Label>
                    <Textarea id="template-content" rows={8} placeholder="Email content with HTML support" />
                  </div>
                  <Button>Create Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Provider */}
        <TabsContent value="email-provider" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure your email service provider settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" placeholder="587" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from-name">From Name</Label>
                  <Input id="from-name" placeholder="Metro Support" />
                </div>
                <div>
                  <Label htmlFor="from-email">From Email</Label>
                  <Input id="from-email" type="email" placeholder="noreply@metro.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-username">Username</Label>
                  <Input id="smtp-username" placeholder="your-email@gmail.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">Password</Label>
                  <Input id="smtp-password" type="password" placeholder="App password" />
                </div>
              </div>

              <div className="flex items-center space-x-2">{/* Placeholder for Switch component */}</div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleTestEmail} className="bg-green-600 hover:bg-green-700">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Email
                </Button>
                {testEmailSent && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Test email sent successfully!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stripe Integration */}
        <TabsContent value="stripe" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe Configuration</CardTitle>
              <CardDescription>Configure Stripe payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium">Test Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use test keys for development</p>
                </div>
                {/* Placeholder for Switch component */}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stripe-publishable">Publishable Key</Label>
                  <Input id="stripe-publishable" placeholder="pk_test_..." />
                </div>
                <div>
                  <Label htmlFor="stripe-secret">Secret Key</Label>
                  <Input id="stripe-secret" type="password" placeholder="sk_test_..." />
                </div>
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" defaultValue="https://yourdomain.com/api/stripe/webhook" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Currency & Tax Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                    <Input id="tax-rate" placeholder="8.25" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Membership */}
        <TabsContent value="membership" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membership Plans</CardTitle>
              <CardDescription>Configure membership tiers and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Basic Plan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$9.99/month - Up to 10 packages</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Premium Plan</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$19.99/month - Unlimited packages</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Trial & Signup Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trial-days">Trial Period (Days)</Label>
                    <Input id="trial-days" defaultValue="14" />
                  </div>
                  <div>
                    <Label htmlFor="signup-fields">Required Signup Fields</Label>
                    <Select defaultValue="basic">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Email & Password Only</SelectItem>
                        <SelectItem value="standard">+ Name & Phone</SelectItem>
                        <SelectItem value="extended">+ Address & Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications and triggers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send notifications via email</p>
                  </div>
                  {/* Placeholder for Switch component */}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Send notifications via SMS</p>
                  </div>
                  {/* Placeholder for Switch component */}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Browser push notifications</p>
                  </div>
                  {/* Placeholder for Switch component */}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Event Triggers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Package Ready for Pickup</span>
                    {/* Placeholder for Switch component */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Membership Expiry Warning</span>
                    {/* Placeholder for Switch component */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Failed</span>
                    {/* Placeholder for Switch component */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Package Received</span>
                    {/* Placeholder for Switch component */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Configuration</CardTitle>
              <CardDescription>Configure SMS service provider and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sms-provider">SMS Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="telnyx">Telnyx</SelectItem>
                    <SelectItem value="messagebird">MessageBird</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sms-api-key">API Key</Label>
                  <Input id="sms-api-key" type="password" placeholder="Your API key" />
                </div>
                <div>
                  <Label htmlFor="sender-number">Sender Number</Label>
                  <Input id="sender-number" placeholder="+1234567890" />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Compliance Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">STOP Keyword Compliance</span>
                    {/* Placeholder for Switch component */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Consent Logging</span>
                    {/* Placeholder for Switch component */}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting (1 msg/sec)</span>
                    {/* Placeholder for Switch component */}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleTestSms} className="bg-green-600 hover:bg-green-700">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test SMS
                </Button>
                {testSmsSent && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Test SMS sent successfully!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for admin accounts</p>
                  </div>
                  {/* Placeholder for Switch component */}
                </div>

                <div>
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" defaultValue="60" />
                </div>

                <div>
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, mixed case, numbers)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, symbols)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">IP Access Control</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ip-whitelist">IP Whitelist (comma-separated)</Label>
                    <Textarea id="ip-whitelist" placeholder="192.168.1.1, 10.0.0.1" />
                  </div>
                  <div>
                    <Label htmlFor="ip-blacklist">IP Blacklist (comma-separated)</Label>
                    <Textarea id="ip-blacklist" placeholder="Blocked IP addresses" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System User Management</CardTitle>
              <CardDescription>Manage admin users and role-based access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">User Roles</h4>
                <Button>Add New User</Button>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Super Admin</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Full system access</p>
                  </div>
                  <Badge variant="destructive">2 users</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Admin</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Limited admin access</p>
                  </div>
                  <Badge variant="secondary">5 users</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Staff</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Package management only</p>
                  </div>
                  <Badge variant="outline">12 users</Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Recent Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>admin@metro.com logged in</span>
                    <span className="text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>staff@metro.com updated package #1234</span>
                    <span className="text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span>New user invitation sent</span>
                    <span className="text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scripts */}
        <TabsContent value="scripts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Scripts</CardTitle>
              <CardDescription>Manage automated tasks and maintenance scripts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Daily Database Backup</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Runs daily at 2:00 AM</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Data Export</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Export user data to CSV</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Inactive</Badge>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">System Diagnostics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check system health</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Scheduled</Badge>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Run Now
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Cron Job Management</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="cron-expression">Cron Expression</Label>
                    <Input id="cron-expression" placeholder="0 2 * * *" />
                  </div>
                  <div>
                    <Label htmlFor="script-command">Script Command</Label>
                    <Input id="script-command" placeholder="/path/to/script.sh" />
                  </div>
                  <Button>Add Cron Job</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Metrics */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Metrics</CardTitle>
              <CardDescription>Monitor system performance and usage statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Active Users</span>
                  </div>
                  <div className="text-2xl font-bold">1,234</div>
                  <div className="text-sm text-green-600">+12% from last month</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Members</span>
                  </div>
                  <div className="text-2xl font-bold">567</div>
                  <div className="text-sm text-green-600">+8% from last month</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <span className="font-medium">Packages</span>
                  </div>
                  <div className="text-2xl font-bold">2,891</div>
                  <div className="text-sm text-green-600">+15% from last month</div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">Utilization</span>
                  </div>
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-sm text-yellow-600">-2% from last month</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Payment Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Successful Payments</span>
                    </div>
                    <div className="text-xl font-bold">98.5%</div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Failed Payments</span>
                    </div>
                    <div className="text-xl font-bold">1.5%</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">API Usage</h4>
                <div className="p-4 border rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Requests per hour</div>
                  <div className="text-2xl font-bold">1,456</div>
                  <div className="text-sm text-blue-600">Average response time: 120ms</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
