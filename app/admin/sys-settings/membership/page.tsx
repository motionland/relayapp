"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, Trash2, Edit } from "lucide-react"

export default function MembershipPage() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Membership</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure membership plans, pricing, trial periods, and signup requirements.
        </p>
      </div>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="plans">Plan Pricing</TabsTrigger>
          <TabsTrigger value="trials">Trial Settings</TabsTrigger>
          <TabsTrigger value="signup">Signup Requirements</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Membership Plans</CardTitle>
                  <CardDescription>Configure your membership tiers and pricing</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Plan */}
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Basic Plan</h3>
                      <p className="text-gray-500 dark:text-gray-400">Perfect for individuals</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Monthly Price</Label>
                      <Input defaultValue="$19.99" />
                    </div>
                    <div>
                      <Label>Yearly Price</Label>
                      <Input defaultValue="$199.99" />
                    </div>
                    <div>
                      <Label>Max Packages/Month</Label>
                      <Input defaultValue="50" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Features</Label>
                    <Textarea
                      defaultValue="• Package tracking&#10;• Email notifications&#10;• Basic support"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Premium Plan</h3>
                      <p className="text-gray-500 dark:text-gray-400">For small businesses</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Monthly Price</Label>
                      <Input defaultValue="$49.99" />
                    </div>
                    <div>
                      <Label>Yearly Price</Label>
                      <Input defaultValue="$499.99" />
                    </div>
                    <div>
                      <Label>Max Packages/Month</Label>
                      <Input defaultValue="200" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Features</Label>
                    <Textarea
                      defaultValue="• Unlimited package tracking&#10;• SMS + Email notifications&#10;• Priority support&#10;• Advanced analytics"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Enterprise Plan */}
                <div className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Enterprise Plan</h3>
                      <p className="text-gray-500 dark:text-gray-400">For large organizations</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Monthly Price</Label>
                      <Input defaultValue="$199.99" />
                    </div>
                    <div>
                      <Label>Yearly Price</Label>
                      <Input defaultValue="$1999.99" />
                    </div>
                    <div>
                      <Label>Max Packages/Month</Label>
                      <Input defaultValue="Unlimited" />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Features</Label>
                    <Textarea
                      defaultValue="• Unlimited everything&#10;• Custom integrations&#10;• Dedicated support&#10;• White-label options&#10;• API access"
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trial Period Settings</CardTitle>
              <CardDescription>Configure free trial periods for new members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enableTrials" defaultChecked />
                <Label htmlFor="enableTrials">Enable Free Trials</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trialDays">Trial Period (Days)</Label>
                  <Input id="trialDays" type="number" defaultValue="14" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trialPlan">Default Trial Plan</Label>
                  <Select defaultValue="premium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Plan</SelectItem>
                      <SelectItem value="premium">Premium Plan</SelectItem>
                      <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="requireCard" />
                <Label htmlFor="requireCard">Require Credit Card for Trial</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="autoConvert" defaultChecked />
                <Label htmlFor="autoConvert">Auto-convert to paid plan after trial</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trialLimits">Trial Limitations</Label>
                <Textarea
                  id="trialLimits"
                  placeholder="Describe any limitations during trial period..."
                  defaultValue="• Limited to 10 packages during trial&#10;• No SMS notifications&#10;• Email support only"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signup Fields & Requirements</CardTitle>
              <CardDescription>Configure required fields and validation for new signups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Required Fields</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked disabled />
                    <Label>Email Address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked disabled />
                    <Label>Password</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <Label>First Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <Label>Last Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <Label>Phone Number</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <Label>Company Name</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <Label>Address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <Label>Date of Birth</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Password Requirements</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <Label className="text-sm">Minimum 8 characters</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <Label className="text-sm">At least one uppercase letter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <Label className="text-sm">At least one number</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <Label className="text-sm">At least one special character</Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="emailVerification" defaultChecked />
                <Label htmlFor="emailVerification">Require Email Verification</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="termsAcceptance" defaultChecked />
                <Label htmlFor="termsAcceptance">Require Terms & Conditions Acceptance</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cancellation & Renewal Policies</CardTitle>
              <CardDescription>Configure membership cancellation and renewal settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Cancellation Policy</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="allowCancellation" defaultChecked />
                  <Label htmlFor="allowCancellation">Allow Self-Service Cancellation</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancellationNotice">Cancellation Notice Period (Days)</Label>
                  <Input id="cancellationNotice" type="number" defaultValue="0" />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="immediateAccess" defaultChecked />
                  <Label htmlFor="immediateAccess">Maintain access until end of billing period</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Renewal Policy</h4>
                <div className="flex items-center space-x-2">
                  <Switch id="autoRenewal" defaultChecked />
                  <Label htmlFor="autoRenewal">Enable Auto-Renewal</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="renewalReminder">Renewal Reminder (Days Before)</Label>
                  <Input id="renewalReminder" type="number" defaultValue="7" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gracePeriod">Grace Period After Expiry (Days)</Label>
                  <Input id="gracePeriod" type="number" defaultValue="3" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundPolicy">Refund Policy</Label>
                <Textarea
                  id="refundPolicy"
                  placeholder="Describe your refund policy..."
                  defaultValue="Full refund within 30 days of purchase. Pro-rated refunds for annual subscriptions cancelled within 60 days."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Membership Settings
        </Button>
      </div>
    </div>
  )
}
