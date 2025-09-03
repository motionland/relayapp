"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Trash2 } from "lucide-react"

export default function AdminProfilePage() {
  const [adminProfile, setAdminProfile] = useState({
    firstName: "Admin",
    lastName: "User",
    email: "admin@metro.com",
    phone: "+1 (555) 123-4567",
    bio: "Metro Admin with 5+ years of experience in logistics and warehouse management.",
    jobTitle: "System Administrator",
    department: "Operations",
    employeeId: "EMP-001",
    avatar: "",
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file)
      setAdminProfile({ ...adminProfile, avatar: imageUrl })
    }
  }

  const handleDeleteAvatar = () => {
    if (adminProfile.avatar) {
      // Revoke object URL to prevent memory leaks
      if (adminProfile.avatar.startsWith("blob:")) {
        URL.revokeObjectURL(adminProfile.avatar)
      }
      setAdminProfile({ ...adminProfile, avatar: "" })
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Personal info</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update your personal information and manage your admin profile
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile photo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {adminProfile.avatar ? (
                  <AvatarImage src={adminProfile.avatar || "/placeholder.svg"} alt="Admin Profile" />
                ) : (
                  <AvatarFallback className="text-lg bg-red-500 text-white font-semibold">
                    {adminProfile.firstName.charAt(0).toUpperCase()}
                    {adminProfile.lastName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={triggerFileInput}>
                    <Upload className="h-4 w-4 mr-2" />
                    {adminProfile.avatar ? "Change Photo" : "Upload Photo"}
                  </Button>
                  {adminProfile.avatar && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteAvatar}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG, or GIF. Max size 5MB.</p>
              </div>
              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={adminProfile.firstName}
                  onChange={(e) => setAdminProfile({ ...adminProfile, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={adminProfile.lastName}
                  onChange={(e) => setAdminProfile({ ...adminProfile, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={adminProfile.phone}
                onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={adminProfile.bio}
                onChange={(e) => setAdminProfile({ ...adminProfile, bio: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle>Work Information</CardTitle>
            <CardDescription>Your role and department information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={adminProfile.jobTitle}
                onChange={(e) => setAdminProfile({ ...adminProfile, jobTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={adminProfile.department}
                onChange={(e) => setAdminProfile({ ...adminProfile, department: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={adminProfile.employeeId}
                onChange={(e) => setAdminProfile({ ...adminProfile, employeeId: e.target.value })}
              />
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
