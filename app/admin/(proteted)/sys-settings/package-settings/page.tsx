"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Save, Plus, MoreHorizontal, Edit, Trash2, Package, AlertTriangle, CheckCircle } from "lucide-react"

export default function PackageSettingsPage() {
  const packageTypes = [
    {
      id: 1,
      code: "STANDARD",
      name: "Standard Package",
      description: "Regular shipping with standard handling",
    },
    {
      id: 2,
      code: "PERISHABLE",
      name: "Perishable Items",
      description: "Items that can spoil or expire",
    },
    {
      id: 3,
      code: "URGENT",
      name: "Urgent Delivery",
      description: "Priority shipping with expedited handling",
    },
    {
      id: 4,
      code: "FRAGILE",
      name: "Fragile Items",
      description: "Items requiring careful handling",
    },
    {
      id: 5,
      code: "MAILER",
      name: "Envelope Mailer",
      description: "Document or small item envelope",
    },
    {
      id: 6,
      code: "REFRIG",
      name: "Refrigerated",
      description: "Items requiring temperature control",
    },
  ]

  const pickupUrgencyTypes = [
    {
      id: 1,
      color: "bg-red-500",
      code: "IMMEDIATE",
      name: "Immediate Pickup",
      description: "Must be picked up right away (highest urgency).",
    },
    {
      id: 2,
      color: "bg-orange-500",
      code: "SAME_DAY",
      name: "Same-Day Pickup",
      description: "Pickup before the end of the business day.",
    },
    {
      id: 3,
      color: "bg-blue-500",
      code: "SCHEDULED",
      name: "Scheduled Pickup",
      description: "Pickup at a specific pre-arranged time slot.",
    },
    {
      id: 4,
      color: "bg-yellow-500",
      code: "PRIORITY",
      name: "Priority Pickup",
      description: "Pickup as soon as possible, but not emergency L...",
    },
    {
      id: 5,
      color: "bg-purple-500",
      code: "TEMP_SENSITIVE",
      name: "Temperature-Sensitive Pickup",
      description: "Pickup urgently to maintain temperature.",
    },
    {
      id: 6,
      color: "bg-yellow-500",
      code: "FRAGILE",
      name: "Fragile Handling Required",
      description: "Pickup needs careful, gentle handling.",
    },
    {
      id: 7,
      color: "bg-green-500",
      code: "STANDARD",
      name: "Standard Pickup",
      description: "Normal pickup, no urgency.",
    },
    {
      id: 8,
      color: "bg-gray-400",
      code: "DEFERRED",
      name: "Deferred Pickup",
      description: "Can be held for pickup later, very low urgency.",
    },
  ]

  const carriers = [
    { id: 1, name: "FedEx", code: "FEDEX", apiKey: "••••••••••••", status: "Connected", lastSync: "2 hours ago" },
    { id: 2, name: "UPS", code: "UPS", apiKey: "••••••���•••••", status: "Connected", lastSync: "1 hour ago" },
    { id: 3, name: "USPS", code: "USPS", apiKey: "••••••••••••", status: "Connected", lastSync: "30 minutes ago" },
    { id: 4, name: "DHL", code: "DHL", apiKey: "Not configured", status: "Disconnected", lastSync: "Never" },
  ]

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Package Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configure package types, carrier integrations, and pickup urgency levels.
        </p>
      </div>

      <Tabs defaultValue="carriers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="carriers">Carriers</TabsTrigger>
          <TabsTrigger value="package-types">Package Types</TabsTrigger>
          <TabsTrigger value="pickup-urgency">Pickup Urgency Types</TabsTrigger>
        </TabsList>

        {/* Carriers Tab */}
        <TabsContent value="carriers" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Carrier Integrations</CardTitle>
                <CardDescription>Manage shipping carrier API connections and settings</CardDescription>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Carrier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carriers.map((carrier) => (
                      <TableRow key={carrier.id}>
                        <TableCell className="font-medium">{carrier.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{carrier.code}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{carrier.apiKey}</TableCell>
                        <TableCell>
                          <Badge
                            variant={carrier.status === "Connected" ? "default" : "destructive"}
                            className={
                              carrier.status === "Connected"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }
                          >
                            {carrier.status === "Connected" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {carrier.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500 dark:text-gray-400">{carrier.lastSync}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="mr-2 h-4 w-4" />
                                Test Connection
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Settings</CardTitle>
              <CardDescription>Configure global carrier behavior and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingUpdateFreq">Tracking Update Frequency</Label>
                  <Select defaultValue="hourly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failoverCarrier">Failover Carrier</Label>
                  <Select defaultValue="ups">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="autoFailover" defaultChecked />
                <Label htmlFor="autoFailover">Enable automatic failover to backup carrier</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="trackingNotifications" defaultChecked />
                <Label htmlFor="trackingNotifications">Send tracking update notifications</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Package Types Tab */}
        <TabsContent value="package-types" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Package Types</h2>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Package Type
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">Code</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">Name</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packageTypes.map((type) => (
                      <TableRow key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="font-mono text-sm py-4 px-6">{type.code}</TableCell>
                        <TableCell className="font-medium py-4 px-6">{type.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 py-4 px-6">{type.description}</TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pickup Urgency Types Tab */}
        <TabsContent value="pickup-urgency" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Warehouse Package Pickup Urgency Types</h2>
            <Button className="bg-black hover:bg-gray-800 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Urgency Type
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b">
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">Color</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">Code</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">Name</TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6">
                        Description
                      </TableHead>
                      <TableHead className="text-gray-600 dark:text-gray-400 font-medium py-4 px-6 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pickupUrgencyTypes.map((urgency) => (
                      <TableRow key={urgency.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell className="py-4 px-6">
                          <div className={`w-4 h-4 rounded-full ${urgency.color}`}></div>
                        </TableCell>
                        <TableCell className="font-mono text-sm py-4 px-6">{urgency.code}</TableCell>
                        <TableCell className="font-medium py-4 px-6">{urgency.name}</TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-400 py-4 px-6">
                          {urgency.description}
                        </TableCell>
                        <TableCell className="py-4 px-6">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Changes */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline">Reset to Defaults</Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Save Package Settings
        </Button>
      </div>
    </div>
  )
}
