"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Camera,
  Scan,
  MapPin,
  Building2,
  X,
  CheckCircle,
  ArrowLeft,
  Package,
  ChevronUp,
  ChevronDown,
  AlertCircle,
} from "lucide-react"

type StorageType = "locker" | "bin" | null
type UserRole = "carrier" | "metro-driver" | "metro-staff"

interface PackageReceivingFormProps {
  userRole: UserRole
  onBack: () => void
}

interface ZMPKGData {
  package_id: string
  package_type: string
  package_urgency: string
  area: string
  row: string
  bay: string
  level: string
  bin_id: string
}

export default function PackageReceivingForm({ userRole, onBack }: PackageReceivingFormProps) {
  const [storageType, setStorageType] = useState<StorageType>(null)
  const [customerLookupMethod, setCustomerLookupMethod] = useState<"metro-id" | "phone" | null>(null)
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([""])
  const [formData, setFormData] = useState({
    // Customer Info
    customerCode: "",
    customerName: "",
    metroId: "",
    phoneNumber: "",

    // Package Info
    zmpkgLabelId: "",
    trackingNumber: "",
    carrier: "",
    packageType: "",
    pickupUrgency: "",
    status: "pending",

    // Storage Assignment
    storageType: "",
    lockerBarcode: "",
    binArea: "",
    binRow: "",
    binBay: "",
    binLevel: "",
    binId: "",
    hubLocation: "",

    // Additional Details
    dimensions: "",
    weight: "",
    sizeCategory: "",
    specialInstructions: "",
    scannedBy: userRole,
    receivedAt: new Date().toISOString().slice(0, 16),
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    shipperFrom: "",
    assignedTo: userRole === "metro-staff" ? "John Smith" : "",
    packageImages: [] as File[],
  });

  const [customerSearch, setCustomerSearch] = useState("")
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [showOCRCapture, setShowOCRCapture] = useState(false)
  const [showShipmentInfo, setShowShipmentInfo] = useState(false)

  const customerDatabase = [
    { code: "MRC22845ABC", name: "John Doe", phone: "(555) 123-4567" },
    { code: "ZMCFOX123", name: "Jane Smith", phone: "(555) 987-6543" },
    { code: "ZMB0000012", name: "Mike Johnson", phone: "(555) 456-7890" },
    { code: "MRC33456DEF", name: "Sarah Wilson", phone: "(555) 234-5678" },
    { code: "ZMC44567GHI", name: "David Brown", phone: "(555) 345-6789" },
    { code: "MRC55678JKL", name: "Lisa Garcia", phone: "(555) 456-7890" },
  ]

  const [scannedLabels, setScannedLabels] = useState<Set<string>>(new Set())
  const [scanSuccess, setScanSuccess] = useState<string | null>(null)

  const getFilteredCustomers = () => {
    if (!customerSearch) return []
    return customerDatabase
      .filter(
        (customer) =>
          customer.code.toLowerCase().includes(customerSearch.toLowerCase()) ||
          customer.name.toLowerCase().includes(customerSearch.toLowerCase()),
      )
      .slice(0, 5) // Limit to 5 results
  }

  const handleCustomerSelect = (customer: any) => {
    setFormData({
      ...formData,
      customerCode: customer.code,
      customerName: customer.name,
      phoneNumber: customer.phone,
    })
    setCustomerSearch("")
    setShowCustomerDropdown(false)
  }

  const parseZMPKGLabel = (labelInput: string) => {
    try {
      // Handle multiple JSON objects concatenated together
      if (labelInput.includes('}{')) {
        const jsonObjects = labelInput.split('}{').map((obj, index, array) => {
          if (index === 0) return obj + '}'
          if (index === array.length - 1) return '{' + obj
          return '{' + obj + '}'
        })
        
        const firstJsonData = JSON.parse(jsonObjects[0])
        if (firstJsonData.package_id && firstJsonData.package_type) {
          return {
            package_id: firstJsonData.package_id,
            package_type: firstJsonData.package_type,
            package_urgency: firstJsonData.package_urgency,
            area: firstJsonData.area,
            row: firstJsonData.row,
            bay: firstJsonData.bay,
            level: firstJsonData.level,
            bin_id: firstJsonData.bin_id,
          }
        }
      } else {
        // Single JSON object
        const jsonData = JSON.parse(labelInput)
        if (jsonData.package_id && jsonData.package_type) {
          return {
            package_id: jsonData.package_id,
            package_type: jsonData.package_type,
            package_urgency: jsonData.package_urgency,
            area: jsonData.area,
            row: jsonData.row,
            bay: jsonData.bay,
            level: jsonData.level,
            bin_id: jsonData.bin_id,
          }
        }
      }
    } catch (e) {
      if (labelInput === "ZMPKG-20250626-00012") {
        return {
          package_id: "ZMPKG-20250626-00012",
          package_type: "FRAGILE",
          package_urgency: "SAME_DAY",
          area: "AA",
          row: "AA",
          bay: "AA",
          level: "AA",
          bin_id: "AA00823",
        }
      }
    }
    return null
  }

  const handleCustomerLookup = (input: string) => {
    setFormData({ ...formData, customerCode: input })

    // Simulate customer lookup - in real implementation, this would call an API
    if (input === "MRC22845ABC" || input.includes("MRC22845ABC")) {
      setFormData((prev) => ({
        ...prev,
        customerCode: "MRC22845ABC",
        customerName: "John Doe",
        phoneNumber: "(555) 123-4567",
      }))
    } else if (input === "ZMCFOX123") {
      setFormData((prev) => ({
        ...prev,
        customerCode: "ZMCFOX123",
        customerName: "Jane Smith",
        phoneNumber: "(555) 987-6543",
      }))
    } else if (input === "ZMB0000012") {
      setFormData((prev) => ({
        ...prev,
        customerCode: "ZMB0000012",
        customerName: "Mike Johnson",
        phoneNumber: "(555) 456-7890",
      }))
    } else if (input.length === 0) {
      setFormData((prev) => ({
        ...prev,
        customerCode: "",
        customerName: "",
        phoneNumber: "",
      }))
    }
  }

  const calculateDeadline = (receivedAt: string) => {
    const receivedDate = new Date(receivedAt)
    const deadline = new Date(receivedDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    return deadline.toISOString().slice(0, 16)
  }

  const handleReceivedAtChange = (value: string) => {
    const deadline = calculateDeadline(value)
    setFormData({
      ...formData,
      receivedAt: value,
      deadline: deadline,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData({ ...formData, packageImages: [...formData.packageImages, ...files] })
  }

  const removeImage = (index: number) => {
    const updatedImages = formData.packageImages.filter((_, i) => i !== index)
    setFormData({ ...formData, packageImages: updatedImages })
  }

  const handleZMPKGLabelChange = (value: string) => {
    // Don't process empty values
    if (!value.trim()) {
      setFormData({ ...formData, zmpkgLabelId: value })
      return
    }

    // Check for duplicates
    if (scannedLabels.has(value.trim())) {
      setScanSuccess(null)
      // Don't update the field, show error in feedback
      return
    }

    setFormData({ ...formData, zmpkgLabelId: value })

    // Handle fast JSON input from barcode scanners
    let zmpkgData = null
    
    try {
      // Handle multiple JSON objects concatenated together
      if (value.trim().includes('}{')) {
        // Split multiple JSON objects
        const jsonObjects = value.trim().split('}{').map((obj, index, array) => {
          if (index === 0) return obj + '}'
          if (index === array.length - 1) return '{' + obj
          return '{' + obj + '}'
        })
        
        // Use the first JSON object for now (could be enhanced to let user choose)
        const firstJsonData = JSON.parse(jsonObjects[0])
        if (firstJsonData.package_id && firstJsonData.package_type) {
          zmpkgData = {
            package_id: firstJsonData.package_id,
            package_type: firstJsonData.package_type,
            package_urgency: firstJsonData.package_urgency || 'standard',
            area: firstJsonData.area,
            row: firstJsonData.row,
            bay: firstJsonData.bay,
            level: firstJsonData.level,
            bin_id: firstJsonData.bin_id,
          }
        }
      } else if (value.trim().startsWith('{') && value.trim().endsWith('}')) {
        // Single JSON object
        const jsonData = JSON.parse(value)
        if (jsonData.package_id && jsonData.package_type) {
          zmpkgData = {
            package_id: jsonData.package_id,
            package_type: jsonData.package_type,
            package_urgency: jsonData.package_urgency || 'standard',
            area: jsonData.area,
            row: jsonData.row,
            bay: jsonData.bay,
            level: jsonData.level,
            bin_id: jsonData.bin_id,
          }
        }
      }
    } catch (e) {
      // If JSON parsing fails, try known sample data
      if (value === "ZMPKG-20250626-00012") {
        zmpkgData = {
          package_id: "ZMPKG-20250626-00012",
          package_type: "FRAGILE",
          package_urgency: "SAME_DAY",
          area: "AA",
          row: "AA",
          bay: "AA",
          level: "AA",
          bin_id: "AA00823",
        }
      }
    }

    // Auto-populate form fields if valid data found
    if (zmpkgData) {
      // Map package types to match dropdown options
      const mapPackageType = (type: string) => {
        const typeMap: { [key: string]: string } = {
          'FRAGILE': 'fragile',
          'STANDARD': 'standard', 
          'URGENT': 'urgent',
          'PERISHABLE': 'perishable',
          'HAZARDOUS': 'hazardous',
          'TEMPERATURE_CONTROLLED': 'temperature_controlled',
          'OVERSIZED': 'oversized',
          'HIGH_VALUE': 'high_value',
          'DOCUMENTS': 'documents',
          'ELECTRONICS': 'electronics',
          'MEDICAL': 'medical'
        }
        return typeMap[type.toUpperCase()] || type.toLowerCase()
      }

      // Map urgency types
      const mapUrgencyType = (urgency: string, packageType: string) => {
        const urgencyMap: { [key: string]: string } = {
          'SAME_DAY': 'same_day',
          'IMMEDIATE': 'immediate',
          'PRIORITY': 'priority',
          'SCHEDULED': 'scheduled',
          'STANDARD': 'standard',
          'DEFERRED': 'deferred'
        }
        
        // If package type is URGENT, override urgency to immediate
        if (packageType.toUpperCase() === 'URGENT') {
          return 'immediate'
        }
        
        return urgencyMap[urgency.toUpperCase()] || urgency.toLowerCase()
      }

      const mappedPackageType = mapPackageType(zmpkgData.package_type)
      const mappedUrgency = mapUrgencyType(zmpkgData.package_urgency, zmpkgData.package_type)

      console.log('ZMPKG Debug:', {
        original_type: zmpkgData.package_type,
        mapped_type: mappedPackageType,
        original_urgency: zmpkgData.package_urgency,
        mapped_urgency: mappedUrgency
      })

      // Add to scanned labels set
      setScannedLabels(prev => new Set([...prev, value.trim()]))
      
      // Set success message
      setScanSuccess(`Successfully processed: ${zmpkgData.package_id}`)

      setFormData((prev) => ({
        ...prev,
        zmpkgLabelId: "", // Clear the field after successful scan
        packageType: mappedPackageType,
        pickupUrgency: mappedUrgency,
        binArea: zmpkgData.area || prev.binArea,
        binRow: zmpkgData.row || prev.binRow,
        binBay: zmpkgData.bay || prev.binBay,
        binLevel: zmpkgData.level || prev.binLevel,
        binId: zmpkgData.bin_id || prev.binId,
      }))
      setStorageType("bin")

      // Clear success message after 3 seconds
      setTimeout(() => setScanSuccess(null), 3000)
    } else {
      // For manual entries or invalid scans, add to scanned set but don't clear field
      if (value.trim().length > 5) { // Only track substantial entries
        setScannedLabels(prev => new Set([...prev, value.trim()]))
      }
    }
  }

  const addTrackingNumber = () => {
    setTrackingNumbers([...trackingNumbers, ""])
  }

  const removeTrackingNumber = (index: number) => {
    setTrackingNumbers(trackingNumbers.filter((_, i) => i !== index))
  }

  const updateTrackingNumber = (index: number, value: string) => {
    const updated = [...trackingNumbers]
    updated[index] = value
    setTrackingNumbers(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { ...formData, trackingNumbers })
  }

  // Add useEffect to handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest(".customer-search-container")) {
        setShowCustomerDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Package Receiving</h1>
            <p className="text-gray-500 text-sm capitalize">{userRole.replace("-", " ")} Portal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customerBarcode" className="text-sm font-medium">
                    Customer ID Barcode (PDF417)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="customerBarcode"
                      placeholder="Scan customer ID barcode or enter Metro ID"
                      value={formData.customerCode}
                      onChange={(e) => handleCustomerLookup(e.target.value)}
                      className="font-mono h-10"
                    />
                    <Button type="button" variant="outline" size="sm" className="px-3 bg-transparent">
                      <Scan className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.customerCode && formData.customerName && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700 flex items-center gap-2 font-medium mb-4">
                        <CheckCircle className="h-4 w-4" />
                        Customer information found
                      </p>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-sm">👤</span>
                          </div>
                          <div className="flex-1">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Customer</p>
                                <p className="text-lg font-semibold text-gray-900">{formData.customerName}</p>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                                  Phone Number
                                </p>
                                <p className="text-base font-medium text-gray-900">{formData.phoneNumber}</p>
                              </div>

                              <div>
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">METRO ID</p>
                                <p className="text-xl font-bold text-gray-900 font-mono">{formData.customerCode}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Scan the customer's Metro ID card (PDF417 barcode) or manually enter their Metro ID to look up
                    customer information.
                  </p>
                </div>

                {/* Manual Customer Entry (fallback) */}
                {!formData.customerName && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 relative customer-search-container">
                        <Label htmlFor="manualCustomerCode" className="text-sm font-medium">
                          Manual Customer Code Entry
                        </Label>
                        <Input
                          id="manualCustomerCode"
                          placeholder="Type to search customers..."
                          value={customerSearch || formData.customerCode}
                          onChange={(e) => {
                            const value = e.target.value
                            setCustomerSearch(value)
                            setShowCustomerDropdown(value.length > 0)
                            if (value.length === 0) {
                              setFormData({ ...formData, customerCode: "", customerName: "", phoneNumber: "" })
                            }
                          }}
                          onFocus={() => setShowCustomerDropdown(customerSearch.length > 0)}
                          className="font-mono h-10"
                        />

                        {/* Dropdown */}
                        {showCustomerDropdown && getFilteredCustomers().length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {getFilteredCustomers().map((customer, index) => (
                              <div
                                key={customer.code}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                onClick={() => handleCustomerSelect(customer)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-gray-900">{customer.name}</p>
                                    <p className="text-sm text-gray-500 font-mono">{customer.code}</p>
                                  </div>
                                  <p className="text-sm text-gray-600">{customer.phone}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="manualCustomerName" className="text-sm font-medium">
                          Customer Name
                        </Label>
                        <Input
                          id="manualCustomerName"
                          placeholder="Auto-populated from selection"
                          value={formData.customerName}
                          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                          className="h-10 bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* OCR Capture */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    OCR Capture
                  </CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOCRCapture(!showOCRCapture)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {showOCRCapture ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Scan or upload shipping labels to auto-populate package details
                </p>
              </CardHeader>
              {showOCRCapture && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Camera Capture</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Scan shipping label with camera</p>
                        <Button type="button" variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          Open Camera
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Upload Document</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Scan className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Upload shipping label image</p>
                        <Button type="button" variant="outline" size="sm">
                          <Scan className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium mb-1">Supported formats:</p>
                    <p className="text-xs text-blue-600">
                      • Shipping labels (FedEx, UPS, USPS, DHL)
                      • Package receipts and invoices
                      • Barcode and QR code scanning
                      • JPG, PNG, PDF formats
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" className="flex-1 bg-transparent">
                      <Scan className="h-4 w-4 mr-2" />
                      Process OCR
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="px-3">
                      Clear
                    </Button>
                  </div>

                  {/* Shipment Information Panel */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Shipment Information</h4>
                        <p className="text-xs text-gray-500">Detailed shipping label fields (auto-populated from OCR)</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowShipmentInfo(!showShipmentInfo)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showShipmentInfo ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {showShipmentInfo && (
                      <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
                        {/* Courier Information */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Courier Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="courierTrackingNumber" className="text-sm font-medium">
                                Courier Tracking Number <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="courierTrackingNumber"
                                placeholder="Enter tracking number"
                                className="font-mono h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="labelShipmentType" className="text-sm font-medium">
                                Label Shipment Type
                              </Label>
                              <Input
                                id="labelShipmentType"
                                placeholder="e.g., Express, Ground, Priority"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="extraDimension" className="text-sm font-medium">
                                Extra Dimension
                              </Label>
                              <Input
                                id="extraDimension"
                                placeholder="L x W x H"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="extraWeight" className="text-sm font-medium">
                                Extra Weight
                              </Label>
                              <Input
                                id="extraWeight"
                                placeholder="e.g., 2.5 lbs"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="unitWeight" className="text-sm font-medium">
                                Unit Weight
                              </Label>
                              <Select>
                                <SelectTrigger className="h-9">
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                                  <SelectItem value="oz">Ounces (oz)</SelectItem>
                                  <SelectItem value="g">Grams (g)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Recipient Information */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Recipient Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientName" className="text-sm font-medium">
                                Recipient Name
                              </Label>
                              <Input
                                id="recipientName"
                                placeholder="Full name"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientBusinessName" className="text-sm font-medium">
                                Recipient Business Name
                              </Label>
                              <Input
                                id="recipientBusinessName"
                                placeholder="Company name"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientEmail" className="text-sm font-medium">
                                Recipient Email
                              </Label>
                              <Input
                                id="recipientEmail"
                                type="email"
                                placeholder="email@example.com"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientPhone" className="text-sm font-medium">
                                Recipient Phone
                              </Label>
                              <Input
                                id="recipientPhone"
                                placeholder="(555) 123-4567"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientStreet" className="text-sm font-medium">
                                Recipient Street
                              </Label>
                              <Input
                                id="recipientStreet"
                                placeholder="Street address"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientBuilding" className="text-sm font-medium">
                                Recipient Building
                              </Label>
                              <Input
                                id="recipientBuilding"
                                placeholder="Building/Suite"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientFloor" className="text-sm font-medium">
                                Recipient Floor
                              </Label>
                              <Input
                                id="recipientFloor"
                                placeholder="Floor #"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientOfficeNumber" className="text-sm font-medium">
                                Recipient Office Number
                              </Label>
                              <Input
                                id="recipientOfficeNumber"
                                placeholder="Office #"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientSuburb" className="text-sm font-medium">
                                Recipient Suburb
                              </Label>
                              <Input
                                id="recipientSuburb"
                                placeholder="Suburb/District"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipientCity" className="text-sm font-medium">
                                Recipient City
                              </Label>
                              <Input
                                id="recipientCity"
                                placeholder="City"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientState" className="text-sm font-medium">
                                Recipient State
                              </Label>
                              <Input
                                id="recipientState"
                                placeholder="State/Province"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientZipCode" className="text-sm font-medium">
                                Recipient Zip Code
                              </Label>
                              <Input
                                id="recipientZipCode"
                                placeholder="ZIP/Postal"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="recipientCountry" className="text-sm font-medium">
                                Recipient Country
                              </Label>
                              <Input
                                id="recipientCountry"
                                placeholder="Country"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipientPersonSuburb" className="text-sm font-medium">
                              Recipient Person Suburb
                            </Label>
                            <Input
                              id="recipientPersonSuburb"
                              placeholder="Personal suburb/area"
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Sender Information */}
                        <div className="space-y-4">
                          <h5 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Sender Information</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="senderName" className="text-sm font-medium">
                                Sender Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="senderName"
                                placeholder="Full name"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderBusinessName" className="text-sm font-medium">
                                Sender Business Name <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="senderBusinessName"
                                placeholder="Company name"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="senderEmail" className="text-sm font-medium">
                                Sender Email
                              </Label>
                              <Input
                                id="senderEmail"
                                type="email"
                                placeholder="email@example.com"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderPhone" className="text-sm font-medium">
                                Sender Phone
                              </Label>
                              <Input
                                id="senderPhone"
                                placeholder="(555) 123-4567"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="senderStreet" className="text-sm font-medium">
                                Sender Street
                              </Label>
                              <Input
                                id="senderStreet"
                                placeholder="Street address"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderBuilding" className="text-sm font-medium">
                                Sender Building
                              </Label>
                              <Input
                                id="senderBuilding"
                                placeholder="Building/Suite"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="senderFloor" className="text-sm font-medium">
                                Sender Floor
                              </Label>
                              <Input
                                id="senderFloor"
                                placeholder="Floor #"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderOfficeNumber" className="text-sm font-medium">
                                Sender Office Number
                              </Label>
                              <Input
                                id="senderOfficeNumber"
                                placeholder="Office #"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderSuburb" className="text-sm font-medium">
                                Sender Suburb
                              </Label>
                              <Input
                                id="senderSuburb"
                                placeholder="Suburb/District"
                                className="h-9"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="senderCity" className="text-sm font-medium">
                                Sender City
                              </Label>
                              <Input
                                id="senderCity"
                                placeholder="City"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderState" className="text-sm font-medium">
                                Sender State
                              </Label>
                              <Input
                                id="senderState"
                                placeholder="State/Province"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderZipCode" className="text-sm font-medium">
                                Sender Zip Code
                              </Label>
                              <Input
                                id="senderZipCode"
                                placeholder="ZIP/Postal"
                                className="h-9"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="senderCountry" className="text-sm font-medium">
                                Sender Country
                              </Label>
                              <Input
                                id="senderCountry"
                                placeholder="Country"
                                className="h-9"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Shipment Info */}
                        <div className="flex gap-2 pt-4 border-t border-gray-200">
                          <Button type="button" variant="outline" size="sm" className="flex-1 bg-transparent">
                            Auto-Fill from OCR
                          </Button>
                          <Button type="button" variant="ghost" size="sm">
                            Clear All Fields
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* ZMPKG Label Scanning */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Scan className="h-5 w-5" />
                  ZMPKG Label Scanning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="zmpkgLabelId" className="text-sm font-medium">
                    ZMPKG Label ID
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="zmpkgLabelId"
                      placeholder="Scan barcode or paste: ZMPKG-20250626-00012 or JSON data"
                      value={formData.zmpkgLabelId}
                      onChange={(e) => handleZMPKGLabelChange(e.target.value)}
                      onPaste={(e) => {
                        // Handle fast paste from barcode scanners
                        setTimeout(() => {
                          const pastedValue = e.currentTarget.value
                          if (pastedValue !== formData.zmpkgLabelId) {
                            handleZMPKGLabelChange(pastedValue)
                          }
                        }, 10)
                      }}
                      className="font-mono h-10"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" className="px-3 bg-transparent">
                        <Scan className="h-4 w-4" />
                      </Button>
                      {scannedLabels.size > 0 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setScannedLabels(new Set())
                            setScanSuccess(null)
                          }}
                          className="text-xs px-2"
                        >
                          Clear History ({scannedLabels.size})
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced feedback for different input types */}
                  {formData.zmpkgLabelId && (
                    <div className="space-y-2">
                      {scannedLabels.has(formData.zmpkgLabelId.trim()) && formData.zmpkgLabelId.trim() ? (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 flex items-center gap-2 font-medium">
                            <AlertCircle className="h-4 w-4" />
                            Duplicate scan detected - this label has already been processed
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Each ZMPKG label can only be scanned once. Please scan a different package.
                          </p>
                        </div>
                      ) : parseZMPKGLabel(formData.zmpkgLabelId) ? (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700 flex items-center gap-2 font-medium">
                            <CheckCircle className="h-4 w-4" />
                            {formData.zmpkgLabelId.includes('}{') ? 'Multiple JSON objects detected - using first package' : 
                             formData.zmpkgLabelId.startsWith('{') ? 'JSON barcode data successfully parsed' : 
                             'Label data successfully parsed'} and auto-populated
                          </p>
                          <div className="mt-2 text-xs text-green-600 space-y-1">
                            <p>• Package ID: {parseZMPKGLabel(formData.zmpkgLabelId)?.package_id}</p>
                            <p>• Package Type: {parseZMPKGLabel(formData.zmpkgLabelId)?.package_type}</p>
                            <p>• Urgency: {parseZMPKGLabel(formData.zmpkgLabelId)?.package_urgency}</p>
                            <p>
                              • Storage Location: {parseZMPKGLabel(formData.zmpkgLabelId)?.area}-
                              {parseZMPKGLabel(formData.zmpkgLabelId)?.row}-{parseZMPKGLabel(formData.zmpkgLabelId)?.bay}-{parseZMPKGLabel(formData.zmpkgLabelId)?.level}-{parseZMPKGLabel(formData.zmpkgLabelId)?.bin_id}
                            </p>
                            {formData.zmpkgLabelId.includes('}{') && (
                              <p className="text-yellow-600">• Multiple packages detected in barcode - additional packages available</p>
                            )}
                          </div>
                        </div>
                      ) : formData.zmpkgLabelId.startsWith('{') ? (
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-700 flex items-center gap-2 font-medium">
                            <AlertCircle className="h-4 w-4" />
                            JSON detected but missing required fields
                          </p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Required: package_id, package_type. Check barcode format.
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-700 flex items-center gap-2 font-medium">
                            <Package className="h-4 w-4" />
                            Manual entry detected
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            Enter package details manually or scan a ZMPKG barcode.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success message for cleared scans */}
                  {scanSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2 font-medium">
                        <CheckCircle className="h-4 w-4" />
                        {scanSuccess}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        Field cleared and ready for next scan. Package data has been populated below.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Barcode Scanner:</strong> Scan the ZMPKG barcode directly into this field</p>
                    <p><strong>Auto-Clear:</strong> Field clears automatically after successful scan</p>
                    <p><strong>Duplicate Prevention:</strong> Each label can only be scanned once per session</p>
                    <p><strong>Multiple JSON:</strong> {"{"}"package_id":"ZMPKG-..."{"}"}{"}{"package_id":\"ZMPKG-..."{"}"}</p>
                    <p><strong>Single JSON:</strong> {"{"}"package_id":"ZMPKG-...", "package_type":"FRAGILE"...{"}"}</p>
                    <p><strong>Manual Entry:</strong> Type ZMPKG-20250626-00012 for sample data</p>
                  </div>
                </div>

                {/* Package Type and Pickup Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageType" className="text-sm font-medium">
                      Package Type
                    </Label>
                    <Select
                      value={formData.packageType}
                      onValueChange={(value) => setFormData({ ...formData, packageType: value })}
                    >
                      <SelectTrigger
                        className={`h-10 ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-50 border-green-200" : ""}`}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Standard Package</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fragile">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                            <span>Fragile - Handle with Care</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="perishable">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span>Perishable - Time Sensitive</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="hazardous">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Hazardous Materials</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-600"></div>
                            <span>Urgent - Immediate Processing</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="temperature_controlled">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Temperature Controlled</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="oversized">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>Oversized Package</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high_value">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                            <span>High Value - Secure Handling</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="documents">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span>Documents/Letters</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="electronics">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            <span>Electronics - ESD Sensitive</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medical">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                            <span>Medical Supplies</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.packageType && (
                      <p className="text-xs text-gray-600">
                        {formData.packageType === "standard" && "Regular packages with no special handling requirements"}
                        {formData.packageType === "fragile" && "Requires careful handling to prevent damage"}
                        {formData.packageType === "perishable" && "Time-sensitive items that may spoil or expire"}
                        {formData.packageType === "hazardous" &&
                          "Contains dangerous materials requiring special protocols"}
                        {formData.packageType === "urgent" && "Requires immediate processing and handling"}
                        {formData.packageType === "temperature_controlled" && "Must maintain specific temperature range"}
                        {formData.packageType === "oversized" &&
                          "Larger than standard dimensions, may require special storage"}
                        {formData.packageType === "high_value" && "Valuable items requiring enhanced security measures"}
                        {formData.packageType === "documents" && "Paper documents, letters, or lightweight items"}
                        {formData.packageType === "electronics" && "Electronic devices sensitive to static discharge"}
                        {formData.packageType === "medical" && "Medical equipment or pharmaceutical products"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pickupUrgency" className="text-sm font-medium">
                      Pickup Urgency
                    </Label>
                    <Select
                      value={formData.pickupUrgency}
                      onValueChange={(value) => setFormData({ ...formData, pickupUrgency: value })}
                    >
                      <SelectTrigger
                        className={`h-10 ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-50 border-green-200" : ""}`}
                      >
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span>Immediate Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="same_day">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span>Same-Day Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="scheduled">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span>Scheduled Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="priority">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <span>Priority Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="temp_sensitive">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span>Temperature-Sensitive Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fragile">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                            <span>Fragile Handling Required</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="standard">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span>Standard Pickup</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="deferred">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                            <span>Deferred Pickup</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.pickupUrgency && (
                      <p className="text-xs text-gray-600">
                        {formData.pickupUrgency === "immediate" && "Must be picked up right away (highest urgency)"}
                        {formData.pickupUrgency === "same_day" && "Pickup before the end of the business day"}
                        {formData.pickupUrgency === "scheduled" && "Pickup at a specific pre-arranged time slot"}
                        {formData.pickupUrgency === "priority" && "Pickup as soon as possible, but not emergency level"}
                        {formData.pickupUrgency === "temp_sensitive" && "Pickup urgently to maintain temperature"}
                        {formData.pickupUrgency === "fragile" && "Pickup needs careful, gentle handling"}
                        {formData.pickupUrgency === "standard" && "Normal pickup, no urgency"}
                        {formData.pickupUrgency === "deferred" && "Can be held for pickup later, very low urgency"}
                      </p>
                    )}
                  </div>

                  {/* Storage Type Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Storage Type</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="storageType"
                          value="locker"
                          onChange={() => setStorageType("locker")}
                          className="w-4 h-4"
                        />
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Smart Locker</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="storageType"
                          value="bin"
                          checked={storageType === "bin"}
                          onChange={() => setStorageType("bin")}
                          className="w-4 h-4"
                        />
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Warehouse Bin</span>
                      </label>
                    </div>
                  </div>

                  {/* Storage Location Details */}
                  {storageType === "locker" && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="lockerBarcode" className="text-sm font-medium">
                          Locker Barcode
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="lockerBarcode"
                            placeholder="e.g., A03, B15"
                            value={formData.lockerBarcode}
                            onChange={(e) => setFormData({ ...formData, lockerBarcode: e.target.value })}
                            className="font-mono h-10"
                          />
                          <Button type="button" variant="outline" size="sm" className="px-3 bg-transparent">
                            <Scan className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {storageType === "bin" && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
                      {parseZMPKGLabel(formData.zmpkgLabelId) && (
                        <p className="text-sm text-green-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Bin location auto-populated from ZMPKG label
                        </p>
                      )}
                      <div className="grid grid-cols-5 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="binArea" className="text-xs font-medium">
                            Area
                          </Label>
                          <Input
                            id="binArea"
                            placeholder="AA"
                            value={formData.binArea}
                            onChange={(e) => setFormData({ ...formData, binArea: e.target.value })}
                            className={`font-mono h-9 text-center ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-100 border-green-300" : ""}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="binRow" className="text-xs font-medium">
                            Row
                          </Label>
                          <Input
                            id="binRow"
                            placeholder="AA"
                            value={formData.binRow}
                            onChange={(e) => setFormData({ ...formData, binRow: e.target.value })}
                            className={`font-mono h-9 text-center ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-100 border-green-300" : ""}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="binBay" className="text-xs font-medium">
                            Bay
                          </Label>
                          <Input
                            id="binBay"
                            placeholder="AA"
                            value={formData.binBay}
                            onChange={(e) => setFormData({ ...formData, binBay: e.target.value })}
                            className={`font-mono h-9 text-center ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-100 border-green-300" : ""}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="binLevel" className="text-xs font-medium">
                            Level
                          </Label>
                          <Input
                            id="binLevel"
                            placeholder="AA"
                            value={formData.binLevel}
                            onChange={(e) => setFormData({ ...formData, binLevel: e.target.value })}
                            className={`font-mono h-9 text-center ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-100 border-green-300" : ""}`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="binId" className="text-xs font-medium">
                            Bin ID
                          </Label>
                          <Input
                            id="binId"
                            placeholder="AA00823"
                            value={formData.binId}
                            onChange={(e) => setFormData({ ...formData, binId: e.target.value })}
                            className={`font-mono h-9 text-center ${parseZMPKGLabel(formData.zmpkgLabelId) ? "bg-green-100 border-green-300" : ""}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

            {/* Package Information */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-medium">Package Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status and Carrier */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                        <SelectItem value="picked-up">Picked Up</SelectItem>
                        <SelectItem value="ready-for-pickup">Ready for Pickup</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carrier" className="text-sm font-medium">
                      Carrier
                    </Label>
                    <Input
                      id="carrier"
                      placeholder="Enter carrier name"
                      value={formData.carrier}
                      onChange={(e) => setFormData({ ...formData, carrier: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Add Shipper Name field */}
                <div className="space-y-2">
                  <Label htmlFor="shipperName" className="text-sm font-medium">
                    Shipper Name (From)
                  </Label>
                  <Input
                    id="shipperName"
                    placeholder="Enter shipper/sender name"
                    value={formData.shipperFrom}
                    onChange={(e) => setFormData({ ...formData, shipperFrom: e.target.value })}
                    className="h-10"
                  />
                </div>

                {/* Tracking Numbers */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Tracking Numbers</Label>
                  <div className="space-y-2">
                    {trackingNumbers.map((number, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Enter tracking number"
                          value={number}
                          onChange={(e) => updateTrackingNumber(index, e.target.value)}
                          className="font-mono h-10"
                        />
                        {trackingNumbers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTrackingNumber(index)}
                            className="px-3"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={addTrackingNumber}
                      className="h-10 w-full border-2 border-dashed border-gray-300 hover:border-gray-400"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Add Tracking Number
                    </Button>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions" className="text-sm font-medium">
                      Dimensions
                    </Label>
                    <Input
                      id="dimensions"
                      placeholder="e.g., 10x5x2"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="text-sm font-medium">
                      Weight
                    </Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 5kg"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialInstructions" className="text-sm font-medium">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Enter any special instructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    className="h-24"
                  />
                </div>

                {/* Package Images */}
                <div className="space-y-2">
                  <Label htmlFor="packageImages" className="text-sm font-medium">
                    Package Images
                  </Label>
                  <div className="flex gap-2">
                    <Input id="packageImages" type="file" multiple onChange={handleImageUpload} className="h-10" />
                    <Button type="button" variant="outline" size="sm" className="px-3 bg-transparent">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.packageImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {formData.packageImages.map((image, index) => (
                        <div key={index} className="relative">
                          <div className="w-full h-24 bg-gray-100 rounded-lg border flex items-center justify-center">
                            <Camera className="h-6 w-6 text-gray-400" />
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-white border-red-200 hover:bg-red-50"
                          >
                            <X className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
                Complete Package Receiving
              </Button>
              <Button type="button" variant="outline" onClick={onBack} className="px-6 h-12 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Package Preview Card - Right Side */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {(formData.customerName || formData.zmpkgLabelId || formData.packageType) ? (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-3 w-3 text-blue-600" />
                      </div>
                      <CardTitle className="text-base font-medium text-gray-900">Package Preview</CardTitle>
                    </div>
                    {formData.packageType && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full border text-xs">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            formData.packageType === "fragile"
                              ? "bg-yellow-500"
                              : formData.packageType === "standard"
                                ? "bg-green-500"
                                : formData.packageType === "perishable"
                                  ? "bg-orange-500"
                                  : formData.packageType === "hazardous"
                                    ? "bg-red-500"
                                    : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="font-medium uppercase tracking-wide">
                          {formData.packageType.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                  {formData.customerName && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-900">{formData.customerName}</p>
                      {formData.customerCode && (
                        <p className="text-xs text-gray-600 font-mono">{formData.customerCode}</p>
                      )}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  {/* Package Images Preview */}
                  {formData.packageImages.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Package Images
                      </Label>
                      <div className="flex gap-1">
                        {formData.packageImages.slice(0, 3).map((file, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center"
                          >
                            <Camera className="h-3 w-3 text-gray-400" />
                          </div>
                        ))}
                        {formData.packageImages.length > 3 && (
                          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                            <span className="text-xs text-gray-500">+{formData.packageImages.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Package Info */}
                  {(formData.zmpkgLabelId || trackingNumbers[0]) && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Package Info
                      </Label>
                      <div className="space-y-2">
                        {formData.zmpkgLabelId && (
                          <div>
                            <p className="text-xs text-gray-500">ZMPKG Tracking</p>
                            <p className="font-mono text-xs font-medium">
                              {(() => {
                                const zmpkgData = parseZMPKGLabel(formData.zmpkgLabelId)
                                if (zmpkgData && zmpkgData.package_id) {
                                  return zmpkgData.package_id.replace('ZMPKG-', 'MPKG-')
                                }
                                return formData.zmpkgLabelId.replace('ZMPKG-', 'MPKG-')
                              })()}
                            </p>
                          </div>
                        )}
                        {trackingNumbers[0] && (
                          <div>
                            <p className="text-xs text-gray-500">Package Tracking #</p>
                            <p className="font-mono text-xs font-medium">{trackingNumbers[0]}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pickup Urgency */}
                  {formData.pickupUrgency && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Pickup Urgency
                      </Label>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.pickupUrgency === "immediate"
                              ? "bg-red-500"
                              : formData.pickupUrgency === "same_day"
                                ? "bg-orange-500"
                                : formData.pickupUrgency === "priority"
                                  ? "bg-yellow-500"
                                  : formData.pickupUrgency === "scheduled"
                                    ? "bg-blue-500"
                                    : formData.pickupUrgency === "temp_sensitive"
                                      ? "bg-purple-500"
                                      : formData.pickupUrgency === "fragile"
                                        ? "bg-yellow-600"
                                        : formData.pickupUrgency === "standard"
                                          ? "bg-green-500"
                                          : "bg-gray-500"
                          }`}
                        ></div>
                        <span className="text-xs font-medium capitalize">
                          {formData.pickupUrgency.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Add Shipper Name section */}
                  {formData.shipperFrom && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Shipper Name (From)
                      </Label>
                      <div className="bg-white border rounded p-2">
                        <p className="text-xs font-medium text-gray-900">{formData.shipperFrom}</p>
                      </div>
                    </div>
                  )}

                  {/* Customer & Carrier */}
                  {formData.carrier && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Carrier
                      </Label>
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-white rounded border">
                          <span className="text-xs font-bold uppercase">{formData.carrier}</span>
                        </div>
                        {trackingNumbers[0] && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded text-green-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-mono">{trackingNumbers[0].slice(0, 8)}...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Storage Location */}
                  {(formData.binArea || formData.lockerBarcode) && (
                    <div>
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Storage Location
                      </Label>

                      {storageType === "bin" && (
                        <div className="grid grid-cols-5 gap-1">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">AREA</p>
                            <div className="bg-white border rounded p-1">
                              <p className="font-mono font-bold text-xs">{formData.binArea || "--"}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">ROW</p>
                            <div className="bg-white border rounded p-1">
                              <p className="font-mono font-bold text-xs">{formData.binRow || "--"}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">BAY</p>
                            <div className="bg-white border rounded p-1">
                              <p className="font-mono font-bold text-xs">{formData.binBay || "--"}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">LEVEL</p>
                            <div className="bg-white border rounded p-1">
                              <p className="font-mono font-bold text-xs">{formData.binLevel || "--"}</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-1">BIN</p>
                            <div className="bg-white border rounded p-1">
                              <p className="font-mono font-bold text-xs">{formData.binId || "--"}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {storageType === "locker" && formData.lockerBarcode && (
                        <div className="bg-white border rounded p-2 text-center">
                          <p className="text-xs text-gray-500 mb-1">LOCKER</p>
                          <p className="font-mono font-bold text-sm">{formData.lockerBarcode}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          formData.status === "pending"
                            ? "bg-yellow-500"
                            : formData.status === "ready-for-pickup"
                              ? "bg-green-500"
                              : formData.status === "picked-up"
                                ? "bg-blue-500"
                                : formData.status === "delivered"
                                  ? "bg-green-600"
                                  : "bg-gray-500"
                        }`}
                      ></div>
                      <span className="text-xs font-medium capitalize">{formData.status.replace("-", " ")}</span>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">Received</p>
                      <p className="text-xs font-medium">06:21 PM</p>
                    </div>
                  </div>

                  {/* Enhanced Timeline */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3 block">
                      Package Timeline
                    </Label>
                    <div className="space-y-3">
                      {/* Package Arrived at Warehouse */}
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Package Arrived at Warehouse</p>
                          <p className="text-xs text-gray-500">Jun 27, 2025, 06:21 PM</p>
                          <p className="text-xs text-gray-400 italic">
                            {formData.carrier ? `Received from ${formData.carrier.toUpperCase()}` : 'Received from UPS'}
                          </p>
                        </div>
                      </div>

                      {/* Package Scanned In */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${formData.zmpkgLabelId ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Package Scanned In</p>
                          {formData.zmpkgLabelId ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 06:23 PM</p>
                              <p className="text-xs text-gray-400 italic">Checked into warehouse system</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>

                      {/* Storage Location Assigned */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${(formData.binArea || formData.lockerBarcode) ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Storage Location Assigned</p>
                          {(formData.binArea || formData.lockerBarcode) ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 06:26 PM</p>
                              <p className="text-xs text-gray-400 italic">
                                Stored at: {storageType === "bin"
                                  ? `${formData.binArea || 'AA'}-${formData.binRow || 'AA'}-${formData.binBay || 'AA'}-${formData.binLevel || 'AA'}-${formData.binId || 'AA00823'}`
                                  : formData.lockerBarcode || "Locker location"
                                }
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>

                      {/* Package Ready for Pickup */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${formData.status === "ready-for-pickup" ? "bg-green-500" : formData.status === "picked-up" || formData.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Package Ready for Pickup</p>
                          {(formData.status === "ready-for-pickup" || formData.status === "picked-up" || formData.status === "delivered") ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 06:51 PM</p>
                              <p className="text-xs text-gray-400 italic">
                                Customer {formData.customerName || 'David Brown'} notified
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>

                      {/* Pickup Initiated */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${formData.status === "picked-up" || formData.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Pickup Initiated</p>
                          {(formData.status === "picked-up" || formData.status === "delivered") ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 07:15 PM</p>
                              <p className="text-xs text-gray-400 italic">
                                {formData.assignedTo ? `Staff ${formData.assignedTo} began processing pickup` : 'Staff began processing pickup'}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>

                      {/* Customer Signature */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${formData.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Customer Signature</p>
                          {formData.status === "delivered" ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 07:18 PM</p>
                              <p className="text-xs text-gray-400 italic">Proof of handoff captured</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>

                      {/* Pickup Completed */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${formData.status === "delivered" ? "bg-green-500" : "bg-gray-300"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900">Pickup Completed</p>
                          {formData.status === "delivered" ? (
                            <>
                              <p className="text-xs text-gray-500">Jun 27, 2025, 07:20 PM</p>
                              <p className="text-xs text-gray-400 italic">Package released to customer</p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-400">Pending</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm bg-gray-50">
                <CardContent className="p-6 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Package Preview</p>
                  <p className="text-xs text-gray-400 mt-1">Fill out the form to see preview</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
)\
}
