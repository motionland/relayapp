import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginCard } from "@/components/auth/LoginCard"

export default function AdminLoginPage() {
  const token = cookies().get("auth_token")?.value

  if (token) {
    redirect("/my-metro") 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-200 via-white to-slate-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <LoginCard />
      </div>
    </div>
  )
}
