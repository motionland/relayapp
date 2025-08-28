"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { memo } from "react"

interface PickupCompleteProps {
  warehouseCapacity: number
  onReset: () => void
}

// Use memo to prevent unnecessary re-renders
const PickupComplete = memo(function PickupComplete({ warehouseCapacity, onReset }: PickupCompleteProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Pickup Complete</h2>
        <p className="text-gray-500 text-sm">The pickup has been successfully processed</p>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-center">Success</h3>
        <p className="text-gray-500 text-sm text-center mt-1">All packages have been picked up</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">Warehouse Capacity</p>
        <p className="font-medium">{warehouseCapacity} slots available</p>
      </div>

      <Button className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl" onClick={onReset}>
        New Pickup
      </Button>
    </div>
  )
})

export default PickupComplete
