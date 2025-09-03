"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Package,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Truck,
  Clock,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPackagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sample package data
  const packages = [
    {
      id: "PKG-001",
      zmpkgId: "ZMPKG-20250627-001",
      customer: "John Doe",
      customerCode: "MRC22845ABC",
      carrier: "FedEx",
      trackingNumber: "1Z999AA1234567890",
      status: "ready-for-pickup",
      packageType: "fragile",
      urgency: "same_day",
      location: "AA-BB-CC-DD-EE001",
      receivedAt: "2025-01-27 14:30",
      deadline: "2025-01-28 18:00",
      shipper: "Amazon Fulfillment",
    },
    {
      id: "PKG-002",
      zmpkgId: "ZMPKG-20250627-002",
      customer: "Jane Smith",
      customerCode: "ZMCFOX123",
      carrier: "UPS",
      trackingNumber: "1Z999BB9876543210",
      status: "in-transit",
      packageType: "standard",
      urgency: "standard",
      location: "BB-CC-DD-EE-FF002",
      receivedAt: "2025-01-27 15:45",
      deadline: "2025-01-29 17:00",
      shipper: "Best Buy",
    },
    {
      id: "PKG-003",
      zmpkgId: "ZMPKG-20250627-003",
      customer: "Mike Johnson",
      customerCode: "ZMB0000012",
      carrier: "USPS",
      trackingNumber: "9400111899562123456789",
      status: "delivered",
      packageType: "documents",
      urgency: "priority",
      location: "CC-DD-EE-FF-GG003",
      receivedAt: "2025-01-27 09:15",
      deadline: "2025-01-28 12:00",
      shipper: "Legal Services Inc",
    },
    {
      id: "PKG-004",
      zmpkgId: "ZMPKG-20250627-004",
      customer: "Sarah Wilson",
      customerCode: "MRC33456DEF",
      carrier: "DHL",
      trackingNumber: "1234567890",
      status: "pending",
      packageType: "electronics",
      urgency: "immediate",
      location: "DD-EE-FF-GG-HH004",
      receivedAt: "2025-01-27 16:20",
      deadline: "2025-01-27 20:00",
      shipper: "Tech Solutions",
    },
    {
      id: "PKG-005",
      zmpkgId: "ZMPKG-20250627-005",
      customer: "David Brown",
      customerCode: "ZMC44567GHI",
      carrier: "Amazon",
      trackingNumber: "TBA123456789000",
      status: "picked-up",
      packageType: "perishable",
      urgency: "same_day",
      location: "EE-FF-GG-HH-II005",
      receivedAt: "2025-01-27 11:30",
      deadline: "2025-01-27 18:00",
      shipper: "Fresh Foods Co",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 border-0">Delivered</Badge>
      case "ready-for-pickup":
        return <Badge className="bg-blue-100 text-blue-700 border-0">Ready for Pickup</Badge>
      case "in-transit":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">In Transit</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-0">Pending</Badge>
      case "picked-up":
        return <Badge className="bg-purple-100 text-purple-700 border-0">Picked Up</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPackageTypeBadge = (type: string) => {
    switch (type) {
      case "fragile":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-300">
            Fragile
          </Badge>
        )
      case "electronics":
        return (
          <Badge variant="outline" className="text-cyan-600 border-cyan-300">
            Electronics
          </Badge>
        )
      case "perishable":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            Perishable
          </Badge>
        )
      case "documents":
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-300">
            Documents
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-green-600 border-green-300">
            Standard
          </Badge>
        )
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "immediate":
        return <Badge className="bg-red-100 text-red-700 border-0">Immediate</Badge>
      case "same_day":
        return <Badge className="bg-orange-100 text-orange-700 border-0">Same Day</Badge>
      case "priority":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Priority</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-0">Standard</Badge>
    }
  }

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.customerCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || pkg.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Package Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage all packages in the warehouse system</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Link href="/admin/packages/create">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Package
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Packages</CardTitle>
              <Package className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{packages.length}</div>
              <p className="text-xs text-green-600">Active in system</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready for Pickup</CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {packages.filter((p) => p.status === "ready-for-pickup").length}
              </div>
              <p className="text-xs text-blue-600">Awaiting customer</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {packages.filter((p) => p.status === "in-transit").length}
              </div>
              <p className="text-xs text-yellow-600">Being processed</p>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-950 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent Packages</CardTitle>
              <MapPin className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">
                {packages.filter((p) => p.urgency === "immediate" || p.urgency === "same_day").length}
              </div>
              <p className="text-xs text-red-600">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search packages, customers, tracking numbers..."
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-transit">In Transit</SelectItem>
              <SelectItem value="ready-for-pickup">Ready for Pickup</SelectItem>
              <SelectItem value="picked-up">Picked Up</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Packages Table */}
        <Card className="dark:bg-gray-950 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">All Packages</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Complete list of packages in the warehouse system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-800">
                  <TableHead className="dark:text-gray-400">Package ID</TableHead>
                  <TableHead className="dark:text-gray-400">Customer</TableHead>
                  <TableHead className="dark:text-gray-400">Carrier</TableHead>
                  <TableHead className="dark:text-gray-400">Type</TableHead>
                  <TableHead className="dark:text-gray-400">Urgency</TableHead>
                  <TableHead className="dark:text-gray-400">Status</TableHead>
                  <TableHead className="dark:text-gray-400">Location</TableHead>
                  <TableHead className="dark:text-gray-400">Received</TableHead>
                  <TableHead className="dark:text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id} className="dark:border-gray-800">
                    <TableCell className="font-medium dark:text-white">
                      <div>
                        <p className="font-mono text-sm">{pkg.id}</p>
                        <p className="text-xs text-gray-500 font-mono">{pkg.zmpkgId}</p>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div>
                        <p className="font-medium">{pkg.customer}</p>
                        <p className="text-xs text-gray-500 font-mono">{pkg.customerCode}</p>
                      </div>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <div>
                        <p className="font-medium">{pkg.carrier}</p>
                        <p className="text-xs text-gray-500 font-mono">{pkg.trackingNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getPackageTypeBadge(pkg.packageType)}</TableCell>
                    <TableCell>{getUrgencyBadge(pkg.urgency)}</TableCell>
                    <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                    <TableCell className="dark:text-gray-300">
                      <p className="font-mono text-xs">{pkg.location}</p>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      <p className="text-sm">{new Date(pkg.receivedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">{new Date(pkg.receivedAt).toLocaleTimeString()}</p>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Package
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MapPin className="mr-2 h-4 w-4" />
                            Update Location
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Package
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
