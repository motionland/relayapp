"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(30)

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle key press for backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()
    if (!/^\d+$/.test(pastedData)) return

    const digits = pastedData.slice(0, 6).split("")
    const newOtp = [...otp]

    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit
      }
    })

    setOtp(newOtp)

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "")
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  // Handle resend OTP
  const handleResend = () => {
    setResendDisabled(true)
    setCountdown(30)
    // Add API call to resend OTP here
    console.log("Resending OTP...")
  }

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      setResendDisabled(false)
    }
    return () => clearTimeout(timer)
  }, [resendDisabled, countdown])

  // Handle next button click
  const handleNext = () => {
    const otpValue = otp.join("")
    if (otpValue.length === 6) {
      console.log("Verifying OTP:", otpValue)
      // Add verification logic here
      router.push("/dashboard") // Redirect to dashboard or next step
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="max-w-md w-full mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-2">Verification</h1>
        <p className="text-gray-500 text-center mb-8">We sent a verification code to your phone</p>

        {/* OTP Input */}
        <div className="mb-8">
          <div className="flex gap-2 justify-between">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 border border-gray-300 rounded-md text-center text-lg font-medium focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            ))}
          </div>
        </div>

        {/* Resend button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleResend}
            disabled={resendDisabled}
            className="text-black font-medium px-4 py-2 rounded-md hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-transparent"
          >
            {resendDisabled ? `Resend code in ${countdown}s` : "Resend code"}
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="space-y-4">
          <Button
            onClick={handleNext}
            disabled={otp.join("").length !== 6}
            className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-md disabled:bg-gray-300"
          >
            Verify
          </Button>

          <Link href="/login" className="block text-center">
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 py-3 rounded-md">
              Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
