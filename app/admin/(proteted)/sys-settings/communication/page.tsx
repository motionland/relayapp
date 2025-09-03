"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, Eye, Send, Plus, Trash2, Edit, Copy, Mail, MessageSquare, ArrowLeft } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function CommunicationPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null)
  const [editingSMSTemplate, setEditingSMSTemplate] = useState<any | null>(null)
  const [templateContent, setTemplateContent] = useState("")
  const [templateSubject, setTemplateSubject] = useState("")
  const [smsContent, setSmsContent] = useState("")
  const [emailPreviewMode, setEmailPreviewMode] = useState<"desktop" | "mobile">("desktop")

  // Template data with actual content
  const templateData = {
    user_welcome_email: {
      key: "user_welcome_email",
      name: "User Welcome Email",
      subject: "Welcome to [app_name]!",
      content: `Hi [first_name],

Welcome to [app_name]! We're excited to have you join our community.

Your account has been successfully created and you can now:
• Track your packages in real-time
• Receive instant notifications
• Access our mobile app
• Get 24/7 customer support

Getting Started:
1. Download our mobile app
2. Set up your notification preferences
3. Add your first shipping address

If you have any questions, our support team is here to help at [support_email] or [support_phone].

Welcome aboard!

Best regards,
The [app_name] Team`,
    },
    user_request_password_reset: {
      key: "user_request_password_reset",
      name: "User Request Password Reset",
      subject: "[app_name] Password Reset Request",
      content: `Hi [first_name],

We received a request to reset your password for your [app_name] account.

To reset your password, click the link below:
[reset_link]

This link will expire in 24 hours for security reasons.

If you didn't request this password reset, please ignore this email. Your password will remain unchanged.

For security questions, contact us at [support_email].

Best regards,
The [app_name] Security Team`,
    },
    delivery_confirmation: {
      key: "delivery_confirmation",
      name: "Delivery Confirmation",
      subject: "[app_name]: Package from [sender_name] delivered",
      content: `Hi [first_name],

Great news! Your package has been delivered to your secure locker.

📦 Delivery Details:
• Package from: [sender_name]
• Locker ID: [locker_id]
• Location: [locker_location]
• Access Code: [locker_access_code]

⏰ Pickup Information:
• Available 24/7
• Code expires in 7 days
• Bring a valid ID

Need help? Contact us at [support_phone] or visit [facility_address].

Thank you for using [app_name]!

Best regards,
The [app_name] Team`,
    },
    email_header: {
      key: "email_header",
      name: "Email Header",
      subject: "N/A (Header Template)",
      content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[app_name] - [email_subject]</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <img src="[logo_url]" alt="[app_name]" style="height: 40px;">
                            <h1 style="color: #ffffff; margin: 10px 0 0 0; font-size: 24px;">[app_name]</h1>
                        </td>
                    </tr>
                    <!-- Content starts here -->
                    <tr>
                        <td style="padding: 30px;">`,
    },
    email_footer: {
      key: "email_footer",
      name: "Email Footer",
      subject: "N/A (Footer Template)",
      content: `                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                                © 2024 [app_name]. All rights reserved.
                            </p>
                            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 12px;">
                                [company_address]
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                Questions? Contact us at <a href="mailto:[support_email]" style="color: #2563eb;">[support_email]</a> or [support_phone]
                            </p>
                            <div style="margin-top: 15px;">
                                <a href="[unsubscribe_link]" style="color: #64748b; font-size: 11px; text-decoration: none;">Unsubscribe</a> |
                                <a href="[privacy_policy_link]" style="color: #64748b; font-size: 11px; text-decoration: none;">Privacy Policy</a> |
                                <a href="[terms_link]" style="color: #64748b; font-size: 11px; text-decoration: none;">Terms of Service</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    },
  }

  // SMS Template data with actual content
  const smsTemplateData = {
    "delivered-to-locker": {
      id: "delivered-to-locker",
      name: "Delivered to Locker",
      category: "📦 Locker & Pickup Notifications",
      message:
        "[app_name]: Your package from [sender_name] is in locker [locker_id] at [locker_location]. Access code: [locker_access_code]. Pickup by [pickup_deadline].",
      type: "System",
      lastModified: "2024-01-15",
      status: "Active",
      charCount: 145,
    },
    "ready-for-pickup": {
      id: "ready-for-pickup",
      name: "Ready for Pickup",
      category: "📦 Locker & Pickup Notifications",
      message:
        "[app_name]: Your package from [sender_name] is ready for pickup at [facility_name]. Hours: [hub_hours]. Please bring your ID.",
      type: "System",
      lastModified: "2024-01-14",
      status: "Active",
      charCount: 132,
    },
    reminder: {
      id: "reminder",
      name: "Pickup Reminder",
      category: "📦 Locker & Pickup Notifications",
      message:
        "[app_name]: Reminder: Your package from [sender_name] is waiting for pickup. Please collect it by [pickup_deadline_date].",
      type: "System",
      lastModified: "2024-01-13",
      status: "Active",
      charCount: 128,
    },
    "urgent-pickup": {
      id: "urgent-pickup",
      name: "Urgent Pickup",
      category: "📦 Locker & Pickup Notifications",
      message:
        "[app_name]: Final Reminder: Your package from [sender_name] must be picked up by [pickup_date]. Uncollected packages will be returned.",
      type: "System",
      lastModified: "2024-01-12",
      status: "Active",
      charCount: 145,
    },
    "pickup-confirmation": {
      id: "pickup-confirmation",
      name: "Pickup Confirmation",
      category: "📦 Locker & Pickup Notifications",
      message:
        "[app_name]: Thank you! Your package from [sender_name] ([tracking_number]) has been successfully picked up on [pickup_date].",
      type: "System",
      lastModified: "2024-01-11",
      status: "Active",
      charCount: 125,
    },
    "delay-notification": {
      id: "delay-notification",
      name: "Delay Notification",
      category: "🚚 Delivery & Exception Alerts",
      message: "[app_name]: We're sorry! Your package from [sender_name] is delayed. We'll notify you once it arrives.",
      type: "System",
      lastModified: "2024-01-10",
      status: "Active",
      charCount: 108,
    },
    "special-handling": {
      id: "special-handling",
      name: "Special Handling",
      category: "🚚 Delivery & Exception Alerts",
      message:
        "[app_name]: Your package from [sender_name] ([type_of_package]) requires special handling. Please visit [facility_name] before [pickup_date] for pickup.",
      type: "System",
      lastModified: "2024-01-09",
      status: "Active",
      charCount: 155,
    },
    received: {
      id: "received",
      name: "Package Received",
      category: "🚚 Delivery & Exception Alerts",
      message:
        "[app_name]: Your package from [sender_name] has arrived at [facility_name]. Please pick it up at your earliest convenience.",
      type: "System",
      lastModified: "2024-01-08",
      status: "Active",
      charCount: 128,
    },
    "welcome-to-metro-relay": {
      id: "welcome-to-metro-relay",
      name: "Welcome to Metro Relay",
      category: "✉️ Onboarding & Billing",
      message:
        "Welcome to [app_name]! Your new 📦 shipping address: [customer_address_and_code] [facility_address]. Hub hours: [hub_hours]. Get alerts via SMS, email, or the [app_name] App!",
      type: "System",
      lastModified: "2024-01-07",
      status: "Active",
      charCount: 185,
    },
    "payment-declined": {
      id: "payment-declined",
      name: "Payment Declined",
      category: "✉️ Onboarding & Billing",
      message:
        "[app_name]: Hi [first_name], we couldn't process your payment on [date] ($[amount]/mo). Please update your card via the dashboard to avoid service interruption.",
      type: "System",
      lastModified: "2024-01-06",
      status: "Active",
      charCount: 165,
    },
  }

  const smsTemplates = Object.values(smsTemplateData)

  const handleEditTemplate = (templateKey: string) => {
    const template = templateData[templateKey as keyof typeof templateData]
    if (template) {
      setEditingTemplate(template)
      setTemplateContent(template.content)
      setTemplateSubject(template.subject)
    }
  }

  const handleEditSMSTemplate = (templateId: string) => {
    const template = smsTemplateData[templateId as keyof typeof smsTemplateData]
    if (template) {
      setEditingSMSTemplate(template)
      setSmsContent(template.message)
    }
  }

  const replaceVariables = (text: string) => {
    return text
      .replace(/\[app_name\]/g, "Metro Package Manager")
      .replace(/\[first_name\]/g, "John")
      .replace(/\[last_name\]/g, "Doe")
      .replace(/\[sender_name\]/g, "Amazon")
      .replace(/\[locker_id\]/g, "L-42")
      .replace(/\[locker_location\]/g, "Main Office Lobby")
      .replace(/\[locker_access_code\]/g, "8472")
      .replace(/\[facility_address\]/g, "123 Main St, Downtown")
      .replace(/\[facility_name\]/g, "Main Office")
      .replace(/\[support_email\]/g, "support@metropackage.com")
      .replace(/\[support_phone\]/g, "(555) 123-4567")
      .replace(/\[tracking_number\]/g, "1Z999AA1234567890")
      .replace(/\[pickup_code\]/g, "12345")
      .replace(/\[pickup_deadline\]/g, "Jan 22")
      .replace(/\[pickup_date\]/g, "Jan 20")
      .replace(/\[pickup_deadline_date\]/g, "January 22, 2024")
      .replace(/\[hub_hours\]/g, "Mon-Fri 9AM-6PM")
      .replace(/\[customer_address_and_code\]/g, "John Doe #12345")
      .replace(/\[date\]/g, "Jan 15")
      .replace(/\[amount\]/g, "29.99")
      .replace(/\[type_of_package\]/g, "Fragile Item")
  }

  const calculateCharCount = (text: string) => {
    return replaceVariables(text).length
  }

  // SMS Template Editor
  if (editingSMSTemplate) {
    return (
      <div className="p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => setEditingSMSTemplate(null)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit SMS Template</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Template ID:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{editingSMSTemplate.id}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* SMS Template Editor Form */}
          <Card>
            <CardHeader>
              <CardTitle>SMS Template Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="smsTemplateName">Template Name</Label>
                <Input
                  id="smsTemplateName"
                  defaultValue={editingSMSTemplate.name}
                  placeholder="Enter template name..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsTemplateId">Template ID</Label>
                <Input
                  id="smsTemplateId"
                  defaultValue={editingSMSTemplate.id}
                  placeholder="template_id"
                  className="font-mono"
                  disabled
                />
                <p className="text-xs text-gray-500">Template ID cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsTemplateCategory">Category</Label>
                <Select defaultValue={editingSMSTemplate.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="📦 Locker & Pickup Notifications">📦 Locker & Pickup Notifications</SelectItem>
                    <SelectItem value="🚚 Delivery & Exception Alerts">🚚 Delivery & Exception Alerts</SelectItem>
                    <SelectItem value="✉️ Onboarding & Billing">✉️ Onboarding & Billing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsTemplateContent">SMS Message</Label>
                <Textarea
                  id="smsTemplateContent"
                  rows={6}
                  value={smsContent}
                  onChange={(e) => setSmsContent(e.target.value)}
                  placeholder="Enter your SMS message here..."
                  className="font-mono"
                />
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">
                    Use variables like [first_name], [app_name], [pickup_code], etc.
                  </span>
                  <span
                    className={`font-medium ${calculateCharCount(smsContent) > 160 ? "text-red-600" : "text-green-600"}`}
                  >
                    {calculateCharCount(smsContent)}/160 characters
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsTemplateStatus">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Test Send
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SMS Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                SMS Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {/* iPhone Mockup */}
              <div className="relative">
                {/* Phone Frame */}
                <div className="w-[280px] h-[580px] bg-black rounded-[40px] p-2 shadow-2xl">
                  <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-white px-6 py-2 flex justify-between items-center text-black text-sm font-medium">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 border border-black rounded-sm">
                          <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* Messages Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        M
                      </div>
                      <div>
                        <div className="font-semibold text-black">Metro Package Manager</div>
                        <div className="text-xs text-gray-500">now</div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 bg-white">
                      <div className="space-y-4">
                        {/* Previous message */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-[200px]">
                            <p className="text-sm text-black">
                              Welcome to Metro Package Manager! Your account is now active.
                            </p>
                            <div className="text-xs text-gray-500 mt-1">Yesterday</div>
                          </div>
                        </div>

                        {/* Current SMS template preview */}
                        <div className="flex justify-start">
                          <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-[200px]">
                            <p className="text-sm text-black whitespace-pre-wrap">{replaceVariables(smsContent)}</p>
                            <div className="text-xs text-gray-500 mt-1">now</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Message Input */}
                    <div className="bg-gray-50 p-4 border-t">
                      <div className="bg-white rounded-full px-4 py-2 border flex items-center gap-2">
                        <span className="text-gray-400 text-sm flex-1">Message</span>
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Character Count Overlay */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <Badge
                    variant={calculateCharCount(smsContent) > 160 ? "destructive" : "default"}
                    className={calculateCharCount(smsContent) > 160 ? "" : "bg-green-500"}
                  >
                    {calculateCharCount(smsContent)}/160 chars
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variables Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Available Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h5 className="font-medium mb-3 text-blue-600">User Variables</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-blue-600">[first_name]</code>
                    <span className="text-gray-500">John</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-blue-600">[last_name]</code>
                    <span className="text-gray-500">Doe</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3 text-green-600">Package Variables</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-green-600">[sender_name]</code>
                    <span className="text-gray-500">Amazon</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-green-600">[locker_id]</code>
                    <span className="text-gray-500">L-42</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-green-600">[locker_access_code]</code>
                    <span className="text-gray-500">8472</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3 text-purple-600">Location Variables</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-purple-600">[facility_name]</code>
                    <span className="text-gray-500">Main Office</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-purple-600">[locker_location]</code>
                    <span className="text-gray-500">Main Office Lobby</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-purple-600">[hub_hours]</code>
                    <span className="text-gray-500">Mon-Fri 9AM-6PM</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-3 text-orange-600">System Variables</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-orange-600">[app_name]</code>
                    <span className="text-gray-500">Metro Package Manager</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-orange-600">[support_phone]</code>
                    <span className="text-gray-500">(555) 123-4567</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <code className="text-orange-600">[tracking_number]</code>
                    <span className="text-gray-500">1Z999AA1234567890</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Email Template Editor
  if (editingTemplate) {
    return (
      <div className="p-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => setEditingTemplate(null)} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Email Template</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Template Key:{" "}
                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{editingTemplate.key}</code>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Template Editor Form */}
          <Card>
            <CardHeader>
              <CardTitle>Template Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input id="templateName" defaultValue={editingTemplate.name} placeholder="Enter template name..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateKey">Template Key</Label>
                <Input
                  id="templateKey"
                  defaultValue={editingTemplate.key}
                  placeholder="template_key"
                  className="font-mono"
                  disabled
                />
                <p className="text-xs text-gray-500">Template key cannot be changed</p>
              </div>

              {editingTemplate.key !== "email_header" && editingTemplate.key !== "email_footer" && (
                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Subject Line</Label>
                  <Input
                    id="templateSubject"
                    value={templateSubject}
                    onChange={(e) => setTemplateSubject(e.target.value)}
                    placeholder="Enter subject line..."
                    className="font-mono"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="templateContent">
                  {editingTemplate.key === "email_header" || editingTemplate.key === "email_footer"
                    ? "HTML Template"
                    : "Email Content"}
                </Label>
                <Textarea
                  id="templateContent"
                  rows={editingTemplate.key === "email_header" || editingTemplate.key === "email_footer" ? 20 : 12}
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="Enter your email template content here..."
                  className="font-mono"
                />
                <p className="text-xs text-gray-500">
                  Use variables like [first_name], [app_name], [pickup_code], etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateLanguage">Language</Label>
                <Select defaultValue="en_US">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_US">English (US)</SelectItem>
                    <SelectItem value="es_ES">Spanish (ES)</SelectItem>
                    <SelectItem value="fr_FR">French (FR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateStatus">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Test Send
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Email Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Preview
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={emailPreviewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmailPreviewMode("desktop")}
                  >
                    Desktop
                  </Button>
                  <Button
                    variant={emailPreviewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEmailPreviewMode("mobile")}
                  >
                    Mobile
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emailPreviewMode === "desktop" ? (
                /* Desktop Email Preview */
                <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
                  {/* Email Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-black">Metro Package Manager</div>
                          <div className="text-xs text-gray-500">notifications@metropackage.com</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">now</div>
                    </div>
                  </div>

                  {/* Email Subject */}
                  {editingTemplate.key !== "email_header" && editingTemplate.key !== "email_footer" && (
                    <div className="px-4 py-2 bg-blue-50 border-b">
                      <div className="font-semibold text-black text-sm">{replaceVariables(templateSubject)}</div>
                    </div>
                  )}

                  {/* Email Body */}
                  <div className="p-4 bg-white max-h-96 overflow-y-auto">
                    {editingTemplate.key === "email_header" || editingTemplate.key === "email_footer" ? (
                      <div className="text-xs font-mono bg-gray-100 p-3 rounded">
                        <div className="text-gray-600 mb-2">HTML Preview:</div>
                        <div className="whitespace-pre-wrap text-gray-800">{templateContent}</div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-sm text-black">
                        <div className="whitespace-pre-wrap">{replaceVariables(templateContent)}</div>
                      </div>
                    )}
                  </div>

                  {/* Email Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex gap-4">
                        <button className="hover:text-blue-600">Reply</button>
                        <button className="hover:text-blue-600">Forward</button>
                        <button className="hover:text-blue-600">Archive</button>
                      </div>
                      <div>📎 No attachments</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Mobile Email Preview */
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="w-[280px] h-[580px] bg-black rounded-[40px] p-2 shadow-2xl">
                      <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                        {/* Status Bar */}
                        <div className="bg-white px-6 py-2 flex justify-between items-center text-black text-sm font-medium">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <div className="w-4 h-2 border border-black rounded-sm">
                              <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                            </div>
                          </div>
                        </div>

                        {/* Email App Header */}
                        <div className="bg-blue-500 px-4 py-3 flex items-center gap-3 text-white">
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <Mail className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">Mail</div>
                          </div>
                        </div>

                        {/* Email Content */}
                        <div className="flex-1 bg-white overflow-y-auto">
                          {/* Email Header */}
                          <div className="p-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                M
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-sm text-black">Metro Package Manager</div>
                                <div className="text-xs text-gray-500">notifications@metropackage.com</div>
                              </div>
                            </div>

                            {/* Subject Line */}
                            {editingTemplate.key !== "email_header" && editingTemplate.key !== "email_footer" && (
                              <div className="font-semibold text-black text-sm mb-1">
                                {replaceVariables(templateSubject)}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">now</div>
                          </div>

                          {/* Email Body */}
                          <div className="p-4">
                            {editingTemplate.key === "email_header" || editingTemplate.key === "email_footer" ? (
                              <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                                <div className="text-gray-600 mb-1 text-xs">HTML:</div>
                                <div className="whitespace-pre-wrap text-gray-800 text-xs leading-tight">
                                  {templateContent.substring(0, 200)}...
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3 text-sm text-black leading-relaxed">
                                <div className="whitespace-pre-wrap">{replaceVariables(templateContent)}</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Mobile Email Actions */}
                        <div className="bg-gray-50 p-3 border-t flex justify-around">
                          <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">↩</div>
                            Reply
                          </button>
                          <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">↪</div>
                            Forward
                          </button>
                          <button className="flex flex-col items-center gap-1 text-xs text-gray-600">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">🗑</div>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Variables Reference - Show only in desktop mode to save space */}
              {emailPreviewMode === "desktop" && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Available Variables</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[first_name]</code>
                        <span className="text-gray-500">John</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[last_name]</code>
                        <span className="text-gray-500">Doe</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[app_name]</code>
                        <span className="text-gray-500">Metro Package Manager</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[pickup_code]</code>
                        <span className="text-gray-500">12345</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[facility_name]</code>
                        <span className="text-gray-500">Main Office</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[sender_name]</code>
                        <span className="text-gray-500">Amazon</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[tracking_number]</code>
                        <span className="text-gray-500">1Z999AA1234567890</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <code className="text-blue-600">[support_email]</code>
                        <span className="text-gray-500">support@metro.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communication Templates</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage email and SMS templates for all your communication needs.
        </p>
      </div>

      <Tabs defaultValue="email-templates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="email-templates">Email Templates</TabsTrigger>
          <TabsTrigger value="sms-templates">SMS Templates</TabsTrigger>
          <TabsTrigger value="template-editor">Template Editor</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* Email Templates Tab */}
        <TabsContent value="email-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Templates
                  </CardTitle>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Email Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group email templates by category */}
                {[
                  {
                    category: "📩 User Account & Access",
                    templates: [
                      {
                        key: "user_welcome_email",
                        name: "User Welcome Email",
                        subject: "Welcome to [app_name]!",
                        preview: "Welcome to [app_name]! We're glad you're here.",
                      },
                      {
                        key: "user_request_password_reset",
                        name: "User Request Password Reset",
                        subject: "[app_name] Password Reset",
                        preview: "Use the link below to reset your password for [app_name].",
                      },
                      {
                        key: "user_password_reset",
                        subject: "Your [app_name] password has been reset",
                        preview: "Your password was successfully updated.",
                      },
                      {
                        key: "user_account_locked_out",
                        subject: "[app_name] account has been locked",
                        preview: "Too many failed login attempts. Your account is temporarily locked.",
                      },
                      {
                        key: "user_verify_email",
                        subject: "Verify your email with [app_name]",
                        preview: "Click the link below to verify your email and activate your account.",
                      },
                      {
                        key: "user_verified",
                        subject: "Verification success for [app_name]",
                        preview: "Your email address has been verified. You may now sign in.",
                      },
                      {
                        key: "user_logged_in",
                        subject: "Login Success for [app_name]",
                        preview: "You successfully logged in. If this wasn't you, please contact us.",
                      },
                    ],
                  },
                  {
                    category: "📦 Locker & Pickup Notifications",
                    templates: [
                      {
                        key: "delivery_confirmation",
                        subject: "[app_name]: Package from [sender_name] delivered",
                        preview: "In locker [locker_id] at [locker_location]. Access code: [locker_access_code].",
                      },
                      {
                        key: "pickup_ready",
                        subject: "[app_name]: Package from [sender_name] ready",
                        preview: "Ready at [facility_name]. Hours: [hub_hours]. Bring your ID.",
                      },
                      {
                        key: "reminder",
                        subject: "[app_name]: Reminder: Package from [sender_name]",
                        preview: "Please collect it by [pickup_deadline_date].",
                      },
                      {
                        key: "urgent_pickup",
                        subject: "[app_name]: Final Reminder – Pickup by [pickup_date]",
                        preview: "Uncollected packages will be returned.",
                      },
                      {
                        key: "pickup_confirmation",
                        subject: "[app_name]: Package from [sender_name] picked up",
                        preview: "([tracking_number]) picked up on [pickup_date].",
                      },
                    ],
                  },
                  {
                    category: "🚚 Delivery & Exception Alerts",
                    templates: [
                      {
                        key: "delay_notification",
                        subject: "[app_name]: Delay Notice – Package from [sender_name]",
                        preview: "Sorry! Your package is delayed. Notification will follow upon arrival.",
                      },
                      {
                        key: "special_handling",
                        subject: "[app_name]: Special Handling Required",
                        preview: "([type_of_package]) needs pickup at [facility_name] before [pickup_date].",
                      },
                      {
                        key: "received",
                        subject: "[app_name]: Package from [sender_name] has arrived",
                        preview: "Pick up at your earliest convenience at [facility_name].",
                      },
                    ],
                  },
                  {
                    category: "✉️ Onboarding & Billing",
                    templates: [
                      {
                        key: "welcome_to_metro_relay",
                        subject: "Welcome to [app_name] – Your New Hub",
                        preview: "[customer_address_and_code] [facility_address]. Hub hours: [hub_hours].",
                      },
                      {
                        key: "payment_declined",
                        subject: "[app_name]: Payment Failed for [sender_name]",
                        preview:
                          "Payment on [date] ($[amount]/mo) declined. Please update via dashboard to avoid interruption.",
                      },
                    ],
                  },
                  {
                    category: "🎨 Headers & Footers",
                    templates: [
                      {
                        key: "email_header",
                        subject: "N/A (Header Template)",
                        preview: "HTML email header with logo, branding, and styling.",
                      },
                      {
                        key: "email_footer",
                        subject: "N/A (Footer Template)",
                        preview: "HTML email footer with contact info, unsubscribe, and legal links.",
                      },
                    ],
                  },
                ].map((group) => (
                  <div key={group.category} className="border rounded-lg">
                    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
                      <h3 className="font-semibold text-lg">{group.category}</h3>
                    </div>

                    <div className="border rounded-lg">
                      <div className="grid grid-cols-4 gap-4 p-4 border-b font-medium text-sm bg-gray-50 dark:bg-gray-800">
                        <div>Template Key</div>
                        <div>Subject</div>
                        <div>Body Preview</div>
                        <div>Actions</div>
                      </div>

                      <div className="divide-y">
                        {group.templates.map((template) => (
                          <div
                            key={template.key}
                            className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <div className="font-mono text-xs text-blue-600">{template.key}</div>
                            <div className="font-mono text-xs text-gray-700 dark:text-gray-300">{template.subject}</div>
                            <div className="text-gray-600 dark:text-gray-400 text-xs">{template.preview}</div>
                            <div className="flex justify-start">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setSelectedTemplate(template.key)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEditTemplate(template.key)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Send className="mr-2 h-4 w-4" />
                                    Test Send
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Templates Tab */}
        <TabsContent value="sms-templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    SMS Templates
                  </CardTitle>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New SMS Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Template List */}
                <div className="space-y-6">
                  {/* Group SMS templates by category */}
                  {["📦 Locker & Pickup Notifications", "🚚 Delivery & Exception Alerts", "✉️ Onboarding & Billing"].map(
                    (category) => (
                      <div key={category} className="border rounded-lg">
                        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b">
                          <h3 className="font-semibold text-lg">{category}</h3>
                        </div>

                        <div className="divide-y">
                          {smsTemplates
                            .filter((template) => template.category === category)
                            .map((template) => (
                              <div key={template.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium">{template.name}</h4>
                                      <Badge variant={template.charCount > 160 ? "destructive" : "default"}>
                                        {template.charCount}/160
                                      </Badge>
                                      <Badge variant="default" className="bg-green-500">
                                        {template.status}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                      {template.message}
                                    </div>
                                  </div>
                                  <div className="flex space-x-1 ml-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <Eye className="mr-2 h-4 w-4" />
                                          Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleEditSMSTemplate(template.id)}>
                                          <Edit className="mr-2 h-4 w-4" />
                                          Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Copy className="mr-2 h-4 w-4" />
                                          Duplicate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Send className="mr-2 h-4 w-4" />
                                          Test Send
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Last modified: {template.lastModified} • ID: {template.id}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Template Editor Tab */}
        <TabsContent value="template-editor" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Editor */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle>Template Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateType">Template Type</Label>
                  <Select defaultValue="email">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Template</SelectItem>
                      <SelectItem value="sms">SMS Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input
                    id="templateName"
                    placeholder="Enter template name..."
                    defaultValue="Package Ready Notification"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateSubject">Subject Line (Email only)</Label>
                  <Input
                    id="templateSubject"
                    placeholder="Enter subject line..."
                    defaultValue="📦 Your package is ready for pickup!"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="templateContent">Template Content</Label>
                  <Textarea
                    id="templateContent"
                    rows={8}
                    placeholder="Enter your template content here..."
                    defaultValue="Hi {{firstName}},

Great news! Your package has arrived and is ready for pickup.

📦 Pickup Details:
• Code: {{pickupCode}}
• Location: {{locationName}}
• Hours: Mon-Fri 9AM-6PM

Questions? Reply to this email or call us at {{supportPhone}}.

Best regards,
{{companyName}} Team"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Character count: 245 characters (Email)
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Preview */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {/* iPhone Mockup */}
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="w-[280px] h-[580px] bg-black rounded-[40px] p-2 shadow-2xl">
                    <div className="w-full h-full bg-white rounded-[32px] overflow-hidden relative">
                      {/* Status Bar */}
                      <div className="bg-white px-6 py-2 flex justify-between items-center text-black text-sm font-medium">
                        <span>9:41</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-2 border border-black rounded-sm">
                            <div className="w-3 h-1 bg-black rounded-sm m-0.5"></div>
                          </div>
                        </div>
                      </div>

                      {/* Messages Header */}
                      <div className="bg-gray-50 px-4 py-3 border-b flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-black">Metro Package Manager</div>
                          <div className="text-xs text-gray-500">now</div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 p-4 bg-white">
                        <div className="space-y-4">
                          {/* Previous message */}
                          <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-[200px]">
                              <p className="text-sm text-black">
                                Welcome to Metro Package Manager! Your account is now active.
                              </p>
                              <div className="text-xs text-gray-500 mt-1">Yesterday</div>
                            </div>
                          </div>

                          {/* Current SMS template preview */}
                          <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-2xl rounded-bl-md px-4 py-2 max-w-[200px]">
                              <p className="text-sm text-black">
                                📦 Hi John, your package is ready for pickup! Code: 12345 at Main Office. Hours: Mon-Fri
                                9AM-6PM. Questions? Call (555) 123-4567.
                              </p>
                              <div className="text-xs text-gray-500 mt-1">now</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Input */}
                      <div className="bg-gray-50 p-4 border-t">
                        <div className="bg-white rounded-full px-4 py-2 border flex items-center gap-2">
                          <span className="text-gray-400 text-sm flex-1">Message</span>
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Character Count Overlay */}
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-green-500">
                      142/160 chars
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Preview */}
            <Card className="xl:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Email Client Mockup */}
                <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
                  {/* Email Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          M
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-black">Metro Package Manager</div>
                          <div className="text-xs text-gray-500">notifications@metropackage.com</div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">now</div>
                    </div>
                  </div>

                  {/* Email Subject */}
                  <div className="px-4 py-2 bg-blue-50 border-b">
                    <div className="font-semibold text-black text-sm">📦 Your package is ready for pickup!</div>
                  </div>

                  {/* Email Body */}
                  <div className="p-4 bg-white">
                    <div className="space-y-3 text-sm text-black">
                      <p>
                        Hi <strong>John</strong>,
                      </p>

                      <p>Great news! Your package has arrived and is ready for pickup.</p>

                      <div className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="font-semibold mb-2">📦 Pickup Details:</p>
                        <ul className="space-y-1 text-sm">
                          <li>
                            • <strong>Code:</strong> 12345
                          </li>
                          <li>
                            • <strong>Location:</strong> Main Office
                          </li>
                          <li>
                            • <strong>Hours:</strong> Mon-Fri 9AM-6PM
                          </li>
                        </ul>
                      </div>

                      <p>
                        Questions? Reply to this email or call us at{" "}
                        <span className="text-blue-600">(555) 123-4567</span>.
                      </p>

                      <div className="pt-2 border-t">
                        <p>
                          Best regards,
                          <br />
                          <strong>Metro Package Manager Team</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex gap-4">
                        <button className="hover:text-blue-600">Reply</button>
                        <button className="hover:text-blue-600">Forward</button>
                        <button className="hover:text-blue-600">Archive</button>
                      </div>
                      <div>📎 No attachments</div>
                    </div>
                  </div>
                </div>

                {/* Email Stats */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                    <div className="font-semibold">Desktop</div>
                    <div className="text-gray-500">Outlook, Gmail</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-center">
                    <div className="font-semibold">Mobile</div>
                    <div className="text-gray-500">iOS, Android</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Variables Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Available Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium mb-3 text-blue-600">User Variables</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-blue-600">{"{{firstName}}"}</code>
                      <span className="text-gray-500">John</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-blue-600">{"{{lastName}}"}</code>
                      <span className="text-gray-500">Doe</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-blue-600">{"{{email}}"}</code>
                      <span className="text-gray-500">john@example.com</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3 text-green-600">Package Variables</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-green-600">{"{{pickupCode}}"}</code>
                      <span className="text-gray-500">12345</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-green-600">{"{{locationName}}"}</code>
                      <span className="text-gray-500">Main Office</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-green-600">{"{{trackingNumber}}"}</code>
                      <span className="text-gray-500">1Z999AA1234567890</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-3 text-purple-600">System Variables</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-purple-600">{"{{companyName}}"}</code>
                      <span className="text-gray-500">Metro Package Manager</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-purple-600">{"{{supportPhone}}"}</code>
                      <span className="text-gray-500">(555) 123-4567</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <code className="text-purple-600">{"{{loginUrl}}"}</code>
                      <span className="text-gray-500">app.metropackage.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Test Email Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailTemplate">Select Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose email template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user_welcome_email">User Welcome Email</SelectItem>
                      <SelectItem value="delivery_confirmation">Delivery Confirmation</SelectItem>
                      <SelectItem value="pickup_ready">Pickup Ready</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testEmailAddress">Test Email Address</Label>
                  <Input id="testEmailAddress" type="email" placeholder="test@example.com" />
                </div>

                <div className="space-y-2">
                  <Label>Test Data</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Input placeholder="First Name" defaultValue="John" />
                    <Input placeholder="Last Name" defaultValue="Doe" />
                    <Input placeholder="Pickup Code" defaultValue="12345" />
                    <Input placeholder="Location" defaultValue="Main Office" />
                  </div>
                </div>

                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </CardContent>
            </Card>

            {/* SMS Testing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Test SMS Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsTemplate">Select Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose SMS template..." />
                    </SelectTrigger>
                    <SelectContent>
                      {smsTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testPhoneNumber">Test Phone Number</Label>
                  <Input id="testPhoneNumber" type="tel" placeholder="+1234567890" />
                </div>

                <div className="space-y-2">
                  <Label>Test Data</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Input placeholder="First Name" defaultValue="John" />
                    <Input placeholder="Plan Name" defaultValue="Basic" />
                    <Input placeholder="Days Left" defaultValue="5" />
                    <Input placeholder="Pickup Code" defaultValue="12345" />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-1">Preview:</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    📦 Your package is ready for pickup! Code: 12345 at Main Office. Reply STOP to opt out.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">95/160 characters</div>
                </div>

                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Test SMS
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Test History */}
          <Card>
            <CardHeader>
              <CardTitle>Test History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="grid grid-cols-5 gap-4 p-4 border-b font-medium text-sm bg-gray-50 dark:bg-gray-800">
                  <div>Timestamp</div>
                  <div>Type</div>
                  <div>Template</div>
                  <div>Recipient</div>
                  <div>Status</div>
                </div>

                <div className="divide-y">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div>2024-01-15 14:30</div>
                    <div>Email</div>
                    <div>Welcome Email</div>
                    <div>test@example.com</div>
                    <div>
                      <Badge variant="default" className="bg-green-500">
                        Sent
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div>2024-01-15 14:25</div>
                    <div>SMS</div>
                    <div>Package Ready</div>
                    <div>+1234567890</div>
                    <div>
                      <Badge variant="default" className="bg-green-500">
                        Delivered
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm">
                    <div>2024-01-15 13:45</div>
                    <div>Email</div>
                    <div>Password Reset</div>
                    <div>test@example.com</div>
                    <div>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Export Templates</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </div>
  )
}
