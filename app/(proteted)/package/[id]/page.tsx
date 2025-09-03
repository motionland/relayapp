"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, ClipboardCopy, CalendarClock, Building } from "lucide-react"
import Image from "next/image"

export default function PackageDetailPage() {
  const params = useParams()
  const router = useRouter()
  const packageId = params.id as string
  const [expandedSection, setExpandedSection] = useState<string | null>("timeline")

  // Mock data - in a real app, you would fetch this based on the packageId
  const packageData = {
    id: packageId,
    carrier: "Amazon",
    tracking: "TBA1234567890",
    status: "Ready for pickup",
    arrivalDate: "March 27, 2025",
    availableUntil: "March 31, 2025, 6:00 PM",
    pickupHours: "9:00 AM - 6:00 PM",
    location: "Warehouse A01",
    weight: "2.5 kg",
    size: "Medium",
    timeline: [
      {
        status: "Package Arrived at Warehouse",
        timestamp: "March 27, 2025, 9:30 AM",
        note: "Received from carrier or supplier",
        completed: true,
      },
      {
        status: "Package Scanned In",
        timestamp: "March 27, 2025, 9:32 AM",
        note: "Checked into warehouse system",
        completed: true,
      },
      {
        status: "Storage Location Assigned",
        timestamp: "March 27, 2025, 9:35 AM",
        note: "Stored at: A01-R01-B03-L02",
        completed: true,
      },
      {
        status: "Package Ready for Pickup",
        timestamp: "March 27, 2025, 10:00 AM",
        note: "Customer notified or request acknowledged",
        completed: true,
      },
      {
        status: "Pickup Initiated",
        timestamp: "Pending",
        note: "Staff began processing pickup",
        completed: false,
      },
      {
        status: "Customer Signature",
        timestamp: "Pending",
        note: "Proof of handoff captured",
        completed: false,
      },
      {
        status: "Pickup Completed",
        timestamp: "Pending",
        note: "Package released to customer",
        completed: false,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">{packageId}</h1>
          <div className="flex items-center mt-1">
            <Badge className="bg-green-100 text-green-700 border-0">{packageData.status}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Package Image and Basic Info */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-48 bg-gray-100">
            <Image
              src="/placeholder.svg?height=200&width=600&text=Amazon+Package"
              alt="Package"
              fill
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Carrier</p>
                <p className="font-medium">{packageData.carrier}</p>
              </div>
              <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1280px-Amazon_logo.svg.png"
                  alt="Amazon Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono font-medium">{packageData.tracking}</p>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ClipboardCopy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-medium">{packageData.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium">{packageData.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pickup Information */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-5">
          <h2 className="font-medium text-lg mb-4">Pickup Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CalendarClock className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available until</p>
                <p className="font-medium">{packageData.availableUntil}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pickup hours</p>
                <p className="font-medium">{packageData.pickupHours}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Building className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hub location</p>
                <p className="font-medium">{packageData.location}</p>
                <p className="text-sm text-blue-600 underline cursor-pointer">View on map</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">Start Pickup Process</Button>
          </div>
        </div>

        {/* Package Timeline */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-5">
          <h2 className="font-medium text-lg mb-4">Package Timeline</h2>

          <div className="space-y-6">
            {packageData.timeline.map((event, index) => (
              <div key={index} className="relative pl-6">
                {index < packageData.timeline.length - 1 && (
                  <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-gray-200"></div>
                )}
                <div className="absolute left-0 top-1">
                  <div className={`w-3.5 h-3.5 rounded-full ${event.completed ? "bg-green-500" : "bg-gray-300"}`}></div>
                </div>
                <div>
                  <p className="font-medium">{event.status}</p>
                  <p className="text-sm text-gray-500">{event.timestamp}</p>
                  <p className="text-xs text-gray-400 italic mt-1">{event.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
