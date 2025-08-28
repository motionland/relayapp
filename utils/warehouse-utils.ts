import type { PackageType } from "@/types"
import { AlertTriangle, Box, Clock3, Snowflake } from "lucide-react"


export const getPackageType = (id: string): PackageType => {
  
  
  const lastChar = id.charAt(id.length - 1)
  const lastDigit = Number.parseInt(lastChar)

  if (isNaN(lastDigit)) return "standard"

  if (lastDigit <= 2) return "fragile"
  if (lastDigit <= 5) return "fridge"
  if (lastDigit <= 8) return "urgent"
  return "standard"
}


export const getPackageTypeInfo = (type: PackageType | undefined) => {
  switch (type) {
    case "fragile":
      return {
        icon: AlertTriangle,
        className: "h-3.5 w-3.5",
        color: "text-amber-500 bg-amber-50 border-amber-200",
      }
    case "fridge":
      return {
        icon: Snowflake,
        className: "h-3.5 w-3.5",
        color: "text-blue-500 bg-blue-50 border-blue-200",
      }
    case "urgent":
      return {
        icon: Clock3,
        className: "h-3.5 w-3.5",
        color: "text-red-500 bg-red-50 border-red-200",
      }
    case "standard":
    default:
      return {
        icon: Box,
        className: "h-3.5 w-3.5",
        color: "text-gray-500 bg-gray-50 border-gray-200",
      }
  }
}


export const parseBinLocation = (binLocation: string) => {
  
  const parts = binLocation.split("-")
  return {
    area: parts[0]?.charAt(0) || "", 
    row: parts[1]?.substring(1) || "", 
    bay: parts[2]?.substring(1) || "", 
    level: parts[3]?.substring(1) || "", 
    bin: parts[0]?.substring(1, 2) || "A", 
  }
}


export const getWarehouseAddress = (locationCode: string) => {
  
  const warehouseAddresses: Record<string, string> = {
    "Warehouse A01": "123 Distribution Center Rd, Industrial Park, CA 94103",
    "Warehouse B02": "456 Logistics Ave, Commerce City, TX 75001",
    "Warehouse C03": "789 Supply Chain Blvd, Shipping District, NY 10001",
  }

  return warehouseAddresses[locationCode] || "1000 Warehouse Way, Storage City, ST 12345"
}


export const generateRandomPickups = (count: number) => {
  const customers = [
    "John Doe",
    "Jane Smith",
    "Robert Johnson",
    "Emily Davis",
    "Michael Brown",
    "Sarah Wilson",
    "David Miller",
    "Lisa Moore",
  ]

  const locations = ["Warehouse A01", "Warehouse B02", "Warehouse C03"]
  const statuses = ["completed", "in-progress"]
  const times = ["08:15 AM", "09:30 AM", "10:45 AM", "11:20 AM", "12:05 PM"]
  const days = ["Today", "Yesterday", "Mar 25", "Mar 24", "Mar 23"]

  const pickups = []

  for (let i = 0; i < count; i++) {
    const packageCount = Math.floor(Math.random() * 5) + 1
    const packages = []

    for (let j = 0; j < packageCount; j++) {
      const id = `P-${Math.floor(10000000 + Math.random() * 90000000)}`
      const binArea = String.fromCharCode(65 + Math.floor(Math.random() * 3)) 
      const binRow = String(Math.floor(Math.random() * 10)).padStart(2, "0")
      const binBay = String(Math.floor(Math.random() * 10)).padStart(2, "0")
      const binLevel = String(Math.floor(Math.random() * 20)).padStart(2, "0")
      const bin = `${binArea}${binRow}-R${binRow}-B${binBay}-L${binLevel}`

      packages.push({ id, bin })
    }

    const day = days[Math.floor(Math.random() * days.length)]
    const time = times[Math.floor(Math.random() * times.length)]

    pickups.push({
      id: `PU-${Math.floor(10000000 + Math.random() * 90000000)}`,
      timestamp: `${day}, ${time}`,
      customer: customers[Math.floor(Math.random() * customers.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      packages,
      status: Math.random() > 0.2 ? "completed" : "in-progress",
    })
  }

  return pickups
}


export const getColorForPickup = (pickupId: string) => {
  
  const idNumber = Number.parseInt(pickupId.replace(/\D/g, "")) || 0

  
  const colorClasses = [
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-purple-50 border-purple-200",
    "bg-pink-50 border-pink-200",
    "bg-yellow-50 border-yellow-200",
    "bg-indigo-50 border-indigo-200",
    "bg-red-50 border-red-200",
    "bg-orange-50 border-orange-200",
  ]

  
  return colorClasses[idNumber % colorClasses.length]
}


export const getTextColorForBg = (bgClass: string) => {
  if (bgClass.includes("blue")) return "text-blue-700"
  if (bgClass.includes("green")) return "text-green-700"
  if (bgClass.includes("purple")) return "text-purple-700"
  if (bgClass.includes("pink")) return "text-pink-700"
  if (bgClass.includes("yellow")) return "text-yellow-700"
  if (bgClass.includes("indigo")) return "text-indigo-700"
  if (bgClass.includes("red")) return "text-red-700"
  if (bgClass.includes("orange")) return "text-orange-700"
  return "text-gray-700"
}
