"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Box,
  Check,
  ChevronRight,
  Clock3,
  Package,
  Scan,
  Snowflake,
  Tag,
  X,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import OCRScanner from "./ocr-scanner";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";
import {
  useCreatePackage,
  CreatePackagePayload,
} from "@/hooks/use-package-creation";

const getPackageTypeInfo = (type: string | undefined) => {
  switch (type?.toUpperCase()) {
    case "FRAGILE":
      return {
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-amber-500 bg-amber-50 border-amber-200",
      };
    case "REFRIG":
      return {
        icon: <Snowflake className="h-4 w-4" />,
        color: "text-blue-500 bg-blue-50 border-blue-200",
      };
    case "URGENT":
      return {
        icon: <Clock3 className="h-4 w-4" />,
        color: "text-red-500 bg-red-50 border-red-200",
      };
    case "PERISHABLE":
      return {
        icon: <Package className="h-4 w-4" />,
        color: "text-purple-500 bg-purple-50 border-purple-200",
      };
    case "BOX":
    case "STANDARD":
    default:
      return {
        icon: <Box className="h-4 w-4" />,
        color: "text-gray-500 bg-gray-50 border-gray-200",
      };
  }
};

const Step1Receiving = () => {
  const { data: session } = useSession();
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();

  const [processingIndices, setProcessingIndices] = useState<number[]>([]);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const handleCompleteBatch = async () => {
    if (isBatchProcessing) return;
    setIsBatchProcessing(true);

    const { execute } = useCreatePackage();

    for (let i = 0; i < receivingState.scannedItems.length; i++) {
      setProcessingIndices((prev) => [...prev, i]);
      try {
        await execute(session!, {
          carrier_id: receivingState.scannedItems[i].carrier!.id,
          shipping_address_id:
            receivingState.scannedItems[i].shippingAddress!.id,
          warehouse_location_id:
            receivingState.scannedItems[i].warehouseLocationId!,
          customer_id: receivingState.scannedItems[i].customer?.id!,
          tracking_number: receivingState.scannedItems[i].carrierTracking!,
          arrival_time: receivingState.scannedItems[i].arrivalTime!,
          deadline_at: receivingState.scannedItems[i].deadlineTime!,
          weight: receivingState.scannedItems[i].weight!,
          dimensions: receivingState.scannedItems[i].dimension!,
          size_category:
            receivingState.scannedItems[i].shipping_size!.name.toLowerCase(),
          status: "delivered_to_locker",
          package_type_id: receivingState.scannedItems[i].package_type!.id,
          sender_from: receivingState.scannedItems[i].sender_name!,
          label_id: receivingState.scannedItems[i].labelId!,
          package_images: receivingState.scannedItems[i].capturedImages!,
        });
        dispatch(
          updateReceivingState({
            key: "scannedItems",
            value: receivingState.scannedItems.filter((_, idx) => idx !== i),
          })
        );
      } catch (error) {
        console.error(`Error processing item ${i}:`, error);
        // Optional: Add toast notification
      } finally {
        // Remove from processing
        setProcessingIndices((prev) => prev.filter((idx) => idx !== i));
      }
    }

    setIsBatchProcessing(false);
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="relative w-full mx-auto">
        <OCRScanner />

        {/* Scanned Items */}
        <div className="bg-white rounded-t-xl -mt-4 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">Scanned Items</h2>
              <div className="ml-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                {receivingState.scannedItems.length}
              </div>
            </div>
            <button>
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {receivingState.scannedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Package className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">
                  No items in current batch
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Scan items to add them to the current batch
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Scan className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </div>
            ) : (
              receivingState.scannedItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl relative">
                  {processingIndices.includes(idx) && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-xl">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                      <p className="ml-2 text-amber-600 font-medium">
                        Processing...
                      </p>
                    </div>
                  )}

                  <div className="flex items-start mb-3">
                    <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="font-medium truncate">
                      {item.currentLabel ||
                        `${item.customer?.full_name} package`}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm relative">
                    {/* Header with Package Type */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <p className="font-medium text-sm">Package Details</p>
                      </div>
                      {item.package_type && (
                        <div
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                            getPackageTypeInfo(item.package_type.name).color
                          }`}
                        >
                          {getPackageTypeInfo(item.package_type.name).icon}
                          <span className="uppercase">
                            {item.package_type.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Main content in a grid layout */}
                    <div className="p-3 space-y-3">
                      {/* Package Images */}
                      {item.capturedImages &&
                        item.capturedImages.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-1">
                              PACKAGE IMAGES
                            </p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {item.capturedImages.map((image, imgIdx) => (
                                <div
                                  key={imgIdx}
                                  className="relative h-16 w-16 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden border border-gray-200"
                                >
                                  <Image
                                    src={image}
                                    alt={`Package Image ${imgIdx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Package Information */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          PACKAGE INFO
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {item.dimension && (
                            <div className="bg-gray-50 rounded p-2 text-sm">
                              <p className="text-gray-500 text-xs">
                                Dimensions
                              </p>
                              <p className="font-medium">{item.dimension} cm</p>
                            </div>
                          )}
                          {item.weight && (
                            <div className="bg-gray-50 rounded p-2 text-sm">
                              <p className="text-gray-500 text-xs">Weight</p>
                              <p className="font-medium">{item.weight} kg</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Customer and Carrier Info */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">
                          CUSTOMER & CARRIER
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-gray-50 rounded p-2 text-center flex flex-col justify-center h-full">
                            <p className="text-sm font-bold items-center justify-center mx-auto">
                              {item?.customer?.full_name || "Unknown Carrier"}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-center">
                            <p className="text-xs text-gray-500">
                              CARRIER TRACKING #
                            </p>
                            <Badge className="bg-green-100 text-green-700 border-0 flex items-center justify-center mx-auto text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {item.carrierTracking || "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Storage Location */}
                      {item.warehouse && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">
                            STORAGE LOCATION
                          </p>
                          <div className="grid grid-cols-5 gap-1">
                            <div className="text-center bg-gray-50 rounded p-1">
                              <p className="text-xs text-gray-500">AREA</p>
                              <p className="text-sm font-bold">
                                {item.warehouse.area}
                              </p>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <p className="text-xs text-gray-500">ROW</p>
                              <p className="text-sm font-bold">
                                {item.warehouse.row}
                              </p>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <p className="text-xs text-gray-500">BAY</p>
                              <p className="text-sm font-bold">
                                {item.warehouse.bay}
                              </p>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <p className="text-xs text-gray-500">LEVEL</p>
                              <p className="text-sm font-bold">
                                {item.warehouse.level}
                              </p>
                            </div>
                            <div className="text-center bg-gray-50 rounded p-1">
                              <p className="text-xs text-gray-500">BIN</p>
                              <p className="text-sm font-bold">
                                {item.warehouse.bin}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with status */}
                  <div className="border-t border-gray-100 bg-gray-50 rounded-b-lg">
                    <div className="p-2 flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.labelId ? "bg-green-500" : "bg-amber-500"
                          }`}
                        ></div>
                        <p className="text-xs text-gray-500">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              item.labelId ? "text-green-600" : "text-amber-600"
                            }`}
                          >
                            {item.labelId ? "Processed" : "Pending"}
                          </span>
                          {item.labelId && (
                            <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
                              Available for pickup
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500">
                          Arrived:{" "}
                          {item.arrivalTime
                            ? format(new Date(item.arrivalTime), "PPP HH:mm")
                            : "N/A"}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add logic for expanding timeline if needed
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <ChevronRight className="h-4 w-4 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {receivingState.scannedItems.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <Button
                className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl flex items-center justify-center gap-2"
                onClick={handleCompleteBatch}
                disabled={isBatchProcessing}
              >
                {isBatchProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Batch...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5" />
                    Complete Batch
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1Receiving;
