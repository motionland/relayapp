import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AuthOptionsCard from "@/components/auth/AuthOption"
import VerifyEmailCard from "@/components/auth/VerifyEmail"

export default function VerifyEmailPage() {
  const token = cookies().get("auth_token")?.value

  if (token) {
    redirect("/") 
  }

  return <VerifyEmailCard />;
}
