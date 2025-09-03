"use client"

import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/redux"
import { ArrowLeft, Mail, Phone, Lock, Link as LinkIcon, Shield } from "lucide-react"
import {
  setLoginCurrentStep,
  setSelectedMethod,
} from "@/redux/feature/authentication"

export function StepTwo() {
  const dispatch = useAppDispatch()
  const { formData } = useAppSelector((state) => state.authentication)

  const methods = [
    {
      key: "password",
      title: "Enter password",
      desc: "Cannot login by password, your device is not verified",
      icon: <Lock className="h-4 w-4 text-gray-500" />,
      enabled: true,
    },
    // Contoh tambahan, nanti bisa diaktifkan:
    // {
    //   key: "otp-email",
    //   title: "Enter OTP code in your email",
    //   desc: `We sent a code to your registered email ${maskEmail(formData.email || "")}`,
    //   icon: <Mail className="h-4 w-4 text-gray-500" />,
    //   enabled: true,
    // },
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {methods.map((m) => (
          <div
            key={m.key}
            className={`flex flex-col items-start p-2 rounded-md ${
              m.enabled ? "hover:bg-gray-50 cursor-pointer" : "opacity-60"
            }`}
          >
            <div className="flex items-center gap-2">
              {m.icon}
              <span className={`font-medium ${!m.enabled ? "line-through" : ""}`}>
                {m.title}
              </span>
            </div>
            <p className="text-sm text-gray-600">{m.desc}</p>

            {m.enabled && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  dispatch(setSelectedMethod(m.key as any))
                  if (m.key === "password") {
                    dispatch(setLoginCurrentStep(3))
                  }
                }}
              >
                Continue
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => dispatch(setLoginCurrentStep(1))}
          className="text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Not you? login to another account
        </Button>
      </div>
    </div>
  )
}

function maskEmail(email: string) {
  if (!email) return ""
  const [user, domain] = email.split("@")
  if (!user || !domain) return email
  return user[0] + "***" + user.slice(-1) + "@" + domain
}
