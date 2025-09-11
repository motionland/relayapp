import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AuthOptionsCard from "@/components/auth/AuthOption"

export default function AuthOptionPage() {
  const token = cookies().get("auth_token")?.value

  if (token) {
    redirect("/") 
  }

  return <AuthOptionsCard />;
}
