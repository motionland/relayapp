"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, Settings, Menu, Info, MoreVertical, Truck, User, History } from "lucide-react"

export default function WarehouseComponents() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Warehouse Scanner UI Components</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package Status Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Pending</Badge>
          <Badge variant="secondary">Processing</Badge>
          <Badge variant="outline">Shipped</Badge>
          <Badge variant="destructive">Cancelled</Badge>
          <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package Information Accordion</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Package Details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  <strong>ID:</strong> P-20250307-12345
                </p>
                <p>
                  <strong>Location:</strong> A01-R01-B01-L05
                </p>
                <p>
                  <strong>Weight:</strong> 2.5 kg
                </p>
                <p>
                  <strong>Dimensions:</strong> 30cm x 20cm x 15cm
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Shipping Information</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <p>
                  <strong>Carrier:</strong> Express Delivery
                </p>
                <p>
                  <strong>Tracking:</strong> EX123456789
                </p>
                <p>
                  <strong>Estimated Delivery:</strong> March 30, 2025
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Confirmation Dialog</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Cancel Pickup</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will cancel the current pickup process and all progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No, continue pickup</AlertDialogCancel>
              <AlertDialogAction>Yes, cancel pickup</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package Details Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View Package Details</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Package P-20250307-12345</DialogTitle>
              <DialogDescription>Detailed information about this package.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Status:</span>
                <Badge className="col-span-3">Ready for Pickup</Badge>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Location:</span>
                <span className="col-span-3">Warehouse A01, Bin A01-R01-B01-L05</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right font-medium">Arrived:</span>
                <span className="col-span-3">March 25, 2025</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="button">Print Label</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Warehouse Location Selector</h2>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select warehouse location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a01">Warehouse A01</SelectItem>
            <SelectItem value="a02">Warehouse A02</SelectItem>
            <SelectItem value="b01">Warehouse B01</SelectItem>
            <SelectItem value="c01">Warehouse C01</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package History Tabs</h2>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="p-4 border rounded-md mt-2">
            <h3 className="font-medium">Package Details</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Package ID: P-20250307-12345
              <br />
              Weight: 2.5 kg
              <br />
              Dimensions: 30cm x 20cm x 15cm
            </p>
          </TabsContent>
          <TabsContent value="history" className="p-4 border rounded-md mt-2">
            <h3 className="font-medium">Package History</h3>
            <ul className="text-sm text-muted-foreground mt-2 space-y-2">
              <li>March 25, 2025 - Arrived at warehouse</li>
              <li>March 24, 2025 - Shipped from distribution center</li>
              <li>March 23, 2025 - Order processed</li>
            </ul>
          </TabsContent>
          <TabsContent value="notes" className="p-4 border rounded-md mt-2">
            <h3 className="font-medium">Notes</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Handle with care. Customer requested delivery notification.
            </p>
          </TabsContent>
        </Tabs>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package Actions Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreVertical className="h-4 w-4 mr-2" />
              Package Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Package className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Truck className="h-4 w-4 mr-2" />
              Schedule Delivery
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              Assign to Employee
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Mark as Missing</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Help Tooltips</h2>
        <div className="flex items-center gap-2">
          <span>Scan Barcode</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Position the barcode within the green guide on the camera screen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Mobile Navigation</h2>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Warehouse App</SheetTitle>
              <SheetDescription>Navigation menu for warehouse operations.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <Button variant="ghost" className="justify-start">
                <Package className="h-4 w-4 mr-2" />
                Scan Packages
              </Button>
              <Button variant="ghost" className="justify-start">
                <Truck className="h-4 w-4 mr-2" />
                Deliveries
              </Button>
              <Button variant="ghost" className="justify-start">
                <History className="h-4 w-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Package List Table</h2>
        <Table>
          <TableCaption>List of packages ready for pickup</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Package ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>P-20250307-12345</TableCell>
              <TableCell>A01-R01-B01-L05</TableCell>
              <TableCell>
                <Badge>Ready</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>P-20250307-67890</TableCell>
              <TableCell>A01-R02-B02-L10</TableCell>
              <TableCell>
                <Badge>Ready</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>P-20250307-54321</TableCell>
              <TableCell>A01-R03-B03-L15</TableCell>
              <TableCell>
                <Badge>Ready</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
