import { Loader2 } from "lucide-react"

export default function SignupLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  )
}
