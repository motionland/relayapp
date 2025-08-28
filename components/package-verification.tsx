"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Package, CheckCircle, AlertCircle, Loader2, Camera } from "lucide-react"
import type { Customer } from "@/types"
import RealtimeScanner from "./realtime-scanner"

interface PackageVerificationProps {
  customer: Customer
  onComplete: () => void
  onBack: () => void
}

export default function PackageVerification({ customer, onComplete, onBack }: PackageVerificationProps) {
  const [verifiedPackages, setVerifiedPackages] = useState<Record<string, boolean>>({})
  const [showScanner, setShowScanner] = useState(false)
  const [currentScanTarget, setCurrentScanTarget] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanError, setScanError] = useState<string | null>(null)

  // Initialize verification status for all packages
  useEffect(() => {
    const initialStatus: Record<string, boolean> = {}
    customer.packages.forEach((pkg) => {
      initialStatus[pkg.id] = false
    })
    setVerifiedPackages(initialStatus)
  }, [customer.packages])

  // Check if all packages are verified
  const allVerified = Object.values(verifiedPackages).every(Boolean) && Object.keys(verifiedPackages).length > 0

  // Handle barcode detection
  const handleBarcodeDetected = (barcode: string) => {
    setIsScanning(false)

    // Check if the scanned barcode matches any package ID
    const matchedPackage = customer.packages.find((pkg) => pkg.id === barcode)

    if (matchedPackage) {
      // Mark the package as verified
      setVerifiedPackages((prev) => ({
        ...prev,
        [barcode]: true,
      }))
      setShowScanner(false)
      setCurrentScanTarget(null)
      setScanError(null)
    } else {
      // Show error if barcode doesn't match any package
      setScanError(`Barcode "${barcode}" does not match any package for this customer`)
      setTimeout(() => setScanError(null), 3000)
    }
  }

  // Start scanning a specific package
  const startScanningPackage = (packageId: string) => {
    setCurrentScanTarget(packageId)
    setShowScanner(true)
    setIsScanning(true)
    setScanError(null)
  }

  // Demo function to verify all packages (for testing)
  const verifyAllPackagesDemo = () => {
    const allVerified: Record<string, boolean> = {}
    customer.packages.forEach((pkg) => {
      allVerified[pkg.id] = true
    })
    setVerifiedPackages(allVerified)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Verify Package Barcodes</h2>
        <p className="text-gray-500 text-sm">Scan each package barcode to verify before handoff</p>
      </div>

      {showScanner ? (
        <Card className="overflow-hidden">
          <div className="bg-black text-white p-3 text-sm flex items-center gap-2">
            <Camera className="h-4 w-4" />
            <span>Scan Metro barcode on package: {currentScanTarget}</span>
          </div>

          <div className="relative">
            <RealtimeScanner onDetected={handleBarcodeDetected} />

            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                <div className="bg-white p-3 rounded-lg shadow-lg flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                  <span>Position barcode in frame...</span>
                </div>
              </div>
            )}

            {scanError && (
              <div className="absolute bottom-4 left-0 right-0 mx-auto w-5/6 bg-red-50 border border-red-200 p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 text-sm">{scanError}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 flex justify-between">
            <Button variant="outline" onClick={() => setShowScanner(false)}>
              Cancel Scan
            </Button>

            {/* Demo button to simulate successful scan */}
            <Button
              onClick={() => {
                if (currentScanTarget) {
                  handleBarcodeDetected(currentScanTarget)
                }
              }}
            >
              Demo: Simulate Scan
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Security Verification Required</p>
                <p className="text-sm text-amber-700 mt-1">
                  For security purposes, all package barcodes must be scanned before handoff to the customer.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">Packages to Verify</p>
              <p className="text-sm font-medium">
                {Object.values(verifiedPackages).filter(Boolean).length} of {customer.packages.length} verified
              </p>
            </div>

            <div className="space-y-2">
              {customer.packages.map((pkg) => {
                const isVerified = verifiedPackages[pkg.id] || false

                return (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-xl transition-colors duration-200 ${
                      isVerified ? "bg-green-50 border border-green-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {isVerified ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                        ) : (
                          <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <p className="font-medium truncate">{pkg.id}</p>
                          <p className="text-xs mt-0.5">
                            {isVerified ? (
                              <span className="text-green-600">Verified</span>
                            ) : (
                              <span className="text-gray-500">Pending verification</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {!isVerified && (
                        <Button
                          size="sm"
                          onClick={() => startScanningPackage(pkg.id)}
                          className="bg-black hover:bg-gray-800 text-white"
                        >
                          Scan
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-2 pt-4">
            {!allVerified && (
              <p className="text-sm text-amber-600 text-center">Please verify all packages before proceeding</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl" onClick={onBack}>
                Back
              </Button>

              <Button
                className={`h-12 rounded-xl ${
                  allVerified ? "bg-black hover:bg-gray-800 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={onComplete}
                disabled={!allVerified}
              >
                Complete Verification
              </Button>
            </div>

            {/* Demo button to verify all packages at once (for testing) */}
            <Button
              variant="outline"
              className="w-full mt-2 text-gray-500 border-dashed border-gray-300"
              onClick={verifyAllPackagesDemo}
            >
              Demo: Verify All Packages
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
