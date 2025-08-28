"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  X,
  Package,
  User,
  Building,
  Camera,
  Scan,
  ArrowRight,
  Check,
  QrCode,
  Tag,
  Search,
  Barcode,
  Snowflake,
  AlertTriangle,
  Clock3,
  Box,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RealtimeScanner from "./realtime-scanner"
import { BrowserMultiFormatReader } from "@zxing/browser"

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`

interface ScannedItem {
  id: string
  name: string
  customerCode?: string
  icon: "amazon" | "mail"
  arrivalTime: string
  image?: string
  warehouseLabel?: string
  status: "pending" | "processed" | "labeled"
  storageArea?: string
  storageRow?: string
  storageBay?: string
  storageLevel?: string
  storageBin?: string
  storageType?: "standard" | "fridge" | "fragile" | "urgent" | "special"
}

interface RecentScanItem {
  id: string
  timestamp: string
  supplier: string
  location: string
  items: number
  status: "completed" | "pending"
}

// Sample customer codes for auto-complete
const sampleCustomerCodes = [
  "MRC10927XYZ",
  "MRC22845ABC",
  "MRC38291DEF",
  "MRC47362GHI",
  "MRC56473JKL",
  "MRC65584MNO",
  "MRC74695PQR",
  "MRC83706STU",
  "MRC92817VWX",
  "MRC01928YZA",
]

type ReceivingViewProps = {}

export default function ReceivingView({}: ReceivingViewProps = {}) {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [currentItem, setCurrentItem] = useState<ScannedItem | null>(null)
  const [warehouseLabel, setWarehouseLabel] = useState<string>("")
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [manualCodeSearch, setManualCodeSearch] = useState<string>("")
  const [showManualSearch, setShowManualSearch] = useState<boolean>(false)
  const [suggestedCodes, setSuggestedCodes] = useState<string[]>([])
  const [scannerOpen, setScannerOpen] = useState<boolean>(false)
  const [showFullImage, setShowFullImage] = useState<boolean>(false)
  // Add a new state to track which history item is expanded
  const [expandedHistoryItem, setExpandedHistoryItem] = useState<string | null>(null)
  // Add new state for carrier tracking scanner
  const [carrierScannerOpen, setCarrierScannerOpen] = useState<boolean>(false)
  const [carrierTrackingNumber, setCarrierTrackingNumber] = useState<string>("")
  // First, add a new state to track which timeline is expanded
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null)

  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([
    {
      id: "1781198138113",
      name: "Home Essentials John Smith MRC10927XYZ",
      customerCode: "MRC10927XYZ",
      icon: "mail",
      arrivalTime: "12:01pm",
      status: "labeled",
      warehouseLabel: "A01-R01-B01-L05-Bin0",
      storageArea: "A01",
      storageRow: "R01",
      storageBay: "B01",
      storageLevel: "L05",
      storageBin: "Bin0",
      storageType: "fridge",
    },
    {
      id: "1781198138114",
      name: "Kitchen Appliances Sarah Johnson MRC22845ABC",
      customerCode: "MRC22845ABC",
      icon: "amazon",
      arrivalTime: "12:01pm",
      status: "pending",
      warehouseLabel: "A01-R01-B01-L02-Bin001",
      storageArea: "A01",
      storageRow: "R01",
      storageBay: "B01",
      storageLevel: "L02",
      storageBin: "Bin001",
      storageType: "urgent",
    },
  ])

  const [recentScans, setRecentScans] = useState<RecentScanItem[]>([
    {
      id: "RCV-20250327-001",
      timestamp: "Today, 11:45 AM",
      supplier: "Global Logistics",
      location: "Warehouse A01",
      items: 12,
      status: "completed",
    },
    {
      id: "RCV-20250327-002",
      timestamp: "Today, 09:30 AM",
      supplier: "Supplier XYZ",
      location: "Warehouse A01",
      items: 8,
      status: "completed",
    },
  ])

  // Update suggestions when manual code search changes
  useEffect(() => {
    if (manualCodeSearch.length > 0) {
      const filtered = sampleCustomerCodes.filter((code) => code.toLowerCase().includes(manualCodeSearch.toLowerCase()))
      setSuggestedCodes(filtered)
    } else {
      setSuggestedCodes([])
    }
  }, [manualCodeSearch])

  // Apply selected customer code
  const applyCustomerCode = (code: string) => {
    if (currentItem) {
      setCurrentItem({
        ...currentItem,
        customerCode: code,
      })
      setManualCodeSearch("")
      setShowManualSearch(false)
    }
  }

  const getWarehouseAddress = (locationCode: string) => {
    const warehouseAddresses: Record<string, string> = {
      "Warehouse A01": "123 Distribution Center Rd, Industrial Park, CA 94103",
      "Warehouse B02": "456 Logistics Ave, Commerce City, TX 75001",
      "Warehouse C03": "789 Supply Chain Blvd, Shipping District, NY 10001",
    }

    return warehouseAddresses[locationCode] || "1000 Warehouse Way, Storage City, ST 12345"
  }

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        setError("Could not access camera. Please check permissions.")
      }
    }

    if (currentStep === 1 || currentStep === 3 || scannerOpen) {
      startCamera()
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [currentStep, scannerOpen])

  // Function to extract customer code from name
  const extractCustomerCode = (name: string): string | undefined => {
    // Look for pattern that matches MRC followed by alphanumeric characters at the end of the string
    const match = name.match(/MRC[A-Z0-9]+$/)
    return match ? match[0] : undefined
  }

  // Function to handle scanning a new item
  const handleScanItem = () => {
    // Simulate scanning a shipping label
    const randomNames = [
      "Office Supplies David Brown MRC38291DEF",
      "Electronics Michael Wilson MRC47362GHI",
      "Furniture Emily Davis MRC56473JKL",
      "Books Robert Taylor MRC65584MNO",
      "Clothing Jennifer Anderson MRC74695PQR",
    ]

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]
    const customerCode = extractCustomerCode(randomName)

    const newItem: ScannedItem = {
      id: Math.floor(Math.random() * 10000000000).toString(),
      name: randomName,
      customerCode,
      icon: Math.random() > 0.5 ? "amazon" : "mail",
      arrivalTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    }

    setCurrentItem(newItem)
    setCurrentStep(2)
  }

  // Function to simulate a failed code detection
  const handleFailedScan = () => {
    const randomNames = [
      "Office Supplies David Brown",
      "Electronics Michael Wilson",
      "Furniture Emily Davis",
      "Books Robert Taylor",
      "Clothing Jennifer Anderson",
    ]

    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)]

    const newItem: ScannedItem = {
      id: Math.floor(Math.random() * 10000000000).toString(),
      name: randomName,
      icon: Math.random() > 0.5 ? "amazon" : "mail",
      arrivalTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    }

    setCurrentItem(newItem)
    setShowManualSearch(true)
    setCurrentStep(2)
  }

  // Function to capture package image
  const capturePackageImage = () => {
    // Capture the actual image from the video feed
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImages((prev) => [...prev, imageDataUrl])

        if (currentItem) {
          const updatedItem = {
            ...currentItem,
            image: imageDataUrl,
            status: "processed" as const,
          }
          setCurrentItem(updatedItem)
        }
      }
    } else {
      // Fallback to demo images if video or canvas is not available
      const demoImages = [
        "/placeholder.svg?height=300&width=400&text=Package+with+Metro+Label",
        "/placeholder.svg?height=300&width=400&text=Scanned+Package",
        "/placeholder.svg?height=300&width=400&text=Package+Image",
      ]

      const selectedImage = demoImages[Math.floor(Math.random() * demoImages.length)]
      setCapturedImages((prev) => [...prev, selectedImage])

      if (currentItem) {
        const updatedItem = {
          ...currentItem,
          image: selectedImage,
          status: "processed" as const,
        }
        setCurrentItem(updatedItem)
      }
    }
  }

  // Function to associate warehouse label
  const associateWarehouseLabel = () => {
    if (currentItem && warehouseLabel) {
      const updatedItem = {
        ...currentItem,
        warehouseLabel,
        status: "labeled" as const,
      }

      // Parse warehouse location from JSON if applicable
      try {
        const barcodeData = JSON.parse(warehouseLabel)
        if (barcodeData.warehouse) {
          // Extract warehouse components from the format "A01-R01-B01-L02-Bin001"
          const warehouseParts = barcodeData.warehouse.split("-")
          if (warehouseParts.length >= 4) {
            updatedItem.storageArea = warehouseParts[0] // A01
            updatedItem.storageRow = warehouseParts[1] // R01
            updatedItem.storageBay = warehouseParts[2] // B01
            updatedItem.storageLevel = warehouseParts[3] // L02

            // The bin might be after the last dash
            if (warehouseParts.length > 4) {
              updatedItem.storageBin = warehouseParts.slice(4).join("-") // Bin001 or anything after
            }
          }

          // Set the warehouseLabel to the actual warehouse value from JSON
          updatedItem.warehouseLabel = barcodeData.warehouse

          // If package type is available, set it
          if (barcodeData.package_type) {
            updatedItem.storageType = barcodeData.package_type.toLowerCase() as any
          }
        }
      } catch (err) {
        // Not JSON, use as-is
        console.log("Using warehouse label as plain text:", warehouseLabel)
      }

      // Add to scanned items
      setScannedItems((prev) => [updatedItem, ...prev])

      // Reset current process
      setCurrentItem(null)
      setWarehouseLabel("")
      setCapturedImages([])
      setShowManualSearch(false)
      setCurrentStep(1)
    }
  }

  // Function to handle barcode detection from camera
  const handleCameraBarcodeScan = (barcode: string) => {
    setWarehouseLabel(barcode)
    setScannerOpen(false)
  }

  // Function to handle carrier tracking barcode detection
  const handleCarrierBarcodeScan = (barcode: string) => {
    setCarrierTrackingNumber(barcode)
    setCarrierScannerOpen(false)
  }

  // Function to get package type icon and color
  const getPackageTypeInfo = (type: string | undefined) => {
    switch (type) {
      case "fragile":
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          color: "text-amber-500 bg-amber-50 border-amber-200",
        }
      case "fridge":
        return {
          icon: <Snowflake className="h-4 w-4" />,
          color: "text-blue-500 bg-blue-50 border-blue-200",
        }
      case "urgent":
        return {
          icon: <Clock3 className="h-4 w-4" />,
          color: "text-red-500 bg-red-50 border-red-200",
        }
      case "standard":
      default:
        return {
          icon: <Box className="h-4 w-4" />,
          color: "text-gray-500 bg-gray-50 border-gray-200",
        }
    }
  }

  // Render different steps based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Scan shipping label
        return (
          <div className="flex flex-col bg-white">
            <div className="relative w-full max-w-md mx-auto">
              <RealtimeScanner onDetected={(text) => setWarehouseLabel(text)} />
            </div>

            <div className="bg-white rounded-t-xl -mt-4 relative z-10 p-4">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-medium mb-1">Step 1: Scan Shipping Label</h2>
                  <p className="text-gray-500 text-sm">Position the shipping label within the frame</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
                    onClick={handleScanItem}
                  >
                    <Scan className="h-5 w-5 mr-2" />
                    Scan Shipping Label
                  </Button>

                  <Button variant="outline" className="w-full h-10 text-gray-700" onClick={handleFailedScan}>
                    Simulate Failed Code Detection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: // Confirm customer code
        return (
          <div className="p-4 space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-1">Step 2: Confirm Customer Code</h2>
              <p className="text-gray-500 text-sm">Verify the extracted customer code</p>
            </div>

            {currentItem && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Shipping Label</p>
                  <p className="font-medium">{currentItem.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Extracted Customer Code</p>
                  <div className="flex items-center">
                    {currentItem.customerCode ? (
                      <>
                        <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 text-base">
                          {currentItem.customerCode}
                        </Badge>
                        <Check className="h-5 w-5 text-green-500 ml-2" />
                      </>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700 border-0 px-3 py-1 text-base">
                        No code detected
                      </Badge>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 text-blue-600"
                      onClick={() => setShowManualSearch(!showManualSearch)}
                    >
                      {showManualSearch ? "Hide lookup" : "Manual lookup"}
                    </Button>
                  </div>

                  {showManualSearch && (
                    <div className="mt-3 space-y-3">
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Search customer code..."
                          value={manualCodeSearch}
                          onChange={(e) => setManualCodeSearch(e.target.value)}
                          className="pl-9"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>

                      {suggestedCodes.length > 0 && (
                        <div className="bg-white border rounded-md shadow-sm max-h-40 overflow-y-auto">
                          {suggestedCodes.map((code, index) => (
                            <button
                              key={index}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                              onClick={() => applyCustomerCode(code)}
                            >
                              {code}
                            </button>
                          ))}
                        </div>
                      )}

                      {manualCodeSearch && suggestedCodes.length === 0 && (
                        <div className="text-sm text-gray-500 p-2">No matching codes found</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(1)}>
                    Rescan
                  </Button>
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                    onClick={() => setCurrentStep(3)}
                    disabled={!currentItem.customerCode && !manualCodeSearch}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      case 3: // Capture package image
        return (
          <div className="flex flex-col min-h-screen bg-white">
            {/* Camera for package image */}
            <div className="relative h-80 bg-black">
              {error ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  <p className="text-white text-sm">{error}</p>
                </div>
              ) : (
                <div className="absolute inset-0">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" /> {/* Hidden canvas for image capture */}
                  <div className="absolute top-0 right-0 p-2 flex flex-col gap-2 max-h-80 overflow-y-auto z-10 custom-scrollbar">
                    {capturedImages.length > 3 && (
                      <div className="absolute bottom-0 right-0 w-full h-8 bg-gradient-to-t from-black/30 to-transparent pointer-events-none z-10"></div>
                    )}
                    {capturedImages.length > 3 && (
                      <div className="absolute top-0 right-0 w-full h-8 bg-gradient-to-b from-black/30 to-transparent pointer-events-none z-10"></div>
                    )}
                    {capturedImages.map((img, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 overflow-hidden rounded-lg border-2 border-green-500 shadow-lg relative group"
                      >
                        <Image
                          src={img || "/placeholder.svg"}
                          alt={`Captured Package ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                          <Camera className="h-2 w-2 inline-block mr-0.5" />
                          {index + 1}
                        </div>
                        <button
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCapturedImages((prev) => prev.filter((_, i) => i !== index))
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="w-64 h-64 border-2 border-white rounded-lg opacity-70 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white text-sm">Center the package in the frame</p>
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full max-w-md mx-auto"></div>
            <div className="bg-white rounded-t-xl -mt-4 relative z-10 p-4">
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-medium mb-1">Step 3: Capture Package Image</h2>
                  <p className="text-gray-500 text-sm">
                    Take a photo of the package with the Metro Label clearly visible for verification
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {capturedImages.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <Button
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center"
                        onClick={() => setCurrentStep(4)}
                      >
                        <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="text-sm">Damage Free, cotinue with 1 image</span>
                      </Button>
                      <div className="text-xs text-center text-gray-500 bg-gray-50 py-1 rounded-md">
                        {capturedImages.length} {capturedImages.length === 1 ? "image" : "images"} captured
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 py-3 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center"
                      onClick={capturePackageImage}
                    >
                      <Camera className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        {capturedImages.length === 0 ? "Capture First Image" : "Damaged Package? Add damage images"}
                      </span>
                    </Button>

                    {capturedImages.length > 0 && (
                      <Button
                        className="py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center px-6"
                        onClick={() => setCurrentStep(4)}
                      >
                        <span className="text-sm font-medium">Done</span>
                        <ArrowRight className="h-4 w-4 ml-2 flex-shrink-0" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Associate warehouse label
        return (
          <div className="p-4 space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-1">Step 4: Associate Warehouse Label</h2>
              <p className="text-gray-500 text-sm">Scan or enter the warehouse label for this package</p>
            </div>

            {currentItem && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{currentItem.customerCode}</p>
                    <p className="text-sm text-gray-500">Customer Code</p>
                  </div>
                </div>

                {capturedImages.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-500">Package Images with Metro Label ({capturedImages.length})</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 p-0 h-auto"
                        onClick={() => setShowFullImage(true)}
                      >
                        <Search className="h-4 w-4 mr-1" />
                        <span className="text-xs">View gallery</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {capturedImages.slice(0, 3).map((img, index) => (
                        <div
                          key={index}
                          className="relative h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`Package ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                            <Camera className="h-2 w-2 inline-block mr-0.5" />
                            {index + 1}
                          </div>
                        </div>
                      ))}
                      {capturedImages.length > 3 && (
                        <div
                          className="relative h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer"
                          onClick={() => setShowFullImage(true)}
                        >
                          <div className="bg-black/50 absolute inset-0 flex items-center justify-center text-white font-medium">
                            +{capturedImages.length - 3} more
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                        <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                        Metro Label
                      </div>
                      <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                        <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                        Package
                      </div>
                      <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                        <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                        Clear Images
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Scan Internal Label (JSON):</p>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Enter or scan warehouse label"
                        value={warehouseLabel}
                        onChange={(e) => setWarehouseLabel(e.target.value)}
                        className="pl-9 pr-4"
                        // This will help with handheld barcode scanners which typically send input very quickly
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            try {
                              // Try to parse the input as JSON
                              const barcodeData = JSON.parse(warehouseLabel)
                              console.log("Barcode data:", barcodeData)

                              // Extract warehouse location from the JSON
                              if (barcodeData.warehouse) {
                                // Parse the warehouse string into components
                                const warehouseParts = barcodeData.warehouse.split("-")
                                if (warehouseParts.length >= 4) {
                                  // Update the current item with the parsed storage information
                                  if (currentItem) {
                                    setCurrentItem({
                                      ...currentItem,
                                      warehouseLabel: barcodeData.warehouse,
                                      storageArea: warehouseParts[0], // A01
                                      storageRow: warehouseParts[1], // R01
                                      storageBay: warehouseParts[2], // B01
                                      storageLevel: warehouseParts[3], // L02
                                      storageBin: warehouseParts.length > 4 ? warehouseParts.slice(4).join("-") : "",
                                      storageType: barcodeData.package_type
                                        ? (barcodeData.package_type.toLowerCase() as any)
                                        : "standard",
                                    })
                                  }
                                }
                              }
                            } catch (err) {
                              // If not valid JSON, use as-is (for manual entry)
                              console.log("Using barcode as plain text:", warehouseLabel)
                            }
                          }
                        }}
                      />
                      <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button variant="outline" className="bg-gray-100" onClick={() => setScannerOpen(true)}>
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-1">Use handheld scanner or camera to scan PDF417 barcode</p>
                  <div className="mt-3 mb-2">
                    <p className="text-sm text-gray-500 mb-2">Carrier Tracking</p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder='{"package_id":"P-20250307-12345","metro_tracking_number":"MRC-01032025-00042-00121-00001","warehouse":"A01-R01-B01-L02-Bin001","package_type":"URGtracking_number":"MRC-01032025-00042-00121-00001","warehouse":"A01-R01-B01-L02-Bin001","package_type":"URGENT"}'
                          className="pl-9 pr-4"
                          value={carrierTrackingNumber}
                          onChange={(e) => setCarrierTrackingNumber(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              const value = e.currentTarget.value
                              console.log("Metro label scanned:", value)

                              // Example parsing logic for Metro label format
                              // Assuming format like "A-01-01-05-0"
                              const parts = value.split("-")
                              if (parts.length >= 5) {
                                if (currentItem) {
                                  setCurrentItem({
                                    ...currentItem,
                                    storageArea: parts[0],
                                    storageRow: parts[1],
                                    storageBay: parts[2],
                                    storageLevel: parts[3],
                                    storageBin: parts[4],
                                    storageType: "standard", // Default type
                                  })
                                }
                                // Clear the input after processing
                                e.currentTarget.value = ""
                              }
                            }
                          }}
                        />
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <Button
                        variant="outline"
                        className="bg-gray-100"
                        onClick={() => {
                          setCarrierScannerOpen(true)
                          // Ensure camera is initialized after dialog opens
                          setTimeout(() => {
                            if (videoRef.current) {
                              // Start camera with barcode detection
                              navigator.mediaDevices
                                .getUserMedia({
                                  video: { facingMode: "environment" },
                                })
                                .then((stream) => {
                                  if (videoRef.current) {
                                    videoRef.current.srcObject = stream
                                    // Initialize barcode detection once video is loaded
                                    videoRef.current.onloadedmetadata = () => {
                                      // Start scanning for barcodes
                                      const barcodeDetector = new BrowserMultiFormatReader()
                                      barcodeDetector.decodeFromVideoDevice(
                                        undefined,
                                        videoRef.current!,
                                        (result, error) => {
                                          if (result) {
                                            // Handle successful barcode detection
                                            handleCarrierBarcodeScan(result.getText())
                                          }
                                        },
                                      )
                                    }
                                  }
                                })
                                .catch((err) => {
                                  console.error("Error accessing camera:", err)
                                  setError("Could not access camera. Please check permissions.")
                                })
                            }
                          }, 500)
                        }}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Scan 2D matrix code on carrier label to capture tracking information
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setCurrentStep(3)}>
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-black hover:bg-gray-800 text-white"
                    onClick={associateWarehouseLabel}
                    disabled={!warehouseLabel}
                  >
                    Complete
                    <Check className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  // Render scanned items list
  const renderScannedItemsList = () => {
    if (currentStep !== 1) return null

    return (
      <>
        <div className="relative w-full max-w-md mx-auto"></div>
        <div className="bg-white rounded-t-xl -mt-4 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">Scanned Items</h2>
              <div className="ml-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                {scannedItems.length}
              </div>
            </div>
            <button>
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          {/* Scanned items list */}
          <div className="max-h-60 overflow-y-auto">
            {scannedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No items in current batch</p>
                <p className="text-gray-400 text-sm mt-1">Scan items to add them to the current batch</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={handleScanItem}>
                  <Scan className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </div>
            ) : (
              Array.from({ length: 12 }, (_, idx) => {
                // Generate different package types
                const packageTypes = ["standard", "fridge", "fragile", "urgent", "special"]
                const storageType = packageTypes[idx % packageTypes.length]

                // Generate different customer names and codes
                const customers = [
                  { name: "John Smith", code: "MRC10927XYZ" },
                  { name: "Sarah Johnson", code: "MRC22845ABC" },
                  { name: "David Brown", code: "MRC38291DEF" },
                  { name: "Michael Wilson", code: "MRC47362GHI" },
                  { name: "Emily Davis", code: "MRC56473JKL" },
                  { name: "Robert Taylor", code: "MRC65584MNO" },
                  { name: "Jennifer Anderson", code: "MRC74695PQR" },
                  { name: "William Thomas", code: "MRC83706STU" },
                  { name: "Elizabeth Jackson", code: "MRC92817VWX" },
                  { name: "James White", code: "MRC01928YZA" },
                  { name: "Patricia Harris", code: "MRC19283BCD" },
                  { name: "Richard Martin", code: "MRC29384EFG" },
                ]

                // Generate different product categories
                const products = [
                  "Home Essentials",
                  "Kitchen Appliances",
                  "Office Supplies",
                  "Electronics",
                  "Furniture",
                  "Books",
                  "Clothing",
                  "Sporting Goods",
                  "Toys",
                  "Beauty Products",
                  "Garden Tools",
                  "Pet Supplies",
                ]

                // Generate different storage locations
                const area = `A${Math.floor(idx / 4) + 1}`.padStart(3, "0")
                const row = `R${Math.floor(idx / 3) + 1}`.padStart(3, "0")
                const bay = `B${Math.floor(idx / 2) + 1}`.padStart(3, "0")
                const level = `L${idx + 1}`.padStart(3, "0")
                const bin = `Bin${idx.toString().padStart(3, "0")}`

                return {
                  id: `178119813${(8000 + idx).toString().padStart(4, "0")}`,
                  name: `${products[idx]} ${customers[idx].name} ${customers[idx].code}`,
                  customerCode: customers[idx].code,
                  icon: idx % 2 === 0 ? "mail" : "amazon",
                  arrivalTime: `${(idx % 12) + 1}:${(idx * 5) % 60}`.padStart(5, "0") + (idx % 2 === 0 ? "am" : "pm"),
                  status: idx % 3 === 0 ? "pending" : "labeled",
                  warehouseLabel: `${area}-${row}-${bay}-${level}-${bin}`,
                  storageArea: area,
                  storageRow: row,
                  storageBay: bay,
                  storageLevel: level,
                  storageBin: bin,
                  storageType: storageType,
                  image: "/placeholder.svg?height=80&width=80&text=Package",
                }
              }).map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-start mb-3">
                    <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="font-medium truncate">{item.name}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm relative">
                    {/* Header with Package Type */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <p className="font-medium text-sm">Package Details</p>
                      </div>
                      {item.storageType && (
                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getPackageTypeInfo(item.storageType).color}`}
                        >
                          {getPackageTypeInfo(item.storageType).icon}
                          <span className="uppercase">{item.storageType}</span>
                        </div>
                      )}
                    </div>

                    {/* Main content in a grid layout */}
                    <div className="p-3 space-y-3">
                      {/* Package Images */}
                      {item.image && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">PACKAGE IMAGES</p>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt="Package"
                                fill
                                className="object-cover"
                              />
                            </div>
                            {/* Additional images */}
                            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                              <Image
                                src="/placeholder.svg?height=80&width=80&text=Package"
                                alt="Package"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                              <Image
                                src="/placeholder.svg?height=80&width=80&text=Label"
                                alt="Package"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Package Information */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">PACKAGE INFO</p>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="bg-gray-50 rounded p-2 text-sm">
                            <p className="text-gray-500 text-xs">Metro Tracking</p>
                            <p className="font-medium">MRC-{Math.floor(10000000 + Math.random() * 90000000)}</p>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-sm">
                            <p className="text-gray-500 text-xs">Package ID</p>
                            <p className="font-medium">{item.id}</p>
                          </div>
                        </div>
                      </div>

                      {/* Customer and Carrier Info */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">CUSTOMER & CARRIER</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded p-2 text-center flex flex-col justify-center h-full">
                            <p className="text-sm font-bold items-center justify-center mx-auto text-xs">
                              {["Amazon", "Fedex", "UPS", "USPS"][Math.floor(Math.random() * 4)]}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-center">
                            <p className="text-xs text-gray-500">CARRIER TRACK #</p>
                            <Badge className="bg-green-100 text-green-700 border-0 flex items-center justify-center mx-auto text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              TBA{(318500000 + Math.random() * 1000000).toString().substring(0, 9)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Storage Location */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">STORAGE LOCATION</p>
                        <div className="grid grid-cols-5 gap-1">
                          <div className="text-center bg-gray-50 rounded p-1">
                            <p className="text-xs text-gray-500">AREA</p>
                            <p className="text-sm font-bold">{item.storageArea}</p>
                          </div>
                          <div className="text-center bg-gray-50 rounded p-1">
                            <p className="text-xs text-gray-500">ROW</p>
                            <p className="text-sm font-bold">{item.storageRow}</p>
                          </div>
                          <div className="text-center bg-gray-50 rounded p-1">
                            <p className="text-xs text-gray-500">BAY</p>
                            <p className="text-sm font-bold">{item.storageBay}</p>
                          </div>
                          <div className="text-center bg-gray-50 rounded p-1">
                            <p className="text-xs text-gray-500">LEVEL</p>
                            <p className="text-sm font-bold">{item.storageLevel}</p>
                          </div>
                          <div className="text-center bg-gray-50 rounded p-1">
                            <p className="text-xs text-gray-500">BIN</p>
                            <p className="text-sm font-bold">{item.storageBin}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer with status */}
                    <div className="border-t border-gray-100 bg-gray-50 rounded-b-lg">
                      {/* Status bar - always visible */}
                      <div className="p-2 flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${item.status === "labeled" ? "bg-green-500" : "bg-amber-500"}`}
                          ></div>
                          <p className="text-xs text-gray-500">
                            Status:{" "}
                            <span
                              className={`font-medium ${item.status === "labeled" ? "text-green-600" : "text-amber-600"}`}
                            >
                              {item.status === "labeled" ? "Processed" : "Pending"}
                            </span>
                            {item.status === "labeled" && (
                              <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
                                Available for pickup
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500">Arrived: {item.arrivalTime}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const currentExpanded = expandedTimeline === item.id
                              setExpandedTimeline(currentExpanded ? null : item.id)
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <ChevronRight
                              className={`h-4 w-4 transition-transform ${expandedTimeline === item.id ? "rotate-90" : ""}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Timeline - expandable */}
                      {expandedTimeline === item.id && (
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock3 className="h-4 w-4 text-gray-400" />
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
                                <p className="text-xs text-gray-400 italic">
                                  (Customer notified or request acknowledged)
                                </p>
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
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Scan Button */}
        <div className="bg-white p-4 border-t border-gray-100">
          <div className="flex items-center justify-end bg-gray-50 p-3 rounded-xl mb-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-green-600 text-white border-0 hover:bg-green-700"
                onClick={() => {
                  // Create a new scan history entry with current items
                  if (scannedItems.length > 0) {
                    const newScanEntry: RecentScanItem = {
                      id: `RCV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
                        Math.random() * 1000,
                      )
                        .toString()
                        .padStart(3, "0")}`,
                      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
                      supplier: "Current Batch",
                      location: "Warehouse A01",
                      items: scannedItems.length,
                      status: "completed",
                    }

                    // Add to recent scans
                    setRecentScans((prev) => [newScanEntry, ...prev])

                    // Show success message
                    alert("Batch completed and moved to recent scan history")
                  }

                  // Clear current scanned items regardless of whether there were any
                  setScannedItems([])
                }}
              >
                <Check className="h-4 w-4 mr-1" />
                Complete and Scan New Batch
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-black text-white border-0 hover:bg-gray-800"
                onClick={handleScanItem}
              >
                <Scan className="h-4 w-4 mr-1" />
                Scan
              </Button>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx global>
        {scrollbarStyles}
      </style>
      <div className="flex flex-col min-h-screen bg-white">
        {renderStepContent()}
        {renderScannedItemsList()}

        {/* Recent Scan History Section - only show on main screen */}
        {currentStep === 1 && (
          <div className="px-4 pb-20 mt-4">
            <div className="mt-4 space-y-6">
              <div>
                <h2 className="text-xl font-medium mb-1">Recent Scan History</h2>
                <p className="text-gray-500 text-sm">Your recent receiving activity</p>
              </div>

              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm relative mb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{scan.id}</div>
                        <div className="text-gray-500 text-sm">{scan.timestamp}</div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          scan.status === "completed"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }`}
                      >
                        {scan.status === "completed" ? "Completed" : "Pending"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-gray-600 text-sm">{scan.supplier}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-1">
                      <Building className="h-3.5 w-3.5 text-gray-400" />
                      <div className="text-sm">
                        <span className="text-gray-600">{scan.location}</span>
                        <p className="text-gray-500 text-xs">{getWarehouseAddress(scan.location)}</p>
                      </div>
                    </div>

                    {/* Add expanded view with scanned item cards */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <Package className="h-3.5 w-3.5 mr-1" />
                        <span>{scan.items} items</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs p-0 flex items-center text-gray-500"
                        onClick={() => setExpandedHistoryItem(expandedHistoryItem === scan.id ? null : scan.id)}
                      >
                        {expandedHistoryItem === scan.id ? "Hide Details" : "Details"}
                        <ChevronRight
                          className={`h-3.5 w-3.5 ml-1 transition-transform ${
                            expandedHistoryItem === scan.id ? "rotate-90" : ""
                          }`}
                        />
                      </Button>
                    </div>

                    {/* Add expanded view with scanned item cards */}
                    {expandedHistoryItem === scan.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
                        <p className="text-xs font-medium text-gray-500 mb-2">SCANNED ITEMS</p>
                        <div className="space-y-3">
                          {/* Generate 12 sample items with different data */}
                          {Array.from({ length: 12 }, (_, idx) => {
                            // Generate different package types
                            const packageTypes = ["standard", "fridge", "fragile", "urgent", "special"]
                            const storageType = packageTypes[idx % packageTypes.length]

                            // Generate different customer names and codes
                            const customers = [
                              { name: "John Smith", code: "MRC10927XYZ" },
                              { name: "Sarah Johnson", code: "MRC22845ABC" },
                              { name: "David Brown", code: "MRC38291DEF" },
                              { name: "Michael Wilson", code: "MRC47362GHI" },
                              { name: "Emily Davis", code: "MRC56473JKL" },
                              { name: "Robert Taylor", code: "MRC65584MNO" },
                              { name: "Jennifer Anderson", code: "MRC74695PQR" },
                              { name: "William Thomas", code: "MRC83706STU" },
                              { name: "Elizabeth Jackson", code: "MRC92817VWX" },
                              { name: "James White", code: "MRC01928YZA" },
                              { name: "Patricia Harris", code: "MRC19283BCD" },
                              { name: "Richard Martin", code: "MRC29384EFG" },
                            ]

                            // Generate different product categories
                            const products = [
                              "Home Essentials",
                              "Kitchen Appliances",
                              "Office Supplies",
                              "Electronics",
                              "Furniture",
                              "Books",
                              "Clothing",
                              "Sporting Goods",
                              "Toys",
                              "Beauty Products",
                              "Garden Tools",
                              "Pet Supplies",
                            ]

                            // Generate different storage locations
                            const area = `A${Math.floor(idx / 4) + 1}`.padStart(3, "0")
                            const row = `R${Math.floor(idx / 3) + 1}`.padStart(3, "0")
                            const bay = `B${Math.floor(idx / 2) + 1}`.padStart(3, "0")
                            const level = `L${idx + 1}`.padStart(3, "0")
                            const bin = `Bin${idx.toString().padStart(3, "0")}`

                            return {
                              id: `178119813${(8000 + idx).toString().padStart(4, "0")}`,
                              name: `${products[idx]} ${customers[idx].name} ${customers[idx].code}`,
                              customerCode: customers[idx].code,
                              icon: idx % 2 === 0 ? "mail" : "amazon",
                              arrivalTime:
                                `${(idx % 12) + 1}:${(idx * 5) % 60}`.padStart(5, "0") + (idx % 2 === 0 ? "am" : "pm"),
                              status: idx % 3 === 0 ? "pending" : "labeled",
                              warehouseLabel: `${area}-${row}-${bay}-${level}-${bin}`,
                              storageArea: area,
                              storageRow: row,
                              storageBay: bay,
                              storageLevel: level,
                              storageBin: bin,
                              storageType: storageType,
                              image: "/placeholder.svg?height=80&width=80&text=Package",
                            }
                          }).map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-start mb-3">
                                <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                                <p className="font-medium truncate">{item.name}</p>
                              </div>

                              <div className="bg-white border border-gray-200 rounded-lg shadow-sm relative">
                                {/* Header with Package Type */}
                                <div className="flex items-center justify-between p-3 border-b border-gray-100">
                                  <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-gray-500" />
                                    <p className="font-medium text-sm">Package Details</p>
                                  </div>
                                  {item.storageType && (
                                    <div
                                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${getPackageTypeInfo(item.storageType).color}`}
                                    >
                                      {getPackageTypeInfo(item.storageType).icon}
                                      <span className="uppercase">{item.storageType}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Main content in a grid layout */}
                                <div className="p-3 space-y-3">
                                  {/* Package Images */}
                                  {item.image && (
                                    <div>
                                      <p className="text-xs font-medium text-gray-500 mb-1">PACKAGE IMAGES</p>
                                      <div className="flex gap-2 overflow-x-auto pb-1">
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                          <Image
                                            src={item.image || "/placeholder.svg"}
                                            alt="Package"
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        {/* Additional images */}
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                          <Image
                                            src="/placeholder.svg?height=80&width=80&text=Package"
                                            alt="Package"
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                        <div className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200">
                                          <Image
                                            src="/placeholder.svg?height=80&width=80&text=Label"
                                            alt="Package"
                                            fill
                                            className="object-cover"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Package Information */}
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">PACKAGE INFO</p>
                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="bg-gray-50 rounded p-2 text-sm">
                                        <p className="text-gray-500 text-xs">Metro Tracking</p>
                                        <p className="font-medium">
                                          MRC-{Math.floor(10000000 + Math.random() * 90000000)}
                                        </p>
                                      </div>
                                      <div className="bg-gray-50 rounded p-2 text-sm">
                                        <p className="text-gray-500 text-xs">Package ID</p>
                                        <p className="font-medium">{item.id}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Customer and Carrier Info */}
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">CUSTOMER & CARRIER</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="bg-gray-50 rounded p-2 text-center flex flex-col justify-center h-full">
                                        <p className="text-sm font-bold items-center justify-center mx-auto text-xs">
                                          {["Amazon", "Fedex", "UPS", "USPS"][Math.floor(Math.random() * 4)]}
                                        </p>
                                      </div>
                                      <div className="bg-gray-50 rounded p-2 text-center">
                                        <p className="text-xs text-gray-500">CARRIER TRACK #</p>
                                        <Badge className="bg-green-100 text-green-700 border-0 flex items-center justify-center mx-auto text-xs">
                                          <Tag className="h-3 w-3 mr-1" />
                                          TBA{(318500000 + Math.random() * 1000000).toString().substring(0, 9)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Storage Location */}
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-1">STORAGE LOCATION</p>
                                    <div className="grid grid-cols-5 gap-1">
                                      <div className="text-center bg-gray-50 rounded p-1">
                                        <p className="text-xs text-gray-500">AREA</p>
                                        <p className="text-sm font-bold">{item.storageArea}</p>
                                      </div>
                                      <div className="text-center bg-gray-50 rounded p-1">
                                        <p className="text-xs text-gray-500">ROW</p>
                                        <p className="text-sm font-bold">{item.storageRow}</p>
                                      </div>
                                      <div className="text-center bg-gray-50 rounded p-1">
                                        <p className="text-xs text-gray-500">BAY</p>
                                        <p className="text-sm font-bold">{item.storageBay}</p>
                                      </div>
                                      <div className="text-center bg-gray-50 rounded p-1">
                                        <p className="text-xs text-gray-500">LEVEL</p>
                                        <p className="text-sm font-bold">{item.storageLevel}</p>
                                      </div>
                                      <div className="text-center bg-gray-50 rounded p-1">
                                        <p className="text-xs text-gray-500">BIN</p>
                                        <p className="text-sm font-bold">{item.storageBin}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Footer with status */}
                                <div className="border-t border-gray-100 bg-gray-50 rounded-b-lg">
                                  {/* Status bar - always visible */}
                                  <div className="p-2 flex justify-between items-center">
                                    <div className="flex items-center gap-1">
                                      <div
                                        className={`w-2 h-2 rounded-full ${item.status === "labeled" ? "bg-green-500" : "bg-amber-500"}`}
                                      ></div>
                                      <p className="text-xs text-gray-500">
                                        Status:{" "}
                                        <span
                                          className={`font-medium ${item.status === "labeled" ? "text-green-600" : "text-amber-600"}`}
                                        >
                                          {item.status === "labeled" ? "Processed" : "Pending"}
                                        </span>
                                        {item.status === "labeled" && (
                                          <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
                                            Available for pickup
                                          </span>
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs text-gray-500">Arrived: {item.arrivalTime}</p>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          const currentExpanded = expandedTimeline === item.id
                                          setExpandedTimeline(currentExpanded ? null : item.id)
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        <ChevronRight
                                          className={`h-4 w-4 transition-transform ${expandedTimeline === item.id ? "rotate-90" : ""}`}
                                        />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Timeline - expandable */}
                                  {expandedTimeline === item.id && (
                                    <div className="bg-gray-50 p-4 rounded-xl">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Clock3 className="h-4 w-4 text-gray-400" />
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
                                            <p className="text-xs text-gray-400 italic">
                                              (Package released to customer)
                                            </p>
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
                                            <p className="text-xs text-gray-400 italic">
                                              (Staff began processing pickup)
                                            </p>
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
                                            <p className="text-xs text-gray-400 italic">
                                              (Customer notified or request acknowledged)
                                            </p>
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
                                            <p className="text-xs text-gray-400 italic">
                                              (Checked into warehouse system)
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex gap-3">
                                          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                          <div>
                                            <p className="text-sm font-medium">Package Arrived at Warehouse</p>
                                            <p className="text-xs text-gray-500">Today, 9:30 AM</p>
                                            <p className="text-xs text-gray-400 italic">
                                              (Received from carrier or supplier)
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full h-12 text-gray-700 border-gray-200 rounded-xl">
                View All History
              </Button>
            </div>
          </div>
        )}

        {/* Camera Barcode Scanner Dialog */}
        <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Scan Warehouse Label</DialogTitle>
            </DialogHeader>
            <div className="relative h-80 bg-black flex items-center justify-center">
              <RealtimeScanner onDetected={(text) => handleCameraBarcodeScan(text)} />
            </div>

            <div className="p-4">
              <Button
                className="w-full"
                onClick={() => {
                  // Simulate a successful scan for demo purposes
                  const mockBarcode = `WH-${Math.floor(Math.random() * 100)}-${Math.floor(Math.random() * 100)}-${Math.floor(
                    Math.random() * 100,
                  )}`
                  handleCameraBarcodeScan(mockBarcode)
                }}
              >
                <Scan className="h-4 w-4 mr-2" />
                Simulate Scan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* 2D Matrix Scanner Dialog for Carrier Tracking */}
        <Dialog
          open={carrierScannerOpen}
          onOpenChange={(open) => {
            setCarrierScannerOpen(open)
            if (!open && videoRef.current && videoRef.current.srcObject) {
              // Stop camera when dialog closes
              const stream = videoRef.current.srcObject as MediaStream
              stream.getTracks().forEach((track) => track.stop())
            }
          }}
        >
          <DialogContent className="sm:max-w-md p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Scan Carrier Tracking Code</DialogTitle>
            </DialogHeader>
            <div className="relative h-80 bg-black flex items-center justify-center">
              {/* Custom scanner for 2D matrix codes with green contour */}
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-green-500 rounded-lg opacity-80 animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white text-sm">Position 2D matrix code within the green frame</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <Button
                className="w-full"
                onClick={() => {
                  // Simulate a successful scan for demo purposes
                  const mockTrackingNumber = `TBA${Math.floor(Math.random() * 1000000000)
                    .toString()
                    .padStart(9, "0")}`
                  handleCarrierBarcodeScan(mockTrackingNumber)
                }}
              >
                <QrCode className="h-4 w-4 mr-2" />
                Simulate 2D Matrix Scan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Full Image Gallery Dialog */}
        <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Package Images ({capturedImages.length})</DialogTitle>
            </DialogHeader>

            <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {capturedImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`Package Image ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index < 6}
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    <Camera className="h-3 w-3 inline-block mr-1" />
                    Image {index + 1}
                  </div>
                  <button
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCapturedImages((prev) => prev.filter((_, i) => i !== index))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4">
              <Button className="w-full" onClick={() => setShowFullImage(false)}>
                Close Gallery
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
