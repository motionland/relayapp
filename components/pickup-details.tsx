"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ArrowLeft,
  Calendar,
  Clock,
  Building,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Snowflake,
  Clock3,
  Box,
  CheckCircle2,
  CalendarClock,
} from "lucide-react"
import Image from "next/image"

interface PickupDetailsProps {
  pickup: {
    id: string
    timestamp: string
    customer: string
    location: string
    packages: Array<{ id: string; bin: string }>
    status: string
  }
  onBack: () => void
}

// Package type definition
type PackageType = "Fragile" | "Fridge" | "Urgent" | "Standard"

// Function to get package type based on ID (for demo purposes)
const getPackageType = (id: string): PackageType => {
  // In a real app, this would come from the database
  // For demo, we'll determine type based on the last character of the ID
  const lastChar = id.charAt(id.length - 1)
  const lastDigit = Number.parseInt(lastChar)

  if (isNaN(lastDigit)) return "Standard"

  if (lastDigit <= 2) return "Fragile"
  if (lastDigit <= 5) return "Fridge"
  if (lastDigit <= 8) return "Urgent"
  return "Standard"
}

// Function to get icon and color for package type
const getPackageTypeInfo = (type: PackageType) => {
  switch (type) {
    case "Fragile":
      return {
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        color: "text-amber-500 bg-amber-50 border-amber-200",
      }
    case "Fridge":
      return {
        icon: <Snowflake className="h-3.5 w-3.5" />,
        color: "text-blue-500 bg-blue-50 border-blue-200",
      }
    case "Urgent":
      return {
        icon: <Clock3 className="h-3.5 w-3.5" />,
        color: "text-red-500 bg-red-50 border-red-200",
      }
    case "Standard":
    default:
      return {
        icon: <Box className="h-3.5 w-3.5" />,
        color: "text-gray-500 bg-gray-50 border-gray-200",
      }
  }
}

