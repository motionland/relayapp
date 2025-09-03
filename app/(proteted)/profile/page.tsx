"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Plus, Edit, Upload, Trash2 } from "lucide-react"
import SettingsLayout from "@/components/settings-layout"

export default function ProfilePage() {
  const [editingField, setEditingField] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    firstName: "Lutfy",
    lastName: "Ahmed",
    cashtag: "$LutfyAhmed",
    street: "123 Main Street, Apt 4B",
    city: "New York",
    state: "NY",
    zip: "10001",
    email: "",
    phone: "",
    avatar: "",
  })

  const [tempValues, setTempValues] = useState({ ...profile })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = (field: string) => {
    setEditingField(field)
    setTempValues({ ...profile })
  }

  const handleSave = (field: string) => {
    setProfile({ ...tempValues })
    setEditingField(null)
  }

  const handleCancel = () => {
    setTempValues({ ...profile })
    setEditingField(null)
  }

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
      setProfile({ ...profile, avatar: imageUrl })
    }
  }

  const handleDeleteAvatar = () => {
    if (profile.avatar) {
      // Revoke object URL to prevent memory leaks
      if (profile.avatar.startsWith("blob:")) {
        URL.revokeObjectURL(profile.avatar)
      }
      setProfile({ ...profile, avatar: "" })
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <SettingsLayout>
      <div className="max-w-2xl mx-auto bg-white dark:bg-black">
        {/* Main Content */}
        <div className="p-6 space-y-8 bg-white dark:bg-black">
          {/* Profile Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                {profile.avatar ? (
                  <AvatarImage src={profile.avatar || "/placeholder.svg"} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-blue-500 text-white text-lg font-semibold">
                    {profile.firstName.charAt(0).toUpperCase()}
                    {profile.lastName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Avatar Upload/Delete Controls */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileInput}
                className="flex items-center gap-2 bg-transparent"
              >
                <Upload className="h-4 w-4" />
                {profile.avatar ? "Change Photo" : "Upload Photo"}
              </Button>
              {profile.avatar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAvatar}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>

            {/* Hidden file input */}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">JPG, PNG, or GIF. Max size 5MB.</p>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">{profile.cashtag}</p>
            </div>
          </div>

          {/* Personal Details */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal info</h3>

            {/* Full name */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Full name</p>
              {editingField === "name" ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={tempValues.firstName}
                      onChange={(e) => setTempValues({ ...tempValues, firstName: e.target.value })}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                    />
                    <Input
                      value={tempValues.lastName}
                      onChange={(e) => setTempValues({ ...tempValues, lastName: e.target.value })}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSave("name")}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit("name")}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* $cashtag */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">$cashtag</p>
              {editingField === "cashtag" ? (
                <div className="space-y-3">
                  <Input
                    value={tempValues.cashtag}
                    onChange={(e) => setTempValues({ ...tempValues, cashtag: e.target.value })}
                    className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSave("cashtag")}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 dark:text-white">{profile.cashtag}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit("cashtag")}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
              {editingField === "address" ? (
                <div className="space-y-3">
                  <Input
                    value={tempValues.street}
                    onChange={(e) => setTempValues({ ...tempValues, street: e.target.value })}
                    className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                    placeholder="Street address"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      value={tempValues.city}
                      onChange={(e) => setTempValues({ ...tempValues, city: e.target.value })}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      placeholder="City"
                    />
                    <Input
                      value={tempValues.state}
                      onChange={(e) => setTempValues({ ...tempValues, state: e.target.value })}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      placeholder="State"
                    />
                    <Input
                      value={tempValues.zip}
                      onChange={(e) => setTempValues({ ...tempValues, zip: e.target.value })}
                      className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                      placeholder="ZIP"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSave("address")}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="text-gray-900 dark:text-white">
                    <p>{profile.street}</p>
                    <p>
                      {profile.city}, {profile.state} {profile.zip}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit("address")}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">Not provided</p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-500 dark:text-gray-400">Not provided</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  )
}
