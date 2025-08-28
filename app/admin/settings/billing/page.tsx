"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function BillingPage() {
  return (
    <>
      <div className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Billing</h1>
          </div>

          {/* Billing Summary Card */}
          <Card>
            <CardHeader>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Next invoice issue date</p>
                  <p className="text-lg font-semibold">Apr 24, 2025</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan Name</p>
                  <p className="text-lg font-semibold">Personal</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Packages</p>
                  <p className="text-lg font-semibold">100</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice total</p>
                  <p className="text-lg font-semibold">$1.99</p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Change Plan
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Invoices</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Monthly Packages</TableHead>
                          <TableHead>Invoice Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Jan 2, 2025</TableCell>
                          <TableCell>Personal (monthly)</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>$0.00</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="w-fit">Paid</Badge>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium text-left">
                                View invoice
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoices" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Monthly Packages</TableHead>
                          <TableHead>Invoice Total</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Jan 2, 2025</TableCell>
                          <TableCell>Personal (monthly)</TableCell>
                          <TableCell>0</TableCell>
                          <TableCell>$0.00</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <Badge variant="secondary" className="w-fit">Paid</Badge>
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium text-left">
                                View invoice
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="payment-methods" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground">No payment methods added yet.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="billing-address" className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
                <Card>
                  <CardContent>
                    <p className="text-muted-foreground">No billing address set.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
