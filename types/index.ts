// Common types used across the application
export type PackageType = "fragile" | "fridge" | "urgent" | "standard" | "special"

export interface Package {
  id: string
  bin: string
  storageArea?: string
  storageRow?: string
  storageBay?: string
  storageLevel?: string
  storageBin?: string
  storageType?: PackageType
}

export interface Customer {
  name: string
  location: string
  address?: string
  packages: Package[]
}

export interface ScannedItem {
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
  storageType?: PackageType
}

export interface PickupHistoryItem {
  id: string
  timestamp: string
  customer: string
  location: string
  packages: Package[]
  status: "completed" | "in-progress"
}

export interface RecentScanItem {
  id: string
  timestamp: string
  supplier: string
  location: string
  items: number
  status: "completed" | "pending"
}
