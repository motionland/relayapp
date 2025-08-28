"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Package, CheckCircle, AlertCircle, Camera, Pause, Play, RotateCcw, ArrowLeft } from "lucide-react"

interface ScannedPackage {
  id: string
  metroLabel: string
  timestamp: string
  status: "success" | "error" | "duplicate"
  carrier: "Metro" | "FedEx" | "UPS" | "USPS"
  size: "Small" | "Medium" | "Large" | "XL"
  destination: string
}

interface SpeedReceivingModeProps {
  onBack: () => void
}

export default function SpeedReceivingMode({ onBack }: SpeedReceivingModeProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedPackages, setScannedPackages] = useState<ScannedPackage[]>([])
  const [totalScanned, setTotalScanned] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Mock Metro Labels for demonstration
  const mockMetroLabels = [
    "MTR-2025-001234",
    "MTR-2025-001235",
    "MTR-2025-001236",
    "MTR-2025-001237",
    "MTR-2025-001238",
    "MTR-2025-001239",
  ]

  const destinations = ["Hub A", "Hub B", "Hub C", "Local Delivery", "Express Route"]
  const carriers = ["Metro", "FedEx", "UPS", "USPS"] as const
  const sizes = ["Small", "Medium", "Large", "XL"] as const

  // Simulate high-speed scanning
  const simulatePackageScan = useCallback(() => {
    const isError = Math.random() < 0.05
    const isDuplicate = Math.random() < 0.03

    const newPackage: ScannedPackage = {
      id: `PKG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      metroLabel: mockMetroLabels[Math.floor(Math.random() * mockMetroLabels.length)],
      timestamp: new Date().toLocaleTimeString(),
      status: isError ? "error" : isDuplicate ? "duplicate" : "success",
      carrier: carriers[Math.floor(Math.random() * carriers.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
    }

    setScannedPackages((prev) => [newPackage, ...prev.slice(0, 49)])
    setTotalScanned((prev) => prev + 1)

    if (isError) {
      setErrorCount((prev) => prev + 1)
    }
  }, [])

  // Start/Stop scanning
  const toggleScanning = useCallback(() => {
    if (isScanning) {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
        scanIntervalRef.current = null
      }
      setIsScanning(false)
    } else {
      if (!sessionStartTime) {
        setSessionStartTime(new Date())
      }

      scanIntervalRef.current = setInterval(
        () => {
          simulatePackageScan()
        },
        Math.random() * 400 + 300,
      )

      setIsScanning(true)
    }
  }, [isScanning, sessionStartTime, simulatePackageScan])

  // Reset session
  const resetSession = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }

    setIsScanning(false)
    setScannedPackages([])
    setTotalScanned(0)
    setErrorCount(0)
    setSessionStartTime(null)
  }, [])

  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current)
      }
    }
  }, [])

  const successRate = totalScanned > 0 ? (((totalScanned - errorCount) / totalScanned) * 100).toFixed(0) : "100"
  const sessionDuration = sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60) : 0

  return (
    <div className="h-screen bg-white dark:bg-black flex flex-col">
      {/* Simple Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-black">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Speed Mode</h1>
          </div>
        </div>
        <Badge variant={isScanning ? "default" : "secondary"}>{isScanning ? "Active" : "Paused"}</Badge>
      </div>

      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalScanned}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Scanned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successRate}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sessionDuration}m</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
            </div>
          </div>

          {/* Camera */}
          <div className="bg-black rounded-lg aspect-video flex items-center justify-center mb-6 relative">
            <div className="text-center text-white">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <div className="text-lg font-medium">Metro Label Scanner</div>
              <div className="text-sm text-gray-400 mt-1">{isScanning ? "Scanning active..." : "Ready to scan"}</div>
            </div>

            {/* Scanning overlay */}
            {isScanning && (
              <div className="absolute inset-4 border-2 border-green-400 rounded-lg">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-400 animate-pulse" />
              </div>
            )}

            {/* Status indicator */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                {isScanning ? "SCANNING" : "STANDBY"}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={toggleScanning}
              className={isScanning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {isScanning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetSession}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
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

          <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {scannedPackages.length === 0 ? (
              <div className="text-center py-8 text-gray-400 dark:text-gray-600">
                <Package className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">No scans yet</div>
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
                  <div className="flex items-center gap-2 mb-1">
                    {pkg.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : pkg.status === "duplicate" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium text-sm text-gray-900 dark:text-white">{pkg.metroLabel}</span>
                  </div>
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
