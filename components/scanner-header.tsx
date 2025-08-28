"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, Truck, Zap } from "lucide-react"

interface ScannerHeaderProps {
  onModeChange?: (mode: "pickup" | "receiving" | "speed-receiving") => void
  defaultMode?: "pickup" | "receiving" | "speed-receiving"
}

export default function ScannerHeader({ onModeChange, defaultMode = "pickup" }: ScannerHeaderProps) {
  const [activeMode, setActiveMode] = useState<"pickup" | "receiving" | "speed-receiving">(defaultMode)

  const handleModeChange = (mode: "pickup" | "receiving" | "speed-receiving") => {
    setActiveMode(mode)
    onModeChange?.(mode)
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">Warehouse Scanner</h1>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="px-4 pb-4">
        <div className="bg-gray-100 p-1 rounded-lg flex">
          <Button
            variant={activeMode === "pickup" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeMode === "pickup"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => handleModeChange("pickup")}
          >
            <Package className="h-4 w-4 mr-2" />
            Pickup
          </Button>
          <Button
            variant={activeMode === "receiving" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeMode === "receiving"
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => handleModeChange("receiving")}
          >
            <Truck className="h-4 w-4 mr-2" />
            Receiving
          </Button>
          <Button
            variant={activeMode === "speed-receiving" ? "default" : "ghost"}
            size="sm"
            className={`flex-1 ${
              activeMode === "speed-receiving"
                ? "bg-yellow-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => handleModeChange("speed-receiving")}
          >
            <Zap className="h-4 w-4 mr-2" />
            Speed
          </Button>
        </div>
      </div>
    </div>
  )
}
