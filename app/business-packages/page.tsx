"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowUpDown,
  MoreHorizontal,
  Search,
  Eye,
  Clock,
  MapPin,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import DesktopSidebar from "@/components/desktop-sidebar"

// Mock data for business packages
const businessPackages = [
  {
    id: "pkg-001",
    carrier: {
      name: "FedEx",
      logo: "/images/fedex-logo.png",
    },
    trackingNumber: "TRK12345678",
    dateReceived: "2023-11-15",
    datePickedUp: "2023-11-18",
    status: "picked-up",
    stage: "pickup", // processing, ready, pickup
    availableUntil: "2023-11-20T14:00:00",
    hubLocation: "Seattle Hub",
    images: ["/package-icon.png", "/generic-label.png"],
    value: 245.99,
  },
  {
    id: "pkg-002",
    carrier: {
      name: "UPS",
      logo: "/placeholder.svg?height=32&width=32&text=UPS",
    },
    trackingNumber: "TRK23456789",
    dateReceived: "2023-11-20",
    datePickedUp: null,
    status: "ready-for-pickup",
    stage: "ready",
    availableUntil: "2023-12-05T14:00:00",
    hubLocation: "Portland Hub",
    images: ["/package-icon.png"],
    value: 129.5,
  },
  {
    id: "pkg-003",
    carrier: {
      name: "Amazon",
      logo: "/images/amazon-logo.png",
    },
    trackingNumber: "TRK34567890",
    dateReceived: "2023-11-22",
    datePickedUp: null,
    status: "arrived-damaged",
    stage: "processing",
    availableUntil: null,
    hubLocation: "Seattle Hub",
    images: ["/package-icon.png", "/generic-label.png"],
    value: 89.99,
  },
  {
    id: "pkg-004",
    carrier: {
      name: "USPS",
      logo: "/images/usps-logo.png",
    },
    trackingNumber: "TRK45678901",
    dateReceived: "2023-11-25",
    datePickedUp: "2023-11-27",
    status: "picked-up",
    stage: "pickup",
    availableUntil: null,
    hubLocation: "Tacoma Hub",
    images: ["/package-icon.png"],
    value: 75.25,
  },
  {
    id: "pkg-005",
    carrier: {
      name: "DHL",
      logo: "/placeholder.svg?height=32&width=32&text=DHL",
    },
    trackingNumber: "TRK56789012",
    dateReceived: "2023-11-28",
    datePickedUp: null,
    status: "ready-for-pickup",
    stage: "ready",
    availableUntil: "2023-12-10T14:00:00",
    hubLocation: "Bellevue Hub",
    images: ["/package-icon.png", "/generic-label.png"],
    value: 199.99,
  },
  {
    id: "pkg-006",
    carrier: {
      name: "FedEx",
      logo: "/images/fedex-logo.png",
    },
    trackingNumber: "TRK67890123",
    dateReceived: "2023-12-01",
    datePickedUp: "2023-12-03",
    status: "picked-up",
    stage: "pickup",
    availableUntil: null,
    hubLocation: "Seattle Hub",
    images: ["/package-icon.png"],
    value: 320.75,
  },
  {
    id: "pkg-007",
    carrier: {
      name: "Amazon",
      logo: "/images/amazon-logo.png",
    },
    trackingNumber: "TRK78901234",
    dateReceived: "2023-12-05",
    datePickedUp: null,
    status: "ready-for-pickup",
    stage: "ready",
    availableUntil: "2023-12-15T14:00:00",
    hubLocation: "Redmond Hub",
    images: ["/package-icon.png", "/generic-label.png"],
    value: 149.99,
  },
  {
    id: "pkg-008",
    carrier: {
      name: "UPS",
      logo: "/placeholder.svg?height=32&width=32&text=UPS",
    },
    trackingNumber: "TRK89012345",
    dateReceived: "2023-12-08",
    datePickedUp: null,
    status: "processing",
    stage: "processing",
    availableUntil: null,
    hubLocation: "Everett Hub",
    images: ["/package-icon.png"],
    value: 59.99,
  },
  {
    id: "pkg-009",
    carrier: {
      name: "USPS",
      logo: "/images/usps-logo.png",
    },
    trackingNumber: "TRK90123456",
    dateReceived: "2023-12-10",
    datePickedUp: "2023-12-12",
    status: "picked-up",
    stage: "pickup",
    availableUntil: null,
    hubLocation: "Seattle Hub",
    images: ["/package-icon.png", "/generic-label.png"],
    value: 42.5,
  },
  {
    id: "pkg-010",
    carrier: {
      name: "DHL",
      logo: "/placeholder.svg?height=32&width=32&text=DHL",
    },
    trackingNumber: "TRK01234567",
    dateReceived: "2023-12-15",
    datePickedUp: null,
    status: "arrived-damaged",
    stage: "processing",
    availableUntil: null,
    hubLocation: "Tacoma Hub",
    images: ["/package-icon.png"],
    value: 189.99,
  },
]

