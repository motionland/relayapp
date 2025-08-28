"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RealtimeScanner from "@/components/realtime-scanner"
import ReceivingView from "@/components/receiving-view"
import MobileFooter from "@/components/mobile-footer"
import SpeedReceivingMode from "@/components/speed-receiving-mode"
import { Barcode } from "lucide-react"
import type { Customer } from "@/types"
import DesktopScanner from "@/components/desktop-scanner"
import { useMobile } from "@/hooks/use-mobile"

export default function WarehousePickupApp() {
  const [step, setStep] = useState(1)
  const [customerBarcode, setCustomerBarcode] = useState("")
  const [currentMode, setCurrentMode] = useState<"pickup" | "receiving" | "speed">("pickup")
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    location: "",
    packages: [],
  })
  const [signatureCaptured, setSignatureCaptured] = useState(false)
  const [warehouseCapacity, setWarehouseCapacity] = useState(10)
  const isMobile = useMobile()

  useEffect(() => {
    if (isMobile) {
      setStep(1)
      setCustomerBarcode("")
      setCustomer({ name: "", location: "", packages: [] })
      setSignatureCaptured(false)
    }
  }, [isMobile])

  // Memoize the fetchCustomerPackages function to prevent unnecessary re-creation
  const fetchCustomerPackages = useCallback(() => {
    // Mocking a customer scan response
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

  // Memoize the handleBarcodeDetected function
  const handleBarcodeDetected = useCallback(
    (barcode: string) => {
      setCustomerBarcode(barcode)
      fetchCustomerPackages()
    },
    [fetchCustomerPackages],
  )

  // Memoize the handleModeChange function
  const handleModeChange = useCallback(
    (mode: "pickup" | "receiving" | "speed") => {
      setCurrentMode(mode)
      // Reset workflow when changing modes
      if (step !== 1) {
        setStep(1)
        setCustomerBarcode("")
        setCustomer({ name: "", location: "", packages: [] })
        setSignatureCaptured(false)
      }
    },
    [step],
  )

  // For desktop, just render the DesktopScanner component directly without DesktopLayout
  // since DesktopScanner already handles its own layout
  if (!isMobile) {
    return <DesktopScanner />
  }

  // Mobile view
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto">
        {currentMode === "pickup" && (
          <div className="mb-4">
            <RealtimeScanner onDetected={handleBarcodeDetected} />

            <div className="bg-white rounded-t-xl -mt-4 relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center">
                  <h2 className="text-lg font-bold">Scan Customer</h2>
                  <div className="ml-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div>
                  <h2 className="text-xl font-medium mb-1">Scan Customer Barcode</h2>
                  <p className="text-gray-500 text-sm">Position barcode within the frame or enter ID manually</p>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter Customer ID or scan barcode"
                      value={customerBarcode}
                      onChange={(e) => {
                        setCustomerBarcode(e.target.value)
                        // Auto-submit if input looks like a barcode scan (typically ends with Enter)
                        if (e.target.value.length > 10) {
                          setTimeout(() => {
                            fetchCustomerPackages()
                          }, 300)
                        }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && customerBarcode && fetchCustomerPackages()}
                      className="border-0 bg-gray-50 h-12 pl-4 pr-10 rounded-xl"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Barcode className="h-5 w-5" />
                    </div>

                    {/* Dropdown search results */}
                    {customerBarcode && customerBarcode.length > 1 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {["MRC10927XYZ", "MRC22845ABC", "MRC38291DEF", "MRC47362GHI", "MRC56473JKL", "MRC65584MNO"]
                          .filter((id) => id.toLowerCase().includes(customerBarcode.toLowerCase()))
                          .map((id, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                              onClick={() => {
                                setCustomerBarcode(id)
                                fetchCustomerPackages()
                              }}
                            >
                              <Barcode className="h-4 w-4 text-gray-500" />
                              <span>{id}</span>
                            </div>
                          ))}
                        {![
                          "MRC10927XYZ",
                          "MRC22845ABC",
                          "MRC38291DEF",
                          "MRC47362GHI",
                          "MRC56473JKL",
                          "MRC65584MNO",
                        ].some((id) => id.toLowerCase().includes(customerBarcode.toLowerCase())) && (
                          <div className="px-4 py-2 text-gray-500">No matching customer IDs found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
                    onClick={() => handleBarcodeDetected("CUST-20250327-12345")}
                  >
                    Process Scan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentMode === "receiving" && <ReceivingView />}
        {currentMode === "speed" && <SpeedReceivingMode />}

        <MobileFooter currentMode={currentMode} onModeChange={handleModeChange} />
      </div>
    </div>
  )
}
