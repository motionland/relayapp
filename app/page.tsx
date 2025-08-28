import Link from "next/link"
import { Shield, Package, ScanLine, ScanFaceIcon, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Metro Package System</h1>
          <p className="text-gray-600">Choose your portal to get started</p>
        </header>

        <section className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {/* Admin Portal */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Admin Portal</h2>
              <p className="text-gray-600 mb-4">Metro Admin</p>
              <Link href="/admin">
                <Button variant="outline" className="w-full bg-transparent">
                  Access Admin
                </Button>
              </Link>
            </div>

            {/* My Metro */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">My Metro</h2>
              <p className="text-gray-600 mb-4">Customers Portal</p>
              <Link href="/my-metro">
                <Button variant="outline" className="w-full bg-transparent">
                  View Packages
                </Button>
              </Link>
            </div>

            {/* Warehouse Scanner */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <ScanLine className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Warehouse Scanner</h2>
              <p className="text-gray-600 mb-4">Package scanning </p>
              <Link href="/scanner">
                <Button variant="outline" className="w-full bg-transparent">
                  Open Scanner
                </Button>
              </Link>
            </div>

            {/* POS Kiosk */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <ScanFaceIcon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Kiosk</h2>
              <p className="text-gray-600 mb-4">Metro Staff </p>
              <Link href="/pos">
                <Button variant="outline" className="w-full bg-transparent">
                  Open POS
                </Button>
              </Link>
            </div>

            {/* Carrier Partner Kiosk */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <Truck className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Carrier Partners</h2>
              <p className="text-gray-600 mb-4">FedEx, UPS, Amazon </p>
              <Link href="/carriers">
                <Button variant="outline" className="w-full bg-transparent">
                  Open Dropoff Kiosk
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
