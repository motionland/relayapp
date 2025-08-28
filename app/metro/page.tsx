"use client"
import { Button } from "@/components/ui/button"
import { Building, Package, Truck } from "lucide-react"
import MobileFooter from "@/components/mobile-footer"
import ScannerHeader from "@/components/scanner-header"

export default function MetroPage() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto">
        {/* Scanner Header */}
        <ScannerHeader />

        <div className="px-4 pt-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-1">Warehouse</h2>
              <p className="text-gray-500 text-sm">Manage your metro warehouse operations</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <Building className="h-5 w-5 text-gray-500" />
                <h3 className="font-medium">Metro Warehouse A01</h3>
              </div>
              <p className="text-gray-500 text-sm mb-4 pl-8">123 Distribution Center Rd, Industrial Park, CA 94103</p>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Pickups</span>
                  </div>
                  <p className="text-2xl font-bold pl-6">1,245</p>
                  <p className="text-xs text-green-500 pl-6">+12 today</p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">Deliveries</span>
                  </div>
                  <p className="text-2xl font-bold pl-6">28</p>
                  <p className="text-xs text-amber-500 pl-6">3 pending</p>
                </div>
              </div>
            </div>

            <Button className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl">View Warehouse Map</Button>
          </div>
        </div>
      </div>

      {/* Mobile Footer Navigation */}
      <MobileFooter />
    </div>
  )
}
