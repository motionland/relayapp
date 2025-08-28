"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Edit, User, Building } from "lucide-react"
import { getWarehouseAddress } from "@/utils/warehouse-utils"

interface SignatureCaptureProps {
  signatureCaptured: boolean
  setSignatureCaptured: (captured: boolean) => void
  onComplete: () => void
  customer?: {
    name: string
    address?: string
  }
}

export default function SignatureCapture({
  signatureCaptured,
  setSignatureCaptured,
  onComplete,
  customer = { name: "John Doe", address: "Warehouse A01" },
}: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Clear and set background
      ctx.fillStyle = "#f9fafb"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Get position from event
  const getEventPosition = useCallback((e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()

    if ("touches" in e) {
      // Touch event
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }, [])

  // Start drawing
  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      setIsDrawing(true)

      // Get position
      const position = getEventPosition(e, canvas)
      setLastPosition(position)
    },
    [getEventPosition],
  )

  // Draw
  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Prevent scrolling on touch devices
      e.preventDefault()

      // Get current position
      const currentPosition = getEventPosition(e, canvas)

      // Draw line
      ctx.beginPath()
      ctx.moveTo(lastPosition.x, lastPosition.y)
      ctx.lineTo(currentPosition.x, currentPosition.y)
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.stroke()

      // Update last position
      setLastPosition(currentPosition)
    },
    [isDrawing, lastPosition, getEventPosition],
  )

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
    setSignatureCaptured(true)
  }, [setSignatureCaptured])

  // Clear signature
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#f9fafb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setSignatureCaptured(false)
  }, [setSignatureCaptured])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Customer Signature</h2>
        <p className="text-gray-500 text-sm">Ask customer to sign to confirm receipt</p>
      </div>

      <div className="bg-red-100 border-2 border-red-500 p-3 rounded-md text-center">
        <p className="text-red-600 font-bold">CHECK CUSTOMER ID OR DL</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer</p>
          </div>
          <p className="text-gray-700 pl-6">{customer.name}</p>
        </div>

        {customer.address && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <Building className="h-4 w-4 text-gray-400" />
              <p className="font-medium">Customer Hub Location</p>
            </div>
            <div className="pl-6">
              <p className="text-gray-700 font-medium">{customer.address}</p>
              <p className="text-gray-500 text-sm mt-1">{getWarehouseAddress(customer.address)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl h-56 relative overflow-hidden" style={{ touchAction: "none" }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {!signatureCaptured && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
            <Edit className="h-6 w-6 mb-2" />
            <span>Sign here</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 h-12 border-gray-200 text-gray-700 rounded-xl"
          onClick={clearSignature}
        >
          Clear
        </Button>
        <Button
          className="flex-1 h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
          onClick={onComplete}
          disabled={!signatureCaptured}
        >
          Complete
        </Button>
      </div>
    </div>
  )
}
