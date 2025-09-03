"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { StepOne } from "./StepOne"
import { StepTwo } from "./StepTwo"
import { StepPassword } from "./StepPassword"
import { useAppDispatch, useAppSelector } from "@/redux"
import { setError } from "@/redux/feature/authentication/authenticationSlice"

export function LoginCard() {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((s) => s.authentication)

  useEffect(() => {
    dispatch(setError(null))
  }, [dispatch])

  return (
    <Card className="border-0 shadow-xl bg-white">
      <CardHeader className="space-y-4 text-center pb-6">
        <div className="flex justify-center">
          <h3 className="text-md font-bold bg-orange-500 text-white p-2 rounded-full">M</h3>
        </div>
        <h2 className="text-2xl font-bold text-black">Sign in</h2>
        <p className="text-sm text-gray-600">
          or{" "}
          <Link href="#" className="text-orange-500 font-medium hover:underline">
            sign up for an account
          </Link>
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {auth.error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="font-medium">{auth.error}</AlertDescription>
          </Alert>
        )}

        {auth.loginCurrentStep === 1 && <StepOne />}
        {auth.loginCurrentStep === 2 && <StepTwo />}
        {auth.loginCurrentStep === 3 && <StepPassword />}
      </CardContent>
    </Card>
  )
}
