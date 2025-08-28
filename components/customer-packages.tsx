"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Package, CheckCircle, User, Building } from "lucide-react"
import { getPackageTypeInfo, getPackageType, parseBinLocation, getWarehouseAddress } from "@/utils/warehouse-utils"
import type { Customer } from "@/types"

interface CustomerPackagesProps {
  customer: Customer
  onConfirm: () => void
  barcode?: string // Add barcode property
}

export default function CustomerPackages({ customer, onConfirm, barcode = "" }: CustomerPackagesProps) {
  // Track which packages have been located
  const [locatedPackages, setLocatedPackages] = useState<Record<string, boolean>>({})

  // Check if all packages are located
  const allLocated = useMemo(() => {
    return customer.packages.every((pkg) => locatedPackages[pkg.id])
  }, [locatedPackages, customer.packages])

  // Handle marking a package as located
  const handleLocatePackage = (id: string) => {
    setLocatedPackages((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the located status
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Package Details</h2>
        <p className="text-gray-500 text-sm">Locate each package and tap to mark as found</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer</p>
          </div>
          <p className="text-gray-700 pl-6">{customer.name}</p>
          {barcode && (
            <div className="mt-2 pl-6 pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-500">METRO ID:</p>
              <p className="font-mono text-gray-800 px-3 py-2 mt-1 text-4xl font-bold overflow-x-auto">{barcode}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-1">
            <Building className="h-4 w-4 text-gray-400" />
            <p className="font-medium">Customer Hub Location</p>
          </div>
          <div className="pl-6">
            <p className="text-gray-700 font-medium">{customer.location}</p>
            <p className="text-gray-500 text-sm mt-1">{getWarehouseAddress(customer.location)}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500">Packages</p>
          <p className="text-sm font-medium">
            {Object.values(locatedPackages).filter(Boolean).length} of {customer.packages.length} located
          </p>
        </div>

        {customer.packages.length > 0 ? (
          <div className="space-y-2">
            {customer.packages.map((pkg, index) => {
              const isLocated = locatedPackages[pkg.id]
              const packageType = getPackageType(pkg.id)
              const { icon, color } = getPackageTypeInfo(packageType)

              return (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-xl transition-colors duration-200 cursor-pointer ${
                    isLocated ? "bg-green-50 border border-green-200" : "bg-gray-50"
                  }`}
                  onClick={() => handleLocatePackage(pkg.id)}
                >
                  <div className="flex items-start mb-3">
                    {isLocated ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium truncate">{pkg.id}</p>
                      {isLocated && <p className="text-xs text-green-600">Package located</p>}
                    </div>
                  </div>

                  <div className="bg-gray-100 p-5 pt-10 pb-14 rounded-xl relative">
                    {/* Package Type Indicator */}
                    <div className="absolute top-3 right-3 flex flex-col gap-1">
                      <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border ${color}`}
                      >
                        {icon}
                        <span className="uppercase">{packageType}</span>
                      </div>
                    </div>

                    {/* Package Type Legend (at bottom) */}
                    <div className="absolute bottom-3 right-3 flex gap-2 mt-4 pt-2">
                      {["fragile", "fridge", "urgent", "standard"].map((type) => {
                        const { icon, color } = getPackageTypeInfo(type as any)
                        const isActive = type === packageType

                        return (
                          <div
                            key={type}
                            className={`flex items-center justify-center w-7 h-7 rounded-full border ${isActive ? color : "text-gray-300 bg-gray-50 border-gray-200"}`}
                            title={type.toUpperCase()}
                          >
                            {icon}
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-gray-700 font-medium mb-4">Storage Information</p>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-5 gap-4 mb-3">
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600">AREA</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600">ROW</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600">BAY</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600">LEVEL</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-gray-600">BIN</p>
                        </div>
                      </div>

                      {(() => {
                        const location = parseBinLocation(pkg.bin)
                        return (
                          <div className="grid grid-cols-5 gap-4 items-center">
                            <div className="text-center">
                              <p className="text-3xl font-bold">{location.area}</p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                              <p className="text-3xl font-bold">{location.row}</p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                              <p className="text-3xl font-bold">{location.bay}</p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                              <p className="text-3xl font-bold">{location.level}</p>
                            </div>
                            <div className="text-center flex items-center justify-center">
                              <span className="text-xl font-bold text-gray-400 mr-1">-</span>
                              <p className="text-3xl font-bold">{location.bin}</p>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No packages found</p>
        )}
      </div>

      <div className="space-y-2">
        {!allLocated && (
          <p className="text-sm text-amber-600 text-center">Please locate all packages before proceeding</p>
        )}

        <Button
          className={`w-full h-12 rounded-xl ${
            allLocated ? "bg-black hover:bg-gray-800 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={onConfirm}
          disabled={!allLocated}
        >
          Confirm Pickup
        </Button>
      </div>
    </div>
  )
}
