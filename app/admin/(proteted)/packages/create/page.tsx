"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import PackageReceivingForm from "@/components/package-receiving-form"

export default function CreatePackagePage() {
  const [showForm, setShowForm] = useState(true)

  const handleBack = () => {
    setShowForm(false)
    // In a real app, this would navigate back to the packages list
    window.history.back()
  }

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Package Created Successfully</h2>
          <p className="text-gray-600 mb-6">The package has been added to the system.</p>
          <Button onClick={() => setShowForm(true)}>Create Another Package</Button>
        </div>
      </div>
    )
  }

  return <PackageReceivingForm userRole="metro-staff" onBack={handleBack} />
}
