"use client"

import type React from "react"

import { BrowserMultiFormatReader, BarcodeFormat, type IScannerControls } from "@zxing/browser"
import { useEffect, useRef, useState, useCallback } from "react"

interface RealtimeScannerProps {
  onDetected?: (code: string) => void
  onBarcodeDetected?: (code: string) => void // For backward compatibility
  videoRef?: React.RefObject<HTMLVideoElement>
  canvasRef?: React.RefObject<HTMLCanvasElement>
}

export default function RealtimeScanner({
  onDetected,
  onBarcodeDetected,
  videoRef: externalVideoRef,
  canvasRef: externalCanvasRef,
}: RealtimeScannerProps) {
  const internalVideoRef = useRef<HTMLVideoElement | null>(null)
  const internalCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Use external refs if provided, otherwise use internal refs
  const videoRef = externalVideoRef || internalVideoRef
  const canvasRef = externalCanvasRef || internalCanvasRef

  // Combine the callbacks for backward compatibility
  const handleDetection = useCallback(
    (code: string) => {
      if (onDetected) onDetected(code)
      if (onBarcodeDetected) onBarcodeDetected(code)
    },
    [onDetected, onBarcodeDetected],
  )

  // Draw bounding box around detected barcode
  const drawBoundingBox = useCallback(
    (points: any[], format: BarcodeFormat) => {
      const canvas = canvasRef.current
      const video = videoRef.current
      if (!canvas || !video || !points || points.length < 2) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const { videoWidth, videoHeight } = video
      const displayWidth = video.clientWidth
      const displayHeight = video.clientHeight

      const scaleX = displayWidth / videoWidth
      const scaleY = displayHeight / videoHeight

      canvas.width = displayWidth
      canvas.height = displayHeight

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = format === BarcodeFormat.PDF_417 ? "blue" : "limegreen"
      ctx.lineWidth = 3
      ctx.beginPath()

      const maxPoints = format === BarcodeFormat.PDF_417 ? Math.min(points.length, 4) : points.length

      for (let i = 0; i < maxPoints; i++) {
        const pt = points[i]
        const x = pt.x * scaleX
        const y = pt.y * scaleY
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }

      if (maxPoints > 0) {
        const pt0 = points[0]
        ctx.lineTo(pt0.x * scaleX, pt0.y * scaleY)
      }

      ctx.stroke()
    },
    [canvasRef, videoRef],
  )

  // Set up client-side detection
  useEffect(() => {
    setIsClient(true)

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop()
      }
    }
  }, [])

  // Initialize scanner when client is ready
  useEffect(() => {
    if (!isClient) return

    const codeReader = new BrowserMultiFormatReader()

    const startScanner = async () => {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices()
        if (devices.length === 0) return

        controlsRef.current = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (res, err) => {
            if (res) {
              const format = res.getBarcodeFormat()
              if (format === BarcodeFormat.PDF_417) {
                const text = res.getText()
                handleDetection(text)
              }
              const points = res.getResultPoints()
              if (points) drawBoundingBox(points, format)
            }
          },
          {
            videoConstraints: {
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: "environment",
            },
            formats: [BarcodeFormat.PDF_417],
          },
        )
      } catch (err: any) {
        console.error("Scanner error:", err)
      }
    }

    startScanner()

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop()
      }
    }
  }, [isClient, drawBoundingBox, handleDetection, videoRef])

  if (!isClient) return null

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

      {/* Enhanced scanning frame for desktop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 h-3/5 border-4 border-green-400 rounded-lg shadow-lg">
          {/* Corner indicators */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
          <div className="absolute -top-2 -right-2 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
          <div className="absolute -bottom-2 -left-2 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>

          {/* Center crosshair */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-0.5 bg-green-400"></div>
            <div className="w-0.5 h-8 bg-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
