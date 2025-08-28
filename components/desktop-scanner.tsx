"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerPackages from "@/components/customer-packages"
import SignatureCapture from "@/components/signature-capture"
import PickupComplete from "@/components/pickup-complete"
import PickupHistory from "@/components/pickup-history"
import RealtimeScanner from "@/components/realtime-scanner"
import ReceivingView from "@/components/receiving-view"
import PackageVerification from "@/components/package-verification"
import DesktopSidebar from "@/components/desktop-sidebar"
import DesktopSpeedReceiving from "@/components/desktop-speed-receiving"
import { Barcode, Camera, Package, Users, History, Scan, Search, X, Zap } from "lucide-react"
import type { Customer } from "@/types"
import { Badge } from "@/components/ui/badge"

export default function DesktopScanner() {
  const [step, setStep] = useState(1)
  const [customerBarcode, setCustomerBarcode] = useState("")
  const [scanMode, setScanMode] = useState<"pickup" | "receiving" | "speed-receiving">("pickup")
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    location: "",
    packages: [],
  })
  const [signatureCaptured, setSignatureCaptured] = useState(false)
  const [warehouseCapacity, setWarehouseCapacity] = useState(10)

  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState([
    {
      id: "MRC-20250327-12345",
      carrier: "Amazon",
      tracking: "TBA1234567890",
      status: "Ready",
    },
    {
      id: "MRC-20250327-67890",
      carrier: "FedEx",
      tracking: "FDX9876543210",
      status: "In Transit",
    },
    {
      id: "MRC-20250326-54321",
      carrier: "USPS",
      tracking: "USPS1122334455",
      status: "Ready",
    },
  ])

  // Memoize the fetchCustomerPackages function
  const fetchCustomerPackages = useCallback(() => {
    setCustomer({
      name: "John Doe",
      location: "Warehouse A01",
      packages: [
        { id: "P-20250307-12345", bin: "A01-R01-B01-L05" },
        { id: "P-20250307-67890", bin: "A01-R02-B02-L10" },
        { id: "P-20250307-54321", bin: "A01-R03-B03-L15" },
      ],
    })
    setStep(2)
  }, [])

  const handleBarcodeDetected = useCallback(
    (barcode: string) => {
      setCustomerBarcode(barcode)
      fetchCustomerPackages()
    },
    [fetchCustomerPackages],
  )

  const confirmHandover = useCallback(() => {
    setStep(3)
  }, [])

  const completeVerification = useCallback(() => {
    setStep(4)
  }, [])

  const updateWarehouse = useCallback(() => {
    setWarehouseCapacity((prev) => prev + customer.packages.length)
    setCustomer((prev) => ({ ...prev, packages: [] }))
    setSignatureCaptured(false)
    setStep(5)
  }, [customer.packages.length])

  const resetWorkflow = useCallback(() => {
    setStep(1)
    setCustomerBarcode("")
    setCustomer({ name: "", location: "", packages: [] })
    setSignatureCaptured(false)
  }, [])

  const backToPackageDetails = useCallback(() => {
    setStep(2)
  }, [])

  const handleBackFromSpeedReceiving = useCallback(() => {
    setScanMode("receiving")
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".search-container")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {/* Main Navigation Sidebar */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Speed Receiving Mode - Full Screen */}
            {scanMode === "speed-receiving" && <DesktopSpeedReceiving onBack={handleBackFromSpeedReceiving} />}

            {/* Regular Scanner Interface */}
            {scanMode !== "speed-receiving" && (
              <>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Warehouse Scanner</h1>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Scan and manage package pickups and deliveries
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant={scanMode === "pickup" ? "default" : "outline"}
                        onClick={() => setScanMode("pickup")}
                        className="flex items-center gap-2"
                      >
                        <Package className="h-4 w-4" />
                        Pickup Mode
                      </Button>
                      <Button
                        variant={scanMode === "receiving" ? "default" : "outline"}
                        onClick={() => setScanMode("receiving")}
                        className="flex items-center gap-2"
                      >
                        <Scan className="h-4 w-4" />
                        Receiving Mode
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setScanMode("speed-receiving")}
                        className="flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500"
                      >
                        <Zap className="h-4 w-4" />
                        Speed Mode
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative search-container w-full">
                    <div className="flex items-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 w-full">
                      <Search className="h-6 w-6 text-gray-400 dark:text-gray-500 mr-4" />
                      <input
                        type="text"
                        placeholder="Search packages, tracking numbers..."
                        className="bg-transparent border-none outline-none text-xl font-medium w-full placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 text-gray-900 dark:text-white"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          if (e.target.value.length > 2) {
                            setShowSearchResults(true)
                          } else {
                            setShowSearchResults(false)
                          }
                        }}
                      />
                      {searchQuery && (
                        <button
                          className="ml-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                          onClick={() => {
                            setSearchQuery("")
                            setShowSearchResults(false)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {showSearchResults && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50 max-h-64 overflow-y-auto">
                        <div className="p-2 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">PACKAGES</p>
                        </div>
                        {searchResults
                          .filter(
                            (result) =>
                              result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (result.tracking && result.tracking.toLowerCase().includes(searchQuery.toLowerCase())),
                          )
                          .map((result, index) => (
                            <div
                              key={index}
                              className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                              onClick={() => {
                                setSearchQuery("")
                                setShowSearchResults(false)
                                // Handle search result selection
                              }}
                            >
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${result.carrier === "Amazon" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : result.carrier === "FedEx" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"}`}
                              >
                                <Package className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900 dark:text-white">{result.id}</p>
                                {result.tracking && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Tracking: {result.tracking}
                                  </p>
                                )}
                              </div>
                              <Badge
                                className={`ml-auto ${result.status === "Ready" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0" : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0"}`}
                              >
                                {result.status}
                              </Badge>
                            </div>
                          ))}
                        {searchQuery.length > 2 &&
                          searchResults.filter(
                            (result) =>
                              result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (result.tracking && result.tracking.toLowerCase().includes(searchQuery.toLowerCase())),
                          ).length === 0 && (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                              <p>No packages found matching "{searchQuery}"</p>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Main Scanner Area */}
                  <div className="xl:col-span-2">
                    {/* Scanner View (Step 1) */}
                    {step === 1 && scanMode === "pickup" && (
                      <Card className="h-fit bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Camera className="h-5 w-5" />
                            Customer Scanner
                            <span className="ml-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                              1
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Camera Scanner */}
                          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                            <RealtimeScanner onDetected={handleBarcodeDetected} />
                          </div>

                          {/* Manual Input */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Manual Entry</h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                Enter customer ID manually or use the camera scanner above
                              </p>
                            </div>

                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="Enter Customer ID (e.g., MRC10927XYZ)"
                                value={customerBarcode}
                                onChange={(e) => {
                                  setCustomerBarcode(e.target.value)
                                  if (e.target.value.length > 10) {
                                    setTimeout(() => {
                                      fetchCustomerPackages()
                                    }, 300)
                                  }
                                }}
                                onKeyDown={(e) => e.key === "Enter" && customerBarcode && fetchCustomerPackages()}
                                className="h-12 pl-4 pr-12 text-lg bg-white dark:bg-black border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                                <Barcode className="h-6 w-6" />
                              </div>
                            </div>

                            {/* Quick Select Options */}
                            <div className="grid grid-cols-2 gap-3">
                              {["MRC10927XYZ", "MRC22845ABC", "MRC38291DEF", "MRC47362GHI"].map((id) => (
                                <Button
                                  key={id}
                                  variant="outline"
                                  onClick={() => {
                                    setCustomerBarcode(id)
                                    fetchCustomerPackages()
                                  }}
                                  className="justify-start"
                                >
                                  <Barcode className="h-4 w-4 mr-2" />
                                  {id}
                                </Button>
                              ))}
                            </div>

                            <Button
                              className="w-full h-12 text-lg"
                              onClick={() => handleBarcodeDetected("CUST-20250327-12345")}
                              disabled={!customerBarcode}
                            >
                              Process Customer Scan
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Receiving View */}
                    {step === 1 && scanMode === "receiving" && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Scan className="h-5 w-5" />
                            Package Receiving
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ReceivingView />
                        </CardContent>
                      </Card>
                    )}

                    {/* Customer Packages (Step 2) */}
                    {step === 2 && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Package className="h-5 w-5" />
                            Customer Packages
                            <span className="ml-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                              2
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CustomerPackages customer={customer} onConfirm={confirmHandover} barcode={customerBarcode} />
                        </CardContent>
                      </Card>
                    )}

                    {/* Package Verification (Step 3) */}
                    {step === 3 && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Users className="h-5 w-5" />
                            Package Verification
                            <span className="ml-2 bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                              3
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PackageVerification
                            customer={customer}
                            onComplete={completeVerification}
                            onBack={backToPackageDetails}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Signature Capture (Step 4) */}
                    {step === 4 && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Users className="h-5 w-5" />
                            Digital Signature
                            <span className="ml-2 bg-purple-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                              4
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SignatureCapture
                            signatureCaptured={signatureCaptured}
                            setSignatureCaptured={setSignatureCaptured}
                            onComplete={updateWarehouse}
                            customer={{
                              name: customer.name,
                              address: customer.location,
                            }}
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Pickup Complete (Step 5) */}
                    {step === 5 && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                            <Package className="h-5 w-5" />
                            Pickup Complete
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <PickupComplete warehouseCapacity={warehouseCapacity} onReset={resetWorkflow} />
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Right Sidebar - Scanner Info */}
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-lg text-gray-900 dark:text-white">Today's Activity</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Packages Scanned</span>
                          <span className="font-semibold text-gray-900 dark:text-white">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Pickups Completed</span>
                          <span className="font-semibold text-gray-900 dark:text-white">18</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Warehouse Capacity</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{warehouseCapacity}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Progress */}
                    {step > 1 && step < 5 && (
                      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-lg text-gray-900 dark:text-white">Current Process</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-medium">
                                ✓
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">Customer Scanned</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  step >= 3
                                    ? "bg-green-500 text-white"
                                    : step === 2
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {step >= 3 ? "✓" : "2"}
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">Packages Confirmed</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  step >= 4
                                    ? "bg-green-500 text-white"
                                    : step === 3
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {step >= 4 ? "✓" : "3"}
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">Verification Complete</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                  step >= 5
                                    ? "bg-green-500 text-white"
                                    : step === 4
                                      ? "bg-blue-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {step >= 5 ? "✓" : "4"}
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">Signature Captured</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Recent History */}
                    <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-white">
                          <History className="h-5 w-5" />
                          Recent Pickups
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PickupHistory visible={true} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
