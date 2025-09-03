import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = cookies().get("auth_token")?.value
  
    if (!token) {
      redirect("/auth/login") 
    }
  return children
}
