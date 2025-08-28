"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Customer } from "@/types"

interface WarehouseContextType {
  step: number
  setStep: (step: number) => void
  customerBarcode: string
  setCustomerBarcode: (barcode: string) => void
  scanMode: "pickup" | "receiving"
  setScanMode: (mode: "pickup" | "receiving") => void
  customer: Customer
  setCustomer: (customer: Customer) => void
  signatureCaptured: boolean
  setSignatureCaptured: (captured: boolean) => void
  warehouseCapacity: number
  setWarehouseCapacity: (capacity: number) => void
  fetchCustomerPackages: () => void
  handleBarcodeDetected: (barcode: string) => void
  confirmHandover: () => void
  completeVerification: () => void
  updateWarehouse: () => void
  resetWorkflow: () => void
  backToPackageDetails: () => void
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined)

export function WarehouseProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1)
  const [customerBarcode, setCustomerBarcode] = useState("")
  const [scanMode, setScanMode] = useState<"pickup" | "receiving">("pickup")
  const [customer, setCustomer] = useState<Customer>({ name: "", location: "", packages: [] })
  const [signatureCaptured, setSignatureCaptured] = useState(false)
  const [warehouseCapacity, setWarehouseCapacity] = useState(10)

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

  const handleBarcodeDetected = useCallback(
    (barcode: string) => {
      setCustomerBarcode(barcode)
      fetchCustomerPackages()
    },
    [fetchCustomerPackages],
  )

  const confirmHandover = useCallback(() => {
    // Changed to go to verification step instead of signature
    setStep(3)
  }, [])

  const completeVerification = useCallback(() => {
    // Go to signature step after verification
    setStep(4)
  }, [])

  const updateWarehouse = useCallback(() => {
    // Simulating warehouse update
    setWarehouseCapacity((prev) => prev + customer.packages.length)
    setCustomer((prev) => ({ ...prev, packages: [] }))
    setSignatureCaptured(false)
    setStep(5)
  }, [customer.packages.length])

  const resetWorkflow = useCallback(() => {
    setStep(1)
    setCustomerBarcode("")
    setCustomer({ name: "", location: "", packages: [] })
    setSignatureCaptured(false)
  }, [])

  const backToPackageDetails = useCallback(() => {
    setStep(2)
  }, [])

  const value = {
    step,
    setStep,
    customerBarcode,
    setCustomerBarcode,
    scanMode,
    setScanMode,
    customer,
    setCustomer,
    signatureCaptured,
    setSignatureCaptured,
    warehouseCapacity,
    setWarehouseCapacity,
    fetchCustomerPackages,
    handleBarcodeDetected,
    confirmHandover,
    completeVerification,
    updateWarehouse,
    resetWorkflow,
    backToPackageDetails,
  }

  return <WarehouseContext.Provider value={value}>{children}</WarehouseContext.Provider>
}

export function useWarehouse() {
  const context = useContext(WarehouseContext)
  if (context === undefined) {
    throw new Error("useWarehouse must be used within a WarehouseProvider")
  }
  return context
}
