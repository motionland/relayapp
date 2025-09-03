"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Eye,
  Check,
  X,
  Clock,
  FileText,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for applications
const mockApplications = [
  {
    id: "APP-001",
    businessName: "TechStart Solutions",
    contactName: "John Smith",
    email: "john@techstart.com",
    phone: "(555) 123-4567",
    status: "pending",
    submittedDate: "2024-01-15",
    businessType: "LLC",
    industry: "Technology",
    address: "123 Tech St, San Francisco, CA 94105",
    documents: {
      businessRegistration: {
        uploaded: true,
        verified: false,
        url: "/business-registration.png",
      },
      taxIdCertificate: {
        uploaded: true,
        verified: true,
        url: "/tax-id-certificate-ein-document.png",
      },
      governmentId: {
        uploaded: true,
        verified: false,
        url: "/government-issued-id-driver-license.png",
      },
      utilityBill: { uploaded: false, verified: false },
    },
  },
  {
    id: "APP-002",
    businessName: "Green Valley Consulting",
    contactName: "Sarah Johnson",
    email: "sarah@greenvalley.com",
    phone: "(555) 987-6543",
    status: "approved",
    submittedDate: "2024-01-12",
    businessType: "Corporation",
    industry: "Consulting",
    address: "456 Valley Rd, Austin, TX 78701",
    documents: {
      businessRegistration: {
        uploaded: true,
        verified: true,
        url: "/business-registration.png",
      },
      taxIdCertificate: {
        uploaded: true,
        verified: true,
        url: "/tax-id-certificate-ein-document.png",
      },
      governmentId: {
        uploaded: true,
        verified: true,
        url: "/government-issued-id-driver-license.png",
      },
      utilityBill: {
        uploaded: true,
        verified: true,
        url: "/utility-bill-electricity-gas-water.png",
      },
    },
  },
  {
    id: "APP-003",
    businessName: "Metro Retail Co",
    contactName: "Mike Davis",
    email: "mike@metroretail.com",
    phone: "(555) 456-7890",
    status: "declined",
    submittedDate: "2024-01-10",
    businessType: "Partnership",
    industry: "Retail",
    address: "789 Commerce Ave, New York, NY 10001",
    documents: {
      businessRegistration: {
        uploaded: true,
        verified: false,
        url: "/business-registration.png",
      },
      taxIdCertificate: { uploaded: false, verified: false },
      governmentId: {
        uploaded: true,
        verified: true,
        url: "/government-issued-id-driver-license.png",
      },
      utilityBill: {
        uploaded: true,
        verified: false,
        url: "/utility-bill-electricity-gas-water.png",
      },
    },
  },
]

