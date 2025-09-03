"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Cookies from "js-cookie"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Lock } from "lucide-react"
import {
  setLoginCurrentStep,
  setError,
} from "@/redux/feature/authentication"
import { useAppDispatch, useAppSelector } from "@/redux"
import { loginWithPasswordOrPin } from "@/redux/feature/authentication/authenticationThunks"
import { useRouter, usePathname } from "next/navigation"

export function StepPassword() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const patchname = usePathname()
  const { formData, isLoading, tokenLogin, error } = useAppSelector(
    (s) => s.authentication
  )

  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      dispatch(setError("Password required"))
      return
    }
    if (!tokenLogin) {
      dispatch(setError("Login token not found, please retry login"))
      return
    }

    await dispatch(
      loginWithPasswordOrPin({
        login_token: tokenLogin,
        password,
      })
    )
    router.refresh()
  }

  useEffect(() => {
    const authToken = Cookies.get("auth_token")
    if (authToken) {
      if(patchname.startsWith("/admin")) {
        router.push("/admin")
      } else {
        router.push("/my-metro")
      }
    }
  }, [router])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-500" />
          Password
        </Label>

        <p className="text-sm text-gray-600">
          {formData.email ? (
            <>Signing in as <span className="font-medium">{maskEmail(formData.email)}</span></>
          ) : formData.phone ? (
            <>Signing in with <span className="font-medium">{formData.phone}</span></>
          ) : null}
        </p>

        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12"
          placeholder="Enter your password"
          autoFocus
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => dispatch(setLoginCurrentStep(2))}
          className="flex-1 h-12"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>
  )
}

function maskEmail(email?: string) {
  if (!email) return ""
  const [user, domain] = email.split("@")
  if (!user || !domain) return email
  if (user.length <= 2) return `${user[0]}***@${domain}`
  return `${user[0]}***${user.slice(-1)}@${domain}`
}
