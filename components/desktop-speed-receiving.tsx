"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Package, CheckCircle, AlertCircle, Camera, Pause, Play, RotateCcw, ArrowLeft } from "lucide-react"
import RealtimeScanner from "./realtime-scanner"
import Image from "next/image"

interface ScannedPackage {
  id: string
  metroLabel: string
  timestamp: string
  status: "success" | "error" | "duplicate"
  carrier: "Metro" | "FedEx" | "UPS" | "USPS"
  size: "Small" | "Medium" | "Large" | "XL"
  destination: string
  capturedImage?: string
  autoCapture?: boolean
}

interface DesktopSpeedReceivingProps {
  onBack: () => void
}

export default function DesktopSpeedReceiving({ onBack }: DesktopSpeedReceivingProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedPackages, setScannedPackages] = useState<ScannedPackage[]>([])
  const [totalScanned, setTotalScanned] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const destinations = ["Hub A", "Hub B", "Hub C", "Local Delivery", "Express Route"]
  const carriers = ["Metro", "FedEx", "UPS", "USPS"] as const
  const sizes = ["Small", "Medium", "Large", "XL"] as const

  // Auto-capture package image
  const capturePackageImage = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null

    try {
      const video = videoRef.current
      const canvas = canvasRef.current

      if (video.readyState < 2) {
        await new Promise((resolve) => {
          video.addEventListener("loadeddata", resolve, { once: true })
        })
      }

      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      const ctx = canvas.getContext("2d")
      if (!ctx) return null

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8)

      setCapturedImages((prev) => [imageDataUrl, ...prev.slice(0, 9)])
      return imageDataUrl
    } catch (error) {
      console.error("Error capturing image:", error)
      return null
    }
  }, [])

  // Handle barcode detection with auto-capture
  const handleBarcodeDetection = useCallback(
    async (code: string) => {
      const capturedImage = await capturePackageImage()

      const newPackage: ScannedPackage = {
        id: `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        metroLabel: code,
        timestamp: new Date().toLocaleTimeString(),
        status: validateMetroLabel(code) ? "success" : "error",
        carrier: "Metro",
        size: sizes[Math.floor(Math.random() * sizes.length)],
        destination: destinations[Math.floor(Math.random() * destinations.length)],
        capturedImage: capturedImage || undefined,
        autoCapture: true,
      }

      setScannedPackages((prev) => [newPackage, ...prev.slice(0, 99)])
      setTotalScanned((prev) => prev + 1)

      if (!validateMetroLabel(code)) {
        setErrorCount((prev) => prev + 1)
      }

      if (capturedImage) {
        showCaptureFlash()
      }
    },
    [capturePackageImage],
  )

  // Visual flash effect for auto-capture
  const showCaptureFlash = useCallback(() => {
    const flashElement = document.createElement("div")
    flashElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.3;
      z-index: 9999;
      pointer-events: none;
    `
    document.body.appendChild(flashElement)

    setTimeout(() => {
      flashElement.style.opacity = "0"
      flashElement.style.transition = "opacity 0.2s"
      setTimeout(() => {
        document.body.removeChild(flashElement)
      }, 200)
    }, 50)
  }, [])

  // Start/Stop scanning
  const toggleScanning = useCallback(() => {
    if (isScanning) {
      setIsScanning(false)
    } else {
      if (!sessionStartTime) {
        setSessionStartTime(new Date())
      }
      setIsScanning(true)
    }
  }, [isScanning, sessionStartTime])

  // Reset session
  const resetSession = useCallback(() => {
    setIsScanning(false)
    setScannedPackages([])
    setTotalScanned(0)
    setErrorCount(0)
    setSessionStartTime(null)
    setCapturedImages([])
  }, [])

  const successRate = totalScanned > 0 ? (((totalScanned - errorCount) / totalScanned) * 100).toFixed(0) : "100"
  const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60) : 0

  return (
    <div className="h-screen bg-white dark:bg-black flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-black">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Speed Mode</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Auto-capture enabled</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isScanning ? "default" : "secondary"}>{isScanning ? "Active" : "Paused"}</Badge>
          <Badge variant="outline">Auto-Capture</Badge>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalScanned}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{successRate}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{capturedImages.length}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Images Captured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{sessionDuration}m</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Session Time</div>
            </div>
          </div>

          {/* Camera */}
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-6 relative">
            {isScanning ? (
              <div className="w-full h-full relative">
                <RealtimeScanner onDetected={handleBarcodeDetection} videoRef={videoRef} canvasRef={canvasRef} />

                {/* Status overlay */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    SCANNING
                  </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded text-sm">
                  Position Metro Labels in frame
                </div>

                {/* Recent captures */}
                {capturedImages.length > 0 && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    {capturedImages.slice(0, 3).map((img, index) => (
                      <div key={index} className="w-12 h-12 bg-white rounded border-2 border-green-400 overflow-hidden">
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Captured ${index + 1}`}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-white">
                <Camera className="h-20 w-20 mx-auto mb-4 text-gray-400" />
                <div className="text-xl font-medium">Camera Ready</div>
                <div className="text-sm text-gray-400 mt-1">Click Start to begin scanning</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleScanning}
              size="lg"
              className={isScanning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isScanning ? (
                <>
                  <Pause className="h-5 w-5 mr-2" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={resetSession}>
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset Session
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Recent Scans</h3>
            <Badge variant="secondary" className="text-xs">
              {scannedPackages.length}
            </Badge>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {scannedPackages.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                <Package className="h-12 w-12 mx-auto mb-3" />
                <div className="text-sm">No scans yet</div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Start scanning to see results</div>
              </div>
            ) : (
              scannedPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-3 rounded border-l-4 ${
                    pkg.status === "success"
                      ? "bg-green-50 dark:bg-green-950/20 border-green-500"
                      : pkg.status === "duplicate"
                        ? "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-500"
                        : "bg-red-50 dark:bg-red-950/20 border-red-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {pkg.status === "success" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : pkg.status === "duplicate" ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium text-sm text-gray-900 dark:text-white">{pkg.metroLabel}</span>
                    </div>
                    {pkg.capturedImage && (
                      <Badge variant="outline" className="text-xs">
                        📸
                      </Badge>
                    )}
                  </div>

                  {/* Show captured image if available */}
                  {pkg.capturedImage && (
                    <div className="mb-2">
                      <div className="w-full h-16 bg-gray-100 dark:bg-gray-900 rounded overflow-hidden">
                        <Image
                          src={pkg.capturedImage || "/placeholder.svg"}
                          alt="Package capture"
                          width={200}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {pkg.carrier} • {pkg.size} • {pkg.destination}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{pkg.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const validateMetroLabel = (code: string): boolean => {
  const metroLabelPattern = /^MTR-\d{4}-\d{6}$/
  return metroLabelPattern.test(code) || code.startsWith("MTR-") || code.includes("METRO")
}
