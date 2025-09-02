import Link from "next/link"
import { Shield, Package, ScanLine, ScanFaceIcon, Truck, Building2, Users, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        <section className="container mx-auto px-4 mt-5">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  Business Application
                </CardTitle>
                <CardDescription>Apply for a business account to access our premium mail services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    Secure document verification
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-green-600" />
                    Team member management
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    Fast approval process
                  </div>
                  <Link href="/my-metro/settings/business">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Application</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  Admin Dashboard
                </CardTitle>
                <CardDescription>Manage and review business applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FileCheck className="h-4 w-4 text-green-600" />
                    Review applications
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-600" />
                    Verify documents
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building2 className="h-4 w-4 text-green-600" />
                    Approve/decline accounts
                  </div>
                  <Link href="/admin/bussiness-applications">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Admin Access</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
