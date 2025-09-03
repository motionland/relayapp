"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { PhoneInput } from "@/components/ui/phone-input"
import { ArrowRight, Mail, PhoneCall } from "lucide-react"
import {
  setFormField,
  setAuthMethod,
  setLoginCurrentStep,
  setError,
} from "@/redux/feature/authentication"
import { detectCountryCode, useAppDispatch, useAppSelector } from "@/redux"
import { requestLogin } from "@/redux/feature/authentication/authenticationThunks"

export function StepOne() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(state => state.authentication)
  const authMethod = auth.authMethod
  const formData = auth.formData as {
    email?: string
    phone?: string
    remember?: boolean
  }

  const handleInputChange = (field: string, value: any) => {
    dispatch(setFormField({ field: field as any, value }))
    // clear error if any
    if (auth.error) dispatch(setError(null))
  }

  const onToggleMethod = () => {
    const next = authMethod === "email" ? "phone" : "email"
    dispatch(setAuthMethod(next))
    dispatch(setError(null))
  }

  const onContinue = async () => {
    if (authMethod === "email") {
      if (!auth.formData.email || auth.formData.email.trim() === "") {
        dispatch(setError("Please enter your email address"))
        return
      }
      
      await dispatch(
        requestLogin({
          email: formData.email,
          remember: formData.remember
        })
      )
    } else {
      if (!auth.formData.phone || String(auth.formData.phone).trim() === "") {
        dispatch(setError("Please enter your phone number"))
        return
      }

      await dispatch(
        requestLogin({
          phone: formData.phone,
          countryCode: detectCountryCode(auth.formData.phone),
          remember: formData.remember
        })
      )
    }
  }

  return (
    <div className="space-y-4">
      {authMethod === "email" && (
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </Label>

          <Input
            id="email"
            type="email"
            value={formData.email ?? ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="h-12"
          />

          <div className="flex items-center space-x-2 pt-1">
            <Checkbox
              id="remember"
              checked={!!formData.remember}
              onCheckedChange={(checked) => handleInputChange("remember", checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
              Remember me
            </Label>
          </div>
        </div>
      )}

      {authMethod === "phone" && (
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <PhoneInput
            id="phone"
            defaultCountry="US"
            value={formData.phone ?? ""}
            onChange={(val) => handleInputChange("phone", val)}
            className="h-12"
          />
        </div>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onToggleMethod}
          className="h-12 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          {authMethod === "email" ? "Use Phone" : "Use Email"}
          {authMethod === "email" ? (
            <PhoneCall className="ml-2 h-5 w-5" />
          ) : (
            <Mail className="ml-2 h-5 w-5" />
          )}
        </Button>

        <Button
          type="button"
          onClick={onContinue}
          className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-md transition-all duration-200"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default StepOne
