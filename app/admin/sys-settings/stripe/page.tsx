"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, TestTube, Copy, Plus, Trash2 } from "lucide-react"

export default function StripeIntegrationPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stripe Integration</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure Stripe payment processing, webhooks, and subscription plans.
        </p>
      </div>

      <Tabs defaultValue="keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="plans">Plan Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stripe API Keys</CardTitle>
              <CardDescription>Configure your Stripe publishable and secret keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Switch id="testMode" defaultChecked />
                <Label htmlFor="testMode">Test Mode</Label>
                <span className="text-sm text-gray-500 dark:text-gray-400">(Use test keys for development)</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishableKey">Publishable Key</Label>
                <div className="flex space-x-2">
                  <Input id="publishableKey" type="password" placeholder="pk_test_..." className="flex-1" />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <div className="flex space-x-2">
                  <Input id="secretKey" type="password" placeholder="sk_test_..." className="flex-1" />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Configure webhook endpoints for Stripe events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input id="webhookUrl" defaultValue="https://yourdomain.com/api/stripe/webhook" readOnly />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookSecret">Webhook Secret</Label>
                <div className="flex space-x-2">
                  <Input id="webhookSecret" type="password" placeholder="whsec_..." className="flex-1" />
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook Events</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>payment_intent.succeeded</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>payment_intent.payment_failed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>customer.subscription.created</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>customer.subscription.updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>customer.subscription.deleted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>invoice.payment_succeeded</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscription Plans</CardTitle>
                  <CardDescription>Manage your subscription plans and pricing</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Plan */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Basic Plan</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Perfect for small businesses</p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">$29</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Stripe Price ID: price_1234567890</div>
                </div>

                {/* Premium Plan */}
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Premium Plan</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">For growing businesses</p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">$79</span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Stripe Price ID: price_0987654321</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Currency Settings</CardTitle>
              <CardDescription>Configure tax rates and currency preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                      <SelectItem value="gbp">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" defaultValue="8.5" step="0.1" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="automaticTax" />
                <Label htmlFor="automaticTax">Enable Stripe Tax (Automatic tax calculation)</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="collectBilling" defaultChecked />
                <Label htmlFor="collectBilling">Collect billing address</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Stripe Settings
        </Button>
      </div>
    </div>
  )
}
