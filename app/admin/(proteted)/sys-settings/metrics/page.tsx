"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  RefreshCw,
  Monitor,
  Cpu,
  HardDrive,
  Clock,
  Database,
  Server,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react"

interface SystemMetrics {
  memory: {
    used: number
    total: number
    percentage: number
  }
  cpu: {
    usage: number
    cores: number
  }
  storage: {
    used: number
    total: number
    percentage: number
  }
  uptime: {
    days: number
    hours: number
    minutes: number
    status: "healthy" | "warning" | "critical"
  }
  system: {
    platform: string
    appVersion: string
    nodeVersion: string
    cpuModel: string
    appMemory: number
    appMemoryStatus: "normal" | "warning" | "critical"
  }
  database: {
    activeConnections: number
    size: number
    tables: number
  }
  performance: {
    avgResponseTime: number
    requestsPerMinute: number
    errorRate: number
  }
}

export default function SystemMetricsPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data - in real app this would come from API
  const [metrics] = useState<SystemMetrics>({
    memory: {
      used: 15.92,
      total: 16,
      percentage: 99.5,
    },
    cpu: {
      usage: 52.4,
      cores: 8,
    },
    storage: {
      used: 2.5,
      total: 10,
      percentage: 25.0,
    },
    uptime: {
      days: 6,
      hours: 18,
      minutes: 2,
      status: "healthy",
    },
    system: {
      platform: "Darwin 24.5.0",
      appVersion: "0.1.0",
      nodeVersion: "v23.10.0",
      cpuModel: "Apple M3",
      appMemory: 366.31,
      appMemoryStatus: "critical",
    },
    database: {
      activeConnections: 4,
      size: 50,
      tables: 15,
    },
    performance: {
      avgResponseTime: 156,
      requestsPerMinute: 116,
      errorRate: 1.87,
    },
  })

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastUpdated(new Date())
    setIsRefreshing(false)
  }

  const formatUptime = (days: number, hours: number, minutes: number) => {
    return `${days}d ${hours}h ${minutes}m`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "normal":
        return "text-green-600 dark:text-green-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "critical":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getPerformanceStatus = (value: number, type: "response" | "requests" | "error") => {
    switch (type) {
      case "response":
        if (value < 200) return { status: "Excellent", color: "text-green-600 dark:text-green-400" }
        if (value < 500) return { status: "Good", color: "text-yellow-600 dark:text-yellow-400" }
        return { status: "Poor", color: "text-red-600 dark:text-red-400" }
      case "requests":
        if (value > 100) return { status: "Active", color: "text-green-600 dark:text-green-400" }
        if (value > 50) return { status: "Moderate", color: "text-yellow-600 dark:text-yellow-400" }
        return { status: "Low", color: "text-red-600 dark:text-red-400" }
      case "error":
        if (value < 1) return { status: "Excellent", color: "text-green-600 dark:text-green-400" }
        if (value < 5) return { status: "Needs Attention", color: "text-yellow-600 dark:text-yellow-400" }
        return { status: "Critical", color: "text-red-600 dark:text-red-400" }
      default:
        return { status: "Unknown", color: "text-gray-600 dark:text-gray-400" }
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Metrics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your application's performance and resource usage
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Memory Usage */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</CardTitle>
            <Monitor className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metrics.memory.percentage}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {metrics.memory.used} GB of {metrics.memory.total} GB
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.memory.percentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* CPU Usage */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metrics.cpu.usage}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{metrics.cpu.cores} cores available</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.cpu.usage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Usage */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metrics.storage.percentage}%</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {metrics.storage.used} GB of {metrics.storage.total} GB
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${metrics.storage.percentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Uptime */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {formatUptime(metrics.uptime.days, metrics.uptime.hours, metrics.uptime.minutes)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">System running smoothly</p>
            <div className="flex items-center">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Healthy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information and Database Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* System Information */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <Server className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  System Information
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Server and runtime details</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Platform</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{metrics.system.platform}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Node.js Version</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{metrics.system.nodeVersion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">App Version</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{metrics.system.appVersion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">CPU Model</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{metrics.system.cpuModel}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">App Memory Usage</p>
                <Badge variant="destructive" className="text-xs px-2 py-1">
                  Critical
                </Badge>
              </div>
              <p className="text-sm text-gray-900 dark:text-white font-mono">{metrics.system.appMemory} MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Database Metrics */}
        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Database Metrics</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Database performance and usage</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Active Connections</p>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white mr-3">
                    {metrics.database.activeConnections}
                  </span>
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    Active
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Database Size</p>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.database.size} MB</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tables</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">total tables</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.database.tables}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Application performance indicators</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 py-4">
            {/* Average Response Time */}
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {metrics.performance.avgResponseTime}ms
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Average Response Time</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Excellent</span>
              </div>
            </div>

            {/* Requests per Minute */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {metrics.performance.requestsPerMinute}
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Requests per Minute</p>
              <div className="flex items-center justify-center">
                <Activity className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
              </div>
            </div>

            {/* Error Rate */}
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">
                {metrics.performance.errorRate}%
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Error Rate</p>
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Needs Attention</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
