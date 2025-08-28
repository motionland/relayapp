"use client"

import { useState } from "react"
import {
  Search,
  Users,
  Package,
  Building,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample data
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Packages",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Warehouses",
      value: "24",
      change: "+2",
      trend: "up",
      icon: <Building className="h-4 w-4" />,
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+15%",
      trend: "up",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ]

  const recentPackages = [
    {
      id: "PKG-001",
      customer: "John Doe",
      warehouse: "Warehouse A",
      status: "delivered",
      date: "2025-01-27",
      value: "$125.00",
    },
    {
      id: "PKG-002",
      customer: "Jane Smith",
      warehouse: "Warehouse B",
      status: "in-transit",
      date: "2025-01-27",
      value: "$89.50",
    },
    {
      id: "PKG-003",
      customer: "Bob Johnson",
      warehouse: "Warehouse A",
      status: "pending",
      date: "2025-01-26",
      value: "$234.75",
    },
    {
      id: "PKG-004",
      customer: "Alice Brown",
      warehouse: "Warehouse C",
      status: "delivered",
      date: "2025-01-26",
      value: "$67.25",
    },
    {
      id: "PKG-005",
      customer: "Charlie Wilson",
      warehouse: "Warehouse B",
      status: "failed",
      date: "2025-01-25",
      value: "$156.00",
    },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Warehouse A is at 95% capacity",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "error",
      message: "System maintenance required for Warehouse C",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "info",
      message: "New carrier integration available",
      time: "1 day ago",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-700 border-0">Delivered</Badge>
      case "in-transit":
        return <Badge className="bg-blue-100 text-blue-700 border-0">In Transit</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-0">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-700 border-0">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, manage your warehouse operations</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search packages, users..."
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">Generate Report</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="dark:bg-gray-950 dark:border-gray-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
                <div className="text-gray-400">{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Packages */}
          <div className="lg:col-span-2">
            <Card className="dark:bg-gray-950 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Packages</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Latest package activities across all warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="dark:border-gray-800">
                      <TableHead className="dark:text-gray-400">Package ID</TableHead>
                      <TableHead className="dark:text-gray-400">Customer</TableHead>
                      <TableHead className="dark:text-gray-400">Warehouse</TableHead>
                      <TableHead className="dark:text-gray-400">Status</TableHead>
                      <TableHead className="dark:text-gray-400">Value</TableHead>
                      <TableHead className="dark:text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPackages.map((pkg) => (
                      <TableRow key={pkg.id} className="dark:border-gray-800">
                        <TableCell className="font-medium dark:text-white">{pkg.id}</TableCell>
                        <TableCell className="dark:text-gray-300">{pkg.customer}</TableCell>
                        <TableCell className="dark:text-gray-300">{pkg.warehouse}</TableCell>
                        <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                        <TableCell className="dark:text-gray-300">{pkg.value}</TableCell>
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
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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

          {/* System Alerts */}
          <div>
            <Card className="dark:bg-gray-950 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="dark:text-white">System Alerts</CardTitle>
                <CardDescription className="dark:text-gray-400">Important notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className="flex-shrink-0 mt-0.5">
                        {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        {alert.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {alert.type === "info" && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{alert.message}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
