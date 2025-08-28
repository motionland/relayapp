"use client"
import PickupHistory from "@/components/pickup-history"
import MobileFooter from "@/components/mobile-footer"
import { useRouter } from "next/navigation"
import ScannerHeader from "@/components/scanner-header"

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto">
        {/* Scanner Header */}
        <ScannerHeader />

        <div className="px-4">
          <PickupHistory visible={true} />
        </div>
      </div>

      {/* Mobile Footer Navigation */}
      <MobileFooter />
    </div>
  )
}
