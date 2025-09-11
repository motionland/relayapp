"use client";
import { Barcode, Camera, Check, QrCode, Search, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import ScanLabel from "./scan-label";
import ScanMetrixTracking from "./scan-matrix-tracking";
import CarrierSelector from "./carrier-selector";
import ArrivalTimeSelector from "./arrival-time-selector";
import ShippingAddressSelector from "./shipping-address-selector";
import WeightInput from "./weight-input";
import SenderInput from "./sender-input";
import PackageTypeSelector from "./package-type-selector";
import ShippingSizeSelector from "./shipping-size-selector";
import DeadlineTimeSelector from "./deadline-time-selector";
import DimensionInput from "./dimansion-input";
import { addScannedItem, resetReceiving, updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";

const Step4Receiving = () => {
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();
  const [showFullImage, setShowFullImage] = useState(false);
  console.log(receivingState);

  // Disable "Complete" button if critical fields are missing
  const isCompleteDisabled = !(
    receivingState.package_type &&
    receivingState.shipping_size &&
    receivingState.warehouseLocationId &&
    receivingState.dimension &&
    receivingState.weight &&
    receivingState.capturedImages.length > 0
  );

  const handleComplete = () => {
    dispatch(addScannedItem());
    dispatch(resetReceiving());
    dispatch(updateReceivingState({ key: "currentStep", value: 1 }));
  };

  return (
    <>
      <div className="p-4 space-y-6">
        <div>
          <h2 className="text-xl font-medium mb-1">
            Step 4: Associate Warehouse Label
          </h2>
          <p className="text-gray-500 text-sm">
            Scan or enter the warehouse label for this package
          </p>
        </div>

        {receivingState.customer && (
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">
                  {receivingState.customer.shipping_code}
                </p>
                <p className="text-sm text-gray-500">Customer Code</p>
              </div>
            </div>

            {receivingState.capturedImages.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-500">
                    Package Images with Metro Label (
                    {receivingState.capturedImages.length})
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 p-0 h-auto"
                    onClick={() => setShowFullImage(true)}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    <span className="text-xs">View gallery</span>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {receivingState.capturedImages.slice(0, 3).map((img, index) => (
                    <div
                      key={index}
                      className="relative h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Package ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                        <Camera className="h-2 w-2 inline-block mr-0.5" />
                        {index + 1}
                      </div>
                    </div>
                  ))}
                  {receivingState.capturedImages.length > 3 && (
                    <div
                      className="relative h-28 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer"
                      onClick={() => setShowFullImage(true)}
                    >
                      <div className="bg-black/50 absolute inset-0 flex items-center justify-center text-white font-medium">
                        +{receivingState.capturedImages.length - 3} more
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                    <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                    Metro Label
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                    <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                    Package
                  </div>
                  <div className="bg-gray-100 rounded p-2 text-center text-xs text-gray-600">
                    <Check className="h-3 w-3 mx-auto mb-1 text-green-500" />
                    Clear Images
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <ScanLabel />
              <ScanMetrixTracking />
              <CarrierSelector />
              <ShippingAddressSelector />
              <ArrivalTimeSelector />
              <DeadlineTimeSelector />
              <WeightInput />
              <DimensionInput />
              <SenderInput />
              <PackageTypeSelector />
              <ShippingSizeSelector />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => dispatch(updateReceivingState({ key: "currentStep", value: 3 }))}
              >
                Back
              </Button>
              <Button
                className="flex-1 bg-black hover:bg-gray-800 text-white"
                onClick={handleComplete}
                disabled={isCompleteDisabled}
              >
                Complete
                <Check className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-gray-50">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>
              Package Images ({receivingState.capturedImages.length})
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {receivingState.capturedImages.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group"
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Package Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index < 6}
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  <Camera className="h-3 w-3 inline-block mr-1" />
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4">
            <Button className="w-full" onClick={() => setShowFullImage(false)}>
              Close Gallery
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Step4Receiving;