export default function BusinessPackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "ascending" | "descending"
  } | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Format date function
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Format time function
  const formatAvailableUntil = (dateString: string | null) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return `Available until ${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}: ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  // Filter packages based on search query and active tab
  const filteredPackages = businessPackages.filter((pkg) => {
    // First filter by search query
    const matchesSearch =
      pkg.carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.hubLocation.toLowerCase().includes(searchQuery.toLowerCase())

    // Then filter by active tab
    if (activeTab === "all") {
      return matchesSearch
    } else if (activeTab === "ready-for-pickup") {
      return matchesSearch && pkg.status === "ready-for-pickup"
    } else if (activeTab === "picked-up") {
      return matchesSearch && pkg.status === "picked-up"
    } else if (activeTab === "arrived-damaged") {
      return matchesSearch && pkg.status === "arrived-damaged"
    }

    return matchesSearch
  })

  // Get counts for each status
  const statusCounts = {
    all: businessPackages.length,
    "ready-for-pickup": businessPackages.filter((pkg) => pkg.status === "ready-for-pickup").length,
    "picked-up": businessPackages.filter((pkg) => pkg.status === "picked-up").length,
    "arrived-damaged": businessPackages.filter((pkg) => pkg.status === "arrived-damaged").length,
  }

  // Calculate total value of packages
  const totalValue = businessPackages.reduce((sum, pkg) => sum + pkg.value, 0)

  // Calculate average package value
  const avgValue = totalValue / businessPackages.length

  // Sort packages based on sort config
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (!sortConfig) return 0

    let aValue, bValue

    // Handle nested properties
    if (sortConfig.key === "carrier") {
      aValue = a.carrier.name
      bValue = b.carrier.name
    } else {
      aValue = a[sortConfig.key as keyof typeof a]
      bValue = b[sortConfig.key as keyof typeof b]
    }

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready-for-pickup":
        return <Badge className="bg-blue-500">Ready for Pickup</Badge>
      case "picked-up":
        return <Badge className="bg-green-500">Picked Up</Badge>
      case "arrived-damaged":
        return <Badge className="bg-red-500">Arrived Damaged</Badge>
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  // Render multi-stage progress bar
  const renderProgressBar = (stage: string, availableUntil: string | null) => {
    const stages = ["processing", "ready", "pickup"]
    const currentStageIndex = stages.indexOf(stage)

    return (
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Processing</span>
          <span>Ready</span>
          <span>Pickup</span>
        </div>
        <div className="relative h-2 flex">
          {/* Processing to Ready */}
          <div
            className={`h-full w-1/2 rounded-l-full ${currentStageIndex >= 0 ? "bg-green-500" : "bg-gray-200"}`}
          ></div>

          {/* Ready to Pickup */}
          <div
            className={`h-full w-1/2 rounded-r-full ${currentStageIndex >= 2 ? "bg-green-500" : currentStageIndex >= 1 ? "bg-green-500" : "bg-gray-200"}`}
          ></div>

          {/* Stage Indicators */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ${currentStageIndex >= 1 ? "bg-green-500" : "bg-gray-300"}`}
          ></div>
          <div
            className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white ${currentStageIndex >= 2 ? "bg-green-500" : "bg-gray-300"}`}
          ></div>
        </div>
        {availableUntil && <div className="text-xs text-gray-500 mt-1">{formatAvailableUntil(availableUntil)}</div>}
      </div>
    )
  }

  return (
    <div className="flex">
      <DesktopSidebar />
      <div className="flex-1 min-h-screen">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Business Packages</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border rounded-lg p-6 bg-white">
              <div className="text-gray-500 text-sm">Packages</div>
              <div className="text-4xl font-bold mt-1">{businessPackages.length}</div>
              <div className="text-green-500 flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                +6.5% from last month
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <div className="text-gray-500 text-sm">Arrived Damaged</div>
              <div className="text-4xl font-bold mt-1">
                {businessPackages.reduce((sum, pkg) => sum + pkg.images.length, 0)}
              </div>
              <div className="text-red-500 flex items-center mt-2">
                <TrendingDown className="h-4 w-4 mr-1" />
                -0.5% from last month
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-white">
              <div className="text-gray-500 text-sm">Picked up</div>
              <div className="text-4xl font-bold mt-1">200</div>
              <div className="text-green-500 flex items-center mt-2">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.5% from last month
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("all")}
                className={cn(
                  "pb-2 px-1 text-sm font-medium relative",
                  activeTab === "all"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                All{" "}
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {statusCounts.all}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("ready-for-pickup")}
                className={cn(
                  "pb-2 px-1 text-sm font-medium relative",
                  activeTab === "ready-for-pickup"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Ready for Pickup{" "}
                <span className="ml-1 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {statusCounts["ready-for-pickup"]}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("picked-up")}
                className={cn(
                  "pb-2 px-1 text-sm font-medium relative",
                  activeTab === "picked-up"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Picked Up{" "}
                <span className="ml-1 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  {statusCounts["picked-up"]}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("arrived-damaged")}
                className={cn(
                  "pb-2 px-1 text-sm font-medium relative",
                  activeTab === "arrived-damaged"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Arrived Damaged{" "}
                <span className="ml-1 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {statusCounts["arrived-damaged"]}
                </span>
              </button>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by carrier, tracking number, or hub..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("carrier")}>
                      CARRIER
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("trackingNumber")}>
                      TRACKING
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("dateReceived")}>
                      DATE RECEIVED
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64"
                  >
                    PROGRESS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("status")}>
                      STATUS
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center cursor-pointer" onClick={() => requestSort("hubLocation")}>
                      HUB LOCATION
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    IMAGES
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPackages.length > 0 ? (
                  sortedPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            <Image
                              src={
                                pkg.carrier.name === "FedEx"
                                  ? "/images/fedex-logo.png"
                                  : pkg.carrier.name === "UPS"
                                    ? "/placeholder.svg?height=40&width=40&text=UPS"
                                    : pkg.carrier.name === "Amazon"
                                      ? "/images/amazon-logo.png"
                                      : pkg.carrier.name === "USPS"
                                        ? "/images/usps-logo.png"
                                        : pkg.carrier.name === "DHL"
                                          ? "/placeholder.svg?height=40&width=40&text=DHL"
                                          : pkg.carrier.logo || "/placeholder.svg?height=40&width=40&text=Logo"
                              }
                              alt={pkg.carrier.name}
                              width={40}
                              height={40}
                              className="rounded-md object-contain"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{pkg.carrier.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pkg.trackingNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="mr-1 h-4 w-4 text-gray-400" />
                          {formatDate(pkg.dateReceived)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderProgressBar(pkg.stage, pkg.availableUntil)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(pkg.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                          {pkg.hubLocation}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex -space-x-2">
                          {pkg.images.map((img, index) => (
                            <div key={index} className="h-8 w-8 rounded-md border border-white">
                              <Image
                                src={img || "/placeholder.svg"}
                                alt={`Package image ${index + 1}`}
                                width={32}
                                height={32}
                                className="rounded-md object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Package Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>View Timeline</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                      No packages found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
