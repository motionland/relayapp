"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Save, TestTube, CheckCircle, AlertCircle, BarChart3, Webhook } from "lucide-react"
import { useState } from "react"

export default function EmailSettingsPage() {
  const [selectedProvider, setSelectedProvider] = useState("mailgun")
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")

  const providers = [
    {
      id: "mailgun",
      name: "Mailgun",
      description: "Powerful APIs for sending, receiving and tracking email",
      features: ["99% Deliverability", "Real-time Analytics", "Email Validation", "A/B Testing"],
      pricing: "Free: 5,000 emails/month",
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Cloud-based email delivery platform",
      features: ["Advanced Analytics", "Template Engine", "Suppression Management", "Dedicated IPs"],
      pricing: "Free: 100 emails/day",
    },
    {
      id: "ses",
      name: "Amazon SES",
      description: "Cost-effective email service built on AWS",
      features: ["High Deliverability", "Flexible Deployment", "Reputation Dashboard", "Configuration Sets"],
      pricing: "$0.10 per 1,000 emails",
    },
    {
      id: "postmark",
      name: "Postmark",
      description: "Fast and reliable transactional email service",
      features: ["45-day Message History", "Detailed Analytics", "Bounce Handling", "Template Editor"],
      pricing: "Free: 100 emails/month",
    },
    {
      id: "resend",
      name: "Resend",
      description: "Modern email API for developers",
      features: ["React Email Support", "Built-in Analytics", "Domain Authentication", "Webhook Events"],
      pricing: "Free: 3,000 emails/month",
    },
    {
      id: "smtp",
      name: "Custom SMTP",
      description: "Use your own SMTP server or provider",
      features: ["Full Control", "Custom Configuration", "Any Provider", "Legacy Support"],
      pricing: "Varies by provider",
    },
  ]

  const testConnection = async () => {
    setConnectionStatus("testing")
    setTimeout(() => {
      setConnectionStatus("success")
      setTimeout(() => setConnectionStatus("idle"), 3000)
    }, 2000)
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure email providers and delivery settings for your application.
        </p>
      </div>

      <Tabs defaultValue="provider" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="provider">Provider</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        {/* Provider Setup Tab */}
        <TabsContent value="provider" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose Email Provider</CardTitle>
              <CardDescription>Select your transactional email service provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedProvider === provider.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{provider.name}</h3>
                      {selectedProvider === provider.id && <CheckCircle className="h-5 w-5 text-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{provider.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {provider.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium">{provider.pricing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          {/* Provider-specific Configuration */}
          {selectedProvider === "mailgun" && (
            <Card>
              <CardHeader>
                <CardTitle>Mailgun Configuration</CardTitle>
                <CardDescription>Configure your Mailgun API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailgunApiKey">API Key</Label>
                    <Input id="mailgunApiKey" type="password" placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailgunDomain">Domain</Label>
                    <Input id="mailgunDomain" placeholder="mg.yourdomain.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mailgunRegion">Region</Label>
                  <Select defaultValue="us">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">US (api.mailgun.net)</SelectItem>
                      <SelectItem value="eu">EU (api.eu.mailgun.net)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sender Information - Common for all providers */}
          <Card>
            <CardHeader>
              <CardTitle>Sender Information</CardTitle>
              <CardDescription>Configure the sender details for outgoing emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromName">From Name</Label>
                  <Input id="fromName" defaultValue="Metro Package Manager" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fromEmail">From Email Address</Label>
                  <Input id="fromEmail" type="email" placeholder="noreply@metro.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email (Optional)</Label>
                <Input id="replyTo" type="email" placeholder="support@metro.com" />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure additional email delivery options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="trackOpens" defaultChecked />
                <Label htmlFor="trackOpens">Track Email Opens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="trackClicks" defaultChecked />
                <Label htmlFor="trackClicks">Track Link Clicks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="unsubscribeHeader" defaultChecked />
                <Label htmlFor="unsubscribeHeader">Include Unsubscribe Header</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>Configure webhooks to receive email event notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://yourdomain.com/api/webhooks/email" />
              </div>
              <div className="space-y-2">
                <Label>Events to Track</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {[
                    "delivered",
                    "opened",
                    "clicked",
                    "bounced",
                    "complained",
                    "unsubscribed",
                    "dropped",
                    "deferred",
                  ].map((event) => (
                    <div key={event} className="flex items-center space-x-2">
                      <Switch id={event} defaultChecked={["delivered", "bounced", "complained"].includes(event)} />
                      <Label htmlFor={event} className="capitalize">
                        {event}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
                <Input id="webhookSecret" type="password" placeholder="webhook_secret_key" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {connectionStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {connectionStatus === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                Connection Status
              </CardTitle>
              <CardDescription>Test your email provider connection and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button onClick={testConnection} disabled={connectionStatus === "testing"} variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  {connectionStatus === "testing" ? "Testing..." : "Test Connection"}
                </Button>
                {connectionStatus === "success" && (
                  <Badge variant="default" className="bg-green-500">
                    Connection Successful
                  </Badge>
                )}
                {connectionStatus === "error" && <Badge variant="destructive">Connection Failed</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Email Analytics Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Email Analytics Preview
              </CardTitle>
              <CardDescription>Preview of email delivery statistics (last 30 days)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,234</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,198</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">456</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Opened</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Bounced</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Email Settings
        </Button>
      </div>
    </div>
  )
}
