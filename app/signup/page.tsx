"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+1")
  const [showCountrySelector, setShowCountrySelector] = useState(false)

  const countries = [
    { code: "+1", flag: "🇺🇸", name: "United States" },
    { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+1", flag: "🇨🇦", name: "Canada" },
    { code: "+61", flag: "🇦🇺", name: "Australia" },
    { code: "+33", flag: "🇫🇷", name: "France" },
    { code: "+49", flag: "🇩🇪", name: "Germany" },
  ]

  const handleNext = () => {
    console.log("Email:", email)
    console.log("Phone:", countryCode + phoneNumber)
    // Add navigation to next step here
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center mb-2">Sign up</h1>
        <p className="text-center mb-8">
          or{" "}
          <Link href="/login" className="text-orange-500 hover:text-orange-600">
            sign in to your account
          </Link>
        </p>

        {/* Progress indicator */}
        <div className="relative mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 font-medium">
                01
              </div>
              <div className="mt-2 text-sm font-medium">Create your account</div>
              <p className="text-xs text-gray-500 text-center mt-1 max-w-[200px]">
                Start your journey with us. Just a few simple steps to set up your account
              </p>
            </div>

            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 font-medium">
                02
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-6 mb-8">
            <div className="w-1/2 h-full bg-orange-500 rounded-full"></div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full py-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <div className="relative">
              <div className="flex rounded-md border border-gray-300 overflow-hidden">
                {/* Country code selector */}
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center justify-center h-full px-3 bg-gray-50 border-r border-gray-300"
                    onClick={() => setShowCountrySelector(!showCountrySelector)}
                  >
                    <span className="mr-1">🇺🇸</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Country dropdown */}
                  {showCountrySelector && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {countries.map((country) => (
                          <button
                            key={country.name}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                            onClick={() => {
                              setCountryCode(country.code)
                              setShowCountrySelector(false)
                            }}
                          >
                            <span className="mr-2">{country.flag}</span>
                            <span>{country.name}</span>
                            <span className="ml-auto text-gray-500">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone input */}
                <input
                  type="tel"
                  id="phone"
                  className="flex-1 py-3 px-4 block w-full focus:outline-none"
                  placeholder="(201) 555-0123"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Next button */}
          <div className="flex justify-end mt-8">
            <Button onClick={handleNext} className="bg-orange-500 hover:bg-orange-600 text-white px-8">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
