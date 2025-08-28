"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronRight,
  QrCode,
  CheckCircle2,
  CalendarClock,
  Clock,
  Building,
  Truck,
  ClipboardCopy,
  ChevronDown,
  X,
  Package,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DesktopLayout from "@/components/desktop-layout"
import Image from "next/image"
import Link from "next/link"

export default function MyMetroPage() {
  const [userName, setUserName] = useState("Lutfy")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [packagesExpanded, setPackagesExpanded] = useState(false)
  const [expandedTimeline, setExpandedTimeline] = useState<string | null>(null)
  const [expandedHistoryItem, setExpandedHistoryItem] = useState<string | null>(null)
  const [verificationStep, setVerificationStep] = useState<"details" | "scan" | "complete">("details")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pickupStarted, setPickupStarted] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingComplete, setLoadingComplete] = useState(false)

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
    {
      id: "MRC-20250325-98765",
      carrier: "Amazon",
      tracking: "TBA0987654321",
      status: "Ready",
    },
    {
      id: "MRC-20250324-13579",
      carrier: "FedEx",
      tracking: "FDX1357924680",
      status: "In Transit",
    },
  ])

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

  // Sample recent pickup history data
  const recentPickups = [
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
      id: "PU-20250326-002",
      timestamp: "Yesterday, 09:15 AM",
      customer: "Jane Smith",
      location: "Warehouse A01",
      packages: [{ id: "P-20250326-54321", bin: "A01-R03-B03-L15" }],
      status: "completed",
    },
  ]

  return (
    <DesktopLayout>
      <div className="min-h-screen bg-white pb-20 md:pb-0">
        <div className="max-w-full mx-auto">
          {/* Header Search Field */}
          <div className="relative search-container w-full px-4 py-3 border-b border-gray-100">
            <div className="flex items-center bg-white rounded-lg px-3 py-3 w-full">
              <Search className="h-6 w-6 text-gray-400 mr-4" />
              <input
                type="text"
                placeholder="Search packages, tracking numbers..."
                className="bg-transparent border-none outline-none text-2xl font-medium w-full placeholder:text-gray-400 focus:ring-0"
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
                  className="ml-1 text-gray-400 hover:text-gray-600"
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
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">PACKAGES</p>
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
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        // Navigate to package or show details
                        setSearchQuery("")
                        setShowSearchResults(false)
                        setExpandedHistoryItem(result.id)
                        // Scroll to the package if needed
                      }}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${result.carrier === "Amazon" ? "bg-amber-100 text-amber-600" : result.carrier === "FedEx" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}
                      >
                        {result.carrier === "Amazon" ? (
                          <Package className="h-4 w-4" />
                        ) : result.carrier === "FedEx" ? (
                          <Truck className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{result.id}</p>
                        {result.tracking && <p className="text-xs text-gray-500">Tracking: {result.tracking}</p>}
                      </div>
                      <Badge
                        className={`ml-auto ${result.status === "Ready" ? "bg-green-100 text-green-700 border-0" : "bg-blue-100 text-blue-700 border-0"}`}
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
                    <div className="p-4 text-center text-gray-500">
                      <p>No packages found matching "{searchQuery}"</p>
                    </div>
                  )}
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden fixed top-4 right-4 z-50">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content */}
          <div className="px-4 pt-6 md:px-6 md:pt-8">
            <div className="md:grid md:grid-cols-1 md:gap-6">
              {/* Main Content */}
              <div className="space-y-8">
                {/* Priority Packages */}
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Priority Packages</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="relative h-40 bg-gray-50">
                        <Image
                          src="/placeholder.svg?height=160&width=320&text=Amazon+Package"
                          alt="Package"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-100 text-green-700 border-0">Food Pickup</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-600">Amazon</p>
                            <p className="font-medium">MRC-20250327-12345</p>
                          </div>
                          <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100">
                            <Image
                              src="/images/amazon-logo.png"
                              alt="Amazon Logo"
                              width={30}
                              height={30}
                              className="object-contain"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Processing</span>
                            <span>Ready</span>
                            <span>Pickup</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 bg-green-500 rounded-full w-2/3 relative">
                              <div className="absolute -top-1 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              <div className="absolute -top-1 left-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              <div className="absolute -top-1 right-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Available until today, 6:00 PM</p>
                        </div>

                        <div className="flex justify-end mt-3">
                          <Link href={`/package/${encodeURIComponent("MRC-20250327-12345")}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            >
                              View details
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="relative h-40 bg-gray-50">
                        <Image
                          src="/placeholder.svg?height=160&width=320&text=FedEx+Package"
                          alt="Package"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-100 text-red-700 border-0">Urgent Pickup</Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm text-gray-600">FedEx</p>
                            <p className="font-medium">MRC-20250327-67890</p>
                          </div>
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Truck className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Processing</span>
                            <span>Ready</span>
                            <span>Pickup</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 bg-green-500 rounded-full w-1/2 relative">
                              <div className="absolute -top-1 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              <div className="absolute -top-1 left-1/2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              <div className="absolute -top-1 right-0 w-3 h-3 bg-gray-300 rounded-full border-2 border-white"></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Available until tomorrow, 4:00 PM</p>
                        </div>

                        <div className="flex justify-end mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            Details
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Available pickups section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Available Pickups (3)</h2>
                    <button className="flex items-center text-gray-900 font-medium text-sm">
                      <QrCode className="h-4 w-4 mr-1" />
                      Show QR Code
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">Ready for pickup</p>
                            <p className="text-sm text-gray-500">3 packages available</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                          Ready
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarClock className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600">
                            Available until: <span className="font-medium">March 31, 2025, 6:00 PM</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600">
                            Pickup hours: <span className="font-medium">9:00 AM - 6:00 PM</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-400" />
                          <p className="text-gray-600">
                            Hub location:{" "}
                            <span className="font-medium text-blue-600 underline cursor-pointer">View on map</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Package list */}
                    <div className="p-5">
                      <p className="text-sm font-medium text-gray-700 mb-3">Packages in this pickup:</p>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => {
                          const packageId = `MRC-20250327-${12345 + i}`
                          const carrier = i === 1 ? "Amazon" : i === 2 ? "FedEx" : "USPS"
                          const isExpanded = expandedHistoryItem === packageId

                          return (
                            <div key={i} className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                              {/* Collapsed view */}
                              <div
                                className="flex items-center justify-between p-4 cursor-pointer"
                                onClick={() => setExpandedHistoryItem(isExpanded ? null : packageId)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                                    SH
                                  </div>
                                  <div>
                                    <p className="font-medium">{packageId}</p>
                                    <p className="text-sm text-gray-500">{carrier}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="h-1.5 w-24 bg-gray-200 rounded-full">
                                        <div className="h-1.5 bg-green-500 rounded-full w-full"></div>
                                      </div>
                                      <span className="text-xs text-gray-500">100% ready</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-green-100 text-green-700 border-0">Ready</Badge>
                                  <ChevronRight
                                    className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                                  />
                                </div>
                              </div>

                              {/* Expanded view */}
                              {isExpanded && (
                                <div className="border-t border-gray-100 animate-in slide-in-from-top duration-200">
                                  <div className="p-4">
                                    <div className="flex flex-col space-y-4">
                                      {/* Carrier Info */}
                                      <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">{carrier}</p>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                          <p className="text-xs text-gray-500 mb-1">TRACKING NUMBER</p>
                                          <div className="flex items-center gap-2">
                                            <p className="font-mono font-medium">
                                              TBA{Math.floor(1000000000 + Math.random() * 9000000000)}
                                            </p>
                                            <button className="text-gray-400 hover:text-gray-600">
                                              <ClipboardCopy className="h-3.5 w-3.5" />
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Package Images */}
                                      <div>
                                        <p className="text-xs text-gray-500 mb-2">PACKAGE IMAGES</p>
                                        <div className="grid grid-cols-3 gap-2">
                                          <div className="aspect-square bg-gray-100 rounded-md relative overflow-hidden">
                                            <Image
                                              src={`/package-icon.png?height=80&width=80&text=Package+${i}`}
                                              alt="Package"
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div className="aspect-square bg-gray-100 rounded-md relative overflow-hidden">
                                            <Image
                                              src={`/generic-label.png?height=80&width=80&text=Label+${i}`}
                                              alt="Package Label"
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div className="aspect-square bg-gray-100 rounded-md relative overflow-hidden">
                                            <Image
                                              src={`/simple-box-icon.png?height=80&width=80&text=Box+${i}`}
                                              alt="Package Box"
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Package Details */}
                                      <div>
                                        <p className="text-xs text-gray-500 mb-2">PACKAGE DETAILS</p>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                          <p className="text-sm">
                                            {2 + i * 0.5} kg • {i === 1 ? "Small" : i === 2 ? "Medium" : "Large"}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Package Timeline */}
                                      <div className="mt-2">
                                        <button
                                          className="flex items-center justify-between w-full text-left"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setExpandedTimeline(
                                              expandedTimeline === `package-${i}` ? null : `package-${i}`,
                                            )
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center">
                                              <Clock className="h-3 w-3 text-gray-500" />
                                            </div>
                                            <p className="text-sm font-medium">Package Timeline</p>
                                          </div>
                                          <ChevronDown
                                            className={`h-4 w-4 text-gray-400 transition-transform ${expandedTimeline === `package-${i}` ? "rotate-180" : ""}`}
                                          />
                                        </button>

                                        {expandedTimeline === `package-${i}` && (
                                          <div className="mt-3 pl-7 space-y-4 animate-in slide-in-from-top duration-200">
                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                              </div>
                                              <p className="font-medium">Pickup Completed</p>
                                              <p className="text-xs text-gray-500">Today, 10:23 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Package released to customer)
                                              </p>
                                            </div>

                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                              </div>
                                              <p className="font-medium">Customer Signature</p>
                                              <p className="text-xs text-gray-500">Today, 10:22 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Proof of handoff captured)
                                              </p>
                                            </div>

                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                              </div>
                                              <p className="font-medium">Pickup Initiated</p>
                                              <p className="text-xs text-gray-500">Today, 10:20 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Staff began processing pickup)
                                              </p>
                                            </div>

                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                              </div>
                                              <p className="font-medium">Package Ready for Pickup</p>
                                              <p className="text-xs text-gray-500">Today, 10:00 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Customer notified or request acknowledged)
                                              </p>
                                            </div>

                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                              </div>
                                              <p className="font-medium">Storage Location Assigned</p>
                                              <p className="text-xs text-gray-500">Today, 9:35 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Stored at: A01-R01-B03-L02)
                                              </p>
                                            </div>

                                            <div className="relative pl-6 pb-4 border-l border-gray-200">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                              </div>
                                              <p className="font-medium">Package Scanned In</p>
                                              <p className="text-xs text-gray-500">Today, 9:32 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Checked into warehouse system)
                                              </p>
                                            </div>

                                            <div className="relative pl-6">
                                              <div className="absolute left-[-8px] top-0">
                                                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                                              </div>
                                              <p className="font-medium">Package Arrived at Warehouse</p>
                                              <p className="text-xs text-gray-500">Today, 9:30 AM</p>
                                              <p className="text-xs text-gray-400 italic">
                                                (Received from carrier or supplier)
                                              </p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      <div className="mt-4">
                        {!isLoading && !pickupStarted ? (
                          <Button
                            className="w-full bg-black hover:bg-gray-800 text-white"
                            onClick={() => {
                              console.log("Button clicked")
                              setIsLoading(true)

                              // Start with 0 progress
                              setLoadingProgress(0)

                              // Create a counter that goes from 0 to 60
                              let counter = 0
                              const timer = setInterval(() => {
                                counter++
                                setLoadingProgress((counter / 60) * 100)

                                // When we reach 60 seconds, clear the interval and show success
                                if (counter >= 60) {
                                  clearInterval(timer)
                                  setIsLoading(false)
                                  setPickupStarted(true)
                                }
                              }, 1000)
                            }}
                          >
                            Start Pickup Process
                          </Button>
                        ) : isLoading ? (
                          <div className="space-y-4">
                            <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
                              <div className="flex flex-col items-center">
                                <p className="font-medium text-blue-800 mb-2">Notifying warehouse...</p>
                                <div className="w-full bg-blue-100 rounded-full h-2.5 mb-1">
                                  <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-linear"
                                    style={{ width: `${loadingProgress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-blue-600 mt-1">
                                  {Math.max(0, 60 - Math.floor(loadingProgress * 0.6))} seconds remaining
                                </p>
                              </div>
                            </div>
                            <Button
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                              onClick={() => {
                                setIsLoading(false)
                                setPickupStarted(false)
                                setLoadingProgress(0)
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                              <div className="flex items-center">
                                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-green-800">I am on the way</p>
                                  <p className="text-sm text-green-600">
                                    Warehouse associate will have your packages ready for pickup on arrival
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Button
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800"
                              onClick={() => {
                                setPickupStarted(false)
                                setIsLoading(false)
                                setLoadingProgress(0)
                              }}
                            >
                              Cancel Pickup
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Minimal Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-56 bg-white z-50 md:hidden shadow-lg">
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <Button variant="ghost" size="sm" className="ml-auto block" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto py-2">
                {[
                  { label: "Dashboard", href: "/" },
                  { label: "Packages", href: "/packages" },
                  { label: "History", href: "/history" },
                  { label: "Warehouse", href: "/metro" },
                  { label: "Settings", href: "/settings" },
                ].map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </DesktopLayout>
  )
}