export default function AdminDashboard() {
  const [applications, setApplications] = useState(mockApplications)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [viewingDocument, setViewingDocument] = useState(null)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [declineReason, setDeclineReason] = useState("")
  const [applicationToDecline, setApplicationToDecline] = useState(null)
  const [showDocumentRejectModal, setShowDocumentRejectModal] = useState(false)
  const [documentToReject, setDocumentToReject] = useState(null)
  const [documentRejectReason, setDocumentRejectReason] = useState("")

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateApplicationStatus = (id: string, newStatus: string) => {
    setApplications((apps) => apps.map((app) => (app.id === id ? { ...app, status: newStatus } : app)))
  }

  const handleDeclineApplication = (application) => {
    setApplicationToDecline(application)
    setShowDeclineModal(true)
    setDeclineReason("")
  }

  const sendDeclineNotification = async () => {
    if (!applicationToDecline || !declineReason.trim()) return

    // Update application status
    updateApplicationStatus(applicationToDecline.id, "declined")

    // Here you would typically send the email notification
    // For now, we'll just show a console log
    console.log("[v0] Sending decline notification email to:", applicationToDecline.email)
    console.log("[v0] Decline reason:", declineReason)

    // Close modal and reset state
    setShowDeclineModal(false)
    setApplicationToDecline(null)
    setDeclineReason("")

    // You could add a toast notification here to confirm email was sent
    alert(`Decline notification sent to ${applicationToDecline.email}`)
  }

  const handleRejectDocument = (documentName, documentLabel) => {
    setDocumentToReject({ name: documentName, label: documentLabel, application: selectedApplication })
    setShowDocumentRejectModal(true)
    setDocumentRejectReason("")
  }

  const sendDocumentRejectionNotification = async () => {
    if (!documentToReject || !documentRejectReason.trim()) return

    // Here you would typically send the email notification
    console.log("[v0] Sending document rejection email to:", documentToReject.application.email)
    console.log("[v0] Document rejected:", documentToReject.label)
    console.log("[v0] Rejection reason:", documentRejectReason)

    // Update document status to rejected (you might want to add a 'rejected' status)
    // For now, we'll just mark it as unverified
    setApplications((apps) =>
      apps.map((app) =>
        app.id === documentToReject.application.id
          ? {
              ...app,
              documents: {
                ...app.documents,
                [documentToReject.name]: {
                  ...app.documents[documentToReject.name],
                  verified: false,
                },
              },
            }
          : app,
      ),
    )

    // Close modal and reset state
    setShowDocumentRejectModal(false)
    setDocumentToReject(null)
    setDocumentRejectReason("")

    // Show confirmation
    alert(`Document rejection notification sent to ${documentToReject.application.email}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <Check className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        )
      case "declined":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
            <X className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDocumentStatus = (doc: { uploaded: boolean; verified: boolean }) => {
    if (!doc.uploaded)
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
          Not Uploaded
        </Badge>
      )
    if (!doc.verified)
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Pending Review
        </Badge>
      )
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        Verified
      </Badge>
    )
  }

  const renderDocumentRow = (docName: string, docLabel: string, doc: any) => (
    <div key={docName} className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-gray-400" />
        <span>{docLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        {getDocumentStatus(doc)}
        {doc.uploaded && doc.url && (
          <Button variant="outline" size="sm" onClick={() => setViewingDocument({ name: docLabel, url: doc.url })}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
        {doc.uploaded && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
            onClick={() => handleRejectDocument(docName, docLabel)}
          >
            <X className="h-4 w-4 mr-1" />
            Reject
          </Button>
        )}
      </div>
    </div>
  )

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    approved: applications.filter((app) => app.status === "approved").length,
    declined: applications.filter((app) => app.status === "declined").length,
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-black mb-1">Business Applications</h1>
              <p className="text-gray-600 text-sm">Manage and review business account applications</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total</p>
                <p className="text-2xl font-semibold text-black mt-1">{stats.total}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="text-2xl font-semibold text-black mt-1">{stats.pending}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</p>
                <p className="text-2xl font-semibold text-black mt-1">{stats.approved}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <Check className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Declined</p>
                <p className="text-2xl font-semibold text-black mt-1">{stats.declined}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <X className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 border-gray-200 focus:border-black focus:ring-black">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-black">Applications</h2>
              <span className="text-sm text-gray-500">{filteredApplications.length} results</span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-black truncate">{application.businessName}</h3>
                      <div className="flex-shrink-0">{getStatusBadge(application.status)}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{application.contactName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{application.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{application.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-gray-200 hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      {/* ... existing dialog content ... */}
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-black">
                            Application Details - {application?.businessName}
                          </DialogTitle>
                          <DialogDescription>
                            Application ID: {application?.id} | Submitted: {application?.submittedDate}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                          <Tabs defaultValue="info" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                              <TabsTrigger
                                value="info"
                                className="data-[state=active]:bg-white data-[state=active]:text-black"
                              >
                                Business Info
                              </TabsTrigger>
                              <TabsTrigger
                                value="documents"
                                className="data-[state=active]:bg-white data-[state=active]:text-black"
                              >
                                Documents
                              </TabsTrigger>
                              <TabsTrigger
                                value="actions"
                                className="data-[state=active]:bg-white data-[state=active]:text-black"
                              >
                                Actions
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent value="info" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Business Name</Label>
                                  <p className="text-black mt-1">{selectedApplication.businessName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Business Type</Label>
                                  <p className="text-black mt-1">{selectedApplication.businessType}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Industry</Label>
                                  <p className="text-black mt-1">{selectedApplication.industry}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Contact Name</Label>
                                  <p className="text-black mt-1">{selectedApplication.contactName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                                  <p className="text-black mt-1">{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                                  <p className="text-black mt-1">{selectedApplication.phone}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-600">Business Address</Label>
                                <p className="text-black mt-1">{selectedApplication.address}</p>
                              </div>
                            </TabsContent>
                            <TabsContent value="documents" className="space-y-4">
                              <div className="space-y-3">
                                {renderDocumentRow(
                                  "businessRegistration",
                                  "Business Registration Certificate",
                                  selectedApplication.documents.businessRegistration,
                                )}
                                {renderDocumentRow(
                                  "taxIdCertificate",
                                  "Tax ID Certificate (EIN)",
                                  selectedApplication.documents.taxIdCertificate,
                                )}
                                {renderDocumentRow(
                                  "governmentId",
                                  "Government-Issued ID",
                                  selectedApplication.documents.governmentId,
                                )}
                                {renderDocumentRow(
                                  "utilityBill",
                                  "Utility Bill",
                                  selectedApplication.documents.utilityBill,
                                )}
                              </div>
                            </TabsContent>
                            <TabsContent value="actions" className="space-y-4">
                              <div className="flex gap-3">
                                <Button
                                  className="bg-black hover:bg-gray-800 text-white"
                                  onClick={() => updateApplicationStatus(selectedApplication.id, "approved")}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Application
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-gray-200 hover:bg-gray-50 bg-transparent"
                                  onClick={() => handleDeclineApplication(selectedApplication)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Decline Application
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-gray-200 hover:bg-gray-50 bg-transparent"
                                  onClick={() => updateApplicationStatus(selectedApplication.id, "pending")}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Mark as Pending
                                </Button>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="font-medium mb-2 text-black">Add Notes</h4>
                                <textarea
                                  className="w-full p-3 border border-gray-200 rounded-md focus:border-black focus:ring-black"
                                  rows={3}
                                  placeholder="Add internal notes about this application..."
                                />
                                <Button className="mt-3 bg-black hover:bg-gray-800 text-white" size="sm">
                                  Save Notes
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                    {application.status === "pending" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          className="bg-black hover:bg-gray-800 text-white h-8 w-8 p-0"
                          onClick={() => updateApplicationStatus(application.id, "approved")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 bg-transparent"
                          onClick={() => handleDeclineApplication(application)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-200 hover:bg-gray-50 h-8 w-8 p-0 bg-transparent"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Export Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                        <DropdownMenuItem>View History</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer Modal */}
        <Dialog open={!!viewingDocument} onOpenChange={() => setViewingDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-black">Document Viewer</DialogTitle>
              <DialogDescription>{viewingDocument?.name}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 min-h-[500px] border border-gray-200">
              {viewingDocument?.url && (
                <img
                  src={viewingDocument.url || "/placeholder.svg"}
                  alt={viewingDocument.name}
                  className="max-w-full max-h-[600px] object-contain rounded-lg"
                />
              )}
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setViewingDocument(null)} className="border-gray-200">
                Close
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white">Mark as Verified</Button>
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50 bg-transparent"
                onClick={() => {
                  setViewingDocument(null)
                  const docEntry = Object.entries(selectedApplication?.documents || {}).find(
                    ([_, doc]) => doc.url === viewingDocument?.url,
                  )
                  if (docEntry) {
                    handleRejectDocument(docEntry[0], viewingDocument?.name)
                  }
                }}
              >
                Reject Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDocumentRejectModal} onOpenChange={setShowDocumentRejectModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-black">Reject Document</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting the {documentToReject?.label} from{" "}
                {documentToReject?.application?.businessName}. An email notification will be sent to{" "}
                {documentToReject?.application?.email} requesting a better document upload.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-reject-reason" className="text-black">
                  Reason for Rejection
                </Label>
                <Textarea
                  id="document-reject-reason"
                  placeholder="Please specify what's wrong with the document (e.g., image too blurry, document expired, wrong document type)..."
                  value={documentRejectReason}
                  onChange={(e) => setDocumentRejectReason(e.target.value)}
                  rows={4}
                  className="mt-1 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">
                <p className="font-medium mb-1 text-black">Email will include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Document rejection notification</li>
                  <li>Specific reason for rejection</li>
                  <li>Instructions to upload a better quality document</li>
                  <li>Link to re-upload the document</li>
                </ul>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDocumentRejectModal(false)} className="border-gray-200">
                  Cancel
                </Button>
                <Button
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={sendDocumentRejectionNotification}
                  disabled={!documentRejectReason.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Rejection Notice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-black">Decline Application</DialogTitle>
              <DialogDescription>
                Provide a reason for declining {applicationToDecline?.businessName}'s application. An email notification
                will be sent to {applicationToDecline?.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="decline-reason" className="text-black">
                  Reason for Decline
                </Label>
                <Textarea
                  id="decline-reason"
                  placeholder="Please provide a clear reason for declining this application..."
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  rows={4}
                  className="mt-1 border-gray-200 focus:border-black focus:ring-black"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowDeclineModal(false)} className="border-gray-200">
                  Cancel
                </Button>
                <Button
                  className="bg-black hover:bg-gray-800 text-white"
                  onClick={sendDeclineNotification}
                  disabled={!declineReason.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Decline Notice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
