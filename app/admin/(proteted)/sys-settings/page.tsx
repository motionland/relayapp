"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function SystemSettingsGeneralPage() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">General</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure app branding, company information, timezone and language settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* App Name & Branding */}
        <Card>
          <CardHeader>
            <CardTitle>App Name & Branding</CardTitle>
            <CardDescription>Configure your application's branding and identity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input id="appName" defaultValue="Metro Package Manager" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" defaultValue="Smart Package Management" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="appDescription">App Description</Label>
              <Textarea
                id="appDescription"
                defaultValue="Comprehensive package management solution for businesses"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Your company details for legal and contact purposes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="Metro Solutions Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" defaultValue="contact@metro.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea id="companyAddress" defaultValue="123 Business Ave, Suite 100, City, State 12345" rows={3} />
            </div>
          </CardContent>
        </Card>

        {/* Default Time Zone & Language */}
        <Card>
          <CardHeader>
            <CardTitle>Default Time Zone & Language</CardTitle>
            <CardDescription>Configure regional settings for your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="language">Language / Region</Label>
                <Select defaultValue="en-US">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (United States)</SelectItem>
                    <SelectItem value="en-CA">English (Canada)</SelectItem>
                    <SelectItem value="es-US">Spanish (United States)</SelectItem>
                    <SelectItem value="fr-CA">French (Canada)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save General Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