export default function PickupDetails({ pickup, onBack }: PickupDetailsProps) {
  const [packagesExpanded, setPackagesExpanded] = useState(false)

  // Function to parse bin location into components
  const parseBinLocation = (binLocation: string) => {
    // Example format: A01-R01-B01-L05
    const parts = binLocation.split("-")
    return {
      area: parts[0]?.charAt(0) || "", // A
      row: parts[1]?.substring(1) || "", // 01 (removing R)
      bay: parts[2]?.substring(1) || "", // 01 (removing B)
      level: parts[3]?.substring(1) || "", // 05 (removing L)
      bin: parts[0]?.substring(1, 2) || "A", // Last character of area or default to A
    }
  }

  // Get warehouse address based on location code
  const getWarehouseAddress = (locationCode: string) => {
    // In a real app, this would come from a database or API
    const warehouseAddresses: Record<string, string> = {
      "Warehouse A01": "123 Distribution Center Rd, Industrial Park, CA 94103",
      "Warehouse B02": "456 Logistics Ave, Commerce City, TX 75001",
      "Warehouse C03": "789 Supply Chain Blvd, Shipping District, NY 10001",
    }

    return warehouseAddresses[locationCode] || "1000 Warehouse Way, Storage City, ST 12345"
  }

  // Add two more example packages for display
  const enhancedPackages = [
    ...pickup.packages,
    { id: "P-20250327-99999", bin: "A02-R04-B05-L02" }, // Will be Standard type
    { id: "P-20250327-88888", bin: "A03-R01-B03-L07" }, // Will be Urgent type
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium">Pickup Details</h2>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-2xl font-semibold">{pickup.id}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{pickup.timestamp}</span>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`
          px-3 py-1 rounded-full text-xs 
          ${pickup.status === "completed" ? "bg-green-50 text-green-600 border-green-200" : "bg-blue-50 text-blue-600 border-blue-200"}
        `}
        >
          {pickup.status === "completed" ? "Completed" : "In Progress"}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Building className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer Hub Location</p>
          </div>
          <div className="pl-6">
            <p className="text-gray-700 font-medium">{pickup.location}</p>
            <p className="text-gray-500 text-sm mt-1">{getWarehouseAddress(pickup.location)}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="mb-3 pb-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <p className="font-medium text-green-700">Available for pickup</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                Ready
              </Badge>
            </div>

            <div className="mt-3 pl-6 space-y-2">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Available until: <span className="font-medium">March 31, 2025, 6:00 PM</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Pickup hours: <span className="font-medium">9:00 AM - 6:00 PM</span>
                </p>
              </div>
              <p className="text-xs text-gray-500 italic">Please bring a valid ID for package pickup</p>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-between gap-2 focus:outline-none"
            onClick={() => setPackagesExpanded(!packagesExpanded)}
          >
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <p className="font-medium">Packages ({enhancedPackages.length})</p>
            </div>
            {packagesExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {packagesExpanded && (
            <div className="space-y-3 pl-6 mt-3 animate-in slide-in-from-top-2 duration-200">
              {enhancedPackages.map((pkg, index) => {
                const packageType = getPackageType(pkg.id)
                const { icon, color } = getPackageTypeInfo(packageType)

                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-start mb-3">
                      <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                      <p className="font-medium truncate">{pkg.id}</p>
                    </div>

                    <div className="bg-white p-5 pt-10 pb-14 rounded-xl relative">
                      {/* Package Images */}
                      <div className="mb-4 pb-3 border-b border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-2">PACKAGE IMAGES</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src={`/placeholder.svg?height=80&width=80&text=Package+${pkg.id.slice(-5)}`}
                              alt="Package"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src="/placeholder.svg?height=80&width=80&text=Label"
                              alt="Package Label"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                          <div className="relative h-20 w-20 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                            <Image
                              src="/placeholder.svg?height=80&width=80&text=Side+View"
                              alt="Package Side"
                              width={80}
                              height={80}
                              className="object-cover"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Package Type Indicator */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1">
                        <div
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border ${color}`}
                        >
                          {icon}
                          <span className="uppercase">{packageType}</span>
                        </div>
                      </div>

                      {/* Package Type Legend (at bottom) */}
                      <div className="absolute bottom-3 right-3 flex gap-2 mt-4 pt-2">
                        {["Fragile", "Fridge", "Urgent", "Standard"].map((type) => {
                          const { icon, color } = getPackageTypeInfo(type as PackageType)
                          const isActive = type === packageType

                          return (
                            <div
                              key={type}
                              className={`flex items-center justify-center w-7 h-7 rounded-full border ${isActive ? color : "text-gray-300 bg-gray-50 border-gray-200"}`}
                              title={type.toUpperCase()}
                            >
                              {icon}
                            </div>
                          )
                        })}
                      </div>

                      <p className="text-gray-700 font-medium mb-4">Storage Information</p>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-5 gap-4 mb-3">
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600">AREA</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600">ROW</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600">BAY</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600">LEVEL</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-600">BIN</p>
                          </div>
                        </div>

                        {(() => {
                          const location = parseBinLocation(pkg.bin)
                          return (
                            <div className="grid grid-cols-5 gap-4 items-center">
                              <div className="text-center">
                                <p className="text-3xl font-bold">{location.area}</p>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                                <p className="text-3xl font-bold">{location.row}</p>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                                <p className="text-3xl font-bold">{location.bay}</p>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                                <p className="text-3xl font-bold">{location.level}</p>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                                <p className="text-3xl font-bold">{location.bin}</p>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <p className="font-medium">Timeline</p>
        </div>

        <div className="space-y-3 pl-6 mt-2">
          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Pickup Completed</p>
              <p className="text-xs text-gray-500">Today, 10:23 AM</p>
              <p className="text-xs text-gray-400 italic">(Package released to customer)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Customer Signature</p>
              <p className="text-xs text-gray-500">Today, 10:22 AM</p>
              <p className="text-xs text-gray-400 italic">(Proof of handoff captured)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Pickup Initiated</p>
              <p className="text-xs text-gray-500">Today, 10:20 AM</p>
              <p className="text-xs text-gray-400 italic">(Staff began processing pickup)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Package Ready for Pickup</p>
              <p className="text-xs text-gray-500">Today, 10:00 AM</p>
              <p className="text-xs text-gray-400 italic">(Customer notified or request acknowledged)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Storage Location Assigned</p>
              <p className="text-xs text-gray-500">Today, 9:35 AM</p>
              <p className="text-xs text-gray-400 italic">(Stored at: A01-R01-B03-L02)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="absolute top-3 bottom-0 left-1.5 w-0.5 bg-gray-200"></div>
            </div>
            <div>
              <p className="text-sm font-medium">Package Scanned In</p>
              <p className="text-xs text-gray-500">Today, 9:32 AM</p>
              <p className="text-xs text-gray-400 italic">(Checked into warehouse system)</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div>
              <p className="text-sm font-medium">Package Arrived at Warehouse</p>
              <p className="text-xs text-gray-500">Today, 9:30 AM</p>
              <p className="text-xs text-gray-400 italic">(Received from carrier or supplier)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
