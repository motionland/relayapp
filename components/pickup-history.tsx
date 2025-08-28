"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, User, ChevronRight, Building } from "lucide-react"
import PickupDetails from "./pickup-details"
import {
  generateRandomPickups,
  getColorForPickup,
  getTextColorForBg,
  getWarehouseAddress,
} from "@/utils/warehouse-utils"
import type { PickupHistoryItem } from "@/types"

interface PickupHistoryProps {
  visible?: boolean
}

// Mock data for recent pickups - base entries
const basePickups: PickupHistoryItem[] = [
  {
    id: "PU-20250327-001",
    timestamp: "Today, 10:23 AM",
    customer: "John Doe",
    location: "Warehouse A01",
    packages: [
      { id: "P-20250327-12345", bin: "A01-R01-B01-L05" },
      { id: "P-20250327-67890", bin: "A01-R02-B02-L10" },
    ],
    status: "completed",
  },
  {
    id: "PU-20250327-002",
    timestamp: "Today, 09:15 AM",
    customer: "Jane Smith",
    location: "Warehouse A01",
    packages: [{ id: "P-20250327-54321", bin: "A01-R03-B03-L15" }],
    status: "completed",
  },
]

export default function PickupHistory({ visible = true }: PickupHistoryProps) {
  const [selectedPickup, setSelectedPickup] = useState<PickupHistoryItem | null>(null)
  const [showCode, setShowCode] = useState(false)

  // Generate random pickups only once using useMemo
  const recentPickups = useMemo(() => {
    return [...basePickups, ...generateRandomPickups(10)]
  }, [])

  // If not visible, don't render anything
  if (!visible) return null

  if (selectedPickup) {
    return <PickupDetails pickup={selectedPickup} onBack={() => setSelectedPickup(null)} />
  }

  return (
    <div className="bg-white py-4 space-y-3 rounded-lg">
      <div className="px-4">
        <h2 className="text-lg font-medium text-gray-900 mb-1">Pickup history</h2>
        <p className="text-gray-500 text-sm">Your recent package pickup activity</p>
      </div>

      <div className="space-y-3">
        {recentPickups.map((pickup) => {
          const colorClass = getColorForPickup(pickup.id)
          const textColor = getTextColorForBg(colorClass)

          return (
            <div key={pickup.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className={`font-medium ${textColor}`}>{pickup.id}</div>
                  <div className="text-gray-500 text-sm">{pickup.timestamp}</div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs border-0 ${
                    pickup.status === "completed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  Picked up
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <User className={`h-3.5 w-3.5 ${textColor.replace("700", "500")}`} />
                <span className="text-gray-600 text-sm">{pickup.customer}</span>
              </div>

              <div className="flex items-center gap-2 mb-1">
                <Building className={`h-3.5 w-3.5 ${textColor.replace("700", "500")}`} />
                <div className="text-sm">
                  <span className="text-gray-600">{pickup.location}</span>
                  <p className="text-gray-500 text-xs">{getWarehouseAddress(pickup.location)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Package className={`h-3.5 w-3.5 mr-1 ${textColor.replace("700", "500")}`} />
                  <span>{pickup.packages.length} packages</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-7 text-xs p-0 flex items-center ${textColor}`}
                  onClick={() => setSelectedPickup(pickup)}
                >
                  Details
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      <Button variant="outline" className="w-full h-12 text-gray-700 border-gray-200 rounded-xl">
        View All History
      </Button>

      {/* See Code section */}
      <div className="mt-6 border-t pt-6">
        <Button variant="outline" className="mb-4" onClick={() => setShowCode(!showCode)}>
          {showCode ? "Hide Code" : "See Code"}
        </Button>

        {showCode && (
          <div className="bg-gray-50 p-4 rounded-xl overflow-auto">
            <pre className="text-xs">
              {`<div
  key={pickup.id}
  className={\`rounded-xl p-4 border shadow-sm \${colorClass} transition-all duration-200 hover:shadow-md\`}
>
  <div className="flex justify-between items-start mb-2">
    <div>
      <div className={\`font-medium \${textColor}\`}>{pickup.id}</div>
      <div className="text-gray-500 text-sm">{pickup.timestamp}</div>
    </div>
    <Badge
      variant="outline"
      className={\`text-xs border-0 \${
        pickup.status === "completed" ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
      }\`}
    >
      {pickup.status === "completed" ? "Completed" : "In Progress"}
    </Badge>
  </div>

  <div className="flex items-center gap-2 mb-1">
    <User className={\`h-3.5 w-3.5 \${textColor.replace("700", "500")}\`} />
    <span className="text-gray-600 text-sm">{pickup.customer}</span>
  </div>

  <div className="flex items-center gap-2 mb-1">
    <Building className={\`h-3.5 w-3.5 \${textColor.replace("700", "500")}\`} />
    <div className="text-sm">
      <span className="text-gray-600">{pickup.location}</span>
      <p className="text-gray-500 text-xs">{getWarehouseAddress(pickup.location)}</p>
    </div>
  </div>

  <div className="flex items-center justify-between mt-3">
    <div className="flex items-center text-sm text-gray-500">
      <Package className={\`h-3.5 w-3.5 mr-1 \${textColor.replace("700", "500")}\`} />
      <span>{pickup.packages.length} packages</span>
    </div>
    <Button
      variant="ghost"
      size="sm"
      className={\`h-7 text-xs p-0 flex items-center \${textColor}\`}
      onClick={() => setSelectedPickup(pickup)}
    >
      Details
      <ChevronRight className="h-3.5 w-3.5 ml-1" />
    </Button>
  </div>
</div>`}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
