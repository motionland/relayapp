"use client"

import Link from "next/link"
import { Home, Package, Truck, Zap } from "lucide-react"

interface MobileFooterProps {
  currentMode?: "pickup" | "receiving" | "speed"
  onModeChange?: (mode: "pickup" | "receiving" | "speed") => void
}

export default function MobileFooter({ currentMode = "pickup", onModeChange }: MobileFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-600 hover:text-gray-900">
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>

        <button
          onClick={() => onModeChange?.("pickup")}
          className={`flex flex-col items-center gap-1 p-2 ${
            currentMode === "pickup" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Package className="h-5 w-5" />
          <span className="text-xs">Pickup</span>
        </button>

        <button
          onClick={() => onModeChange?.("receiving")}
          className={`flex flex-col items-center gap-1 p-2 ${
            currentMode === "receiving" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Truck className="h-5 w-5" />
          <span className="text-xs">Receiving</span>
        </button>

        <button
          onClick={() => onModeChange?.("speed")}
          className={`flex flex-col items-center gap-1 p-2 ${
            currentMode === "speed" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Zap className="h-5 w-5" />
          <span className="text-xs">Speed</span>
        </button>
      </div>
    </div>
  )
}
