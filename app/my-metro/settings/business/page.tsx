"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Building2, MapPin, Upload, CheckCircle, Users, Sparkles } from "lucide-react"

import WelcomeStep from "./__components/wizard/steps/WelcomeStep"
import BusinessInfoStep from "./__components/wizard/steps/BusinessInfoStep"
import AddressStep from "./__components/wizard/steps/AddressStep"
import DocumentsStep from "./__components/wizard/steps/DocumentsStep"
import TeamStep from "./__components/wizard/steps/TeamStep"
import CompleteStep from "./__components/wizard/steps/CompleteStep"

import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { setData, setUploadProgress, setStatus } from "@/redux/feature/business"

const steps = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "business", title: "Business Info", icon: Building2 },
  { id: "address", title: "Address", icon: MapPin },
  { id: "documents", title: "Documents", icon: Upload },
  { id: "team", title: "Team", icon: Users },
  { id: "complete", title: "Complete", icon: CheckCircle },
]

const defaults = {
  businessName: "",
  businessType: "",
  role: "",
  industry: "",
  taxId: "",
  contactName: "",
  phone: "",
  email: "",
  address: "",
  suite: "",
  city: "",
  state: "",
  zipCode: "",
  notificationPreference: "",
  agreeToTerms: false,
  documents: {},
  teamMembers: [{ type: "hashtag", value: "" }],
};

export default function BusinessApplicationPage() {
  const dispatch = useDispatch<AppDispatch>()
  const business = useSelector((s: RootState) => s.business)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<any>({ ...defaults, ...(business.data || {}) });


  const nextStep = () => {
    // simpan partial ke redux setiap next
    dispatch(setData(formData))
    dispatch(setStatus("saving"))
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleUpload = async (field: string, file: File) => {
    // contoh progress simulasi — ganti dengan axios onUploadProgress saat implementasi API
    dispatch(setUploadProgress(0))
    for (let i = 1; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 40))
      dispatch(setUploadProgress(i))
    }
    // after upload, store file reference in local formData and redux
    const newDocuments = { ...(formData.documents || {}), [field]: file }
    setFormData({ ...formData, documents: newDocuments })
    dispatch(setData({ ...formData, documents: newDocuments }))
    dispatch(setUploadProgress(null))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={nextStep} />
      case 1:
        return <BusinessInfoStep formData={formData} setFormData={setFormData} />
      case 2:
        return <AddressStep formData={formData} setFormData={setFormData} />
      case 3:
        return <DocumentsStep onUpload={handleUpload} />
      case 4:
        return <TeamStep formData={formData} setFormData={setFormData} />
      case 5:
        return <CompleteStep onDone={() => (window.location.href = "/")} />
      default:
        return null
    }
  }

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        {currentStep === 0 ? (
          <div className="px-4">{renderStepContent()}</div>
        ) : (
          <div className="px-4">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CurrentIcon className="h-6 w-6 text-black" />
                <div>
                  <h2 className="text-xl font-semibold text-black">{steps[currentStep].title}</h2>
                  <p className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </p>
                </div>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div>
              {renderStepContent()}

              {currentStep > 0 && currentStep < steps.length - 1 && (
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} className="border-gray-300 bg-transparent">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={nextStep} className="bg-black hover:bg-gray-800">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
