"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Eye } from "lucide-react"

export default function EmailTemplatesPage() {
  return (
    <div className="space-y-6">
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
              <Button className="bg-blue-600 hover:bg-blue-700">Create Template</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
