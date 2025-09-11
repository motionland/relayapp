import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { QrCode, Tag } from "lucide-react";
import React, { useState } from "react";
import { updateReceivingState, useAppDispatch } from "@/redux";
import MatrixScanner from "./matrix-scanner";

const ScanMetrixTracking = () => {
  const dispatch = useAppDispatch();
  const [carrierScannerOpen, setCarrierScannerOpen] = useState(false);
  const [carrierTrackingNumberTemp, setCarrierTrackingNumberTemp] =
    useState("");

  const onDetectCarrierTrackingNumber = (trackingNumber: string) => {
    setCarrierTrackingNumberTemp(trackingNumber);
    setCarrierScannerOpen(false);
    dispatch(updateReceivingState({ key: "carrierTracking", value: trackingNumber }));
  };

  const handleManualInput = (value: string) => {
    setCarrierTrackingNumberTemp(value);
    dispatch(updateReceivingState({ key: "carrierTracking", value: value }));
  };

  return (
    <>
      <div className="mt-3 mb-2">
        <p className="text-sm text-gray-500 mb-2">Carrier Tracking</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Please scan carrier tracking number"
              className="pl-9 pr-4"
              value={carrierTrackingNumberTemp || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                handleManualInput(newValue);
              }}
            />
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Button
            variant="outline"
            className="bg-gray-100"
            onClick={() => setCarrierScannerOpen(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Scan 2D matrix code on carrier label to capture tracking information
        </p>
      </div>
      {/* Carrier Tracking Scanner Dialog */}
      <Dialog
        open={carrierScannerOpen}
        onOpenChange={(open: boolean) => setCarrierScannerOpen(open)}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gray-50">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Scan Carrier Tracking Code</DialogTitle>
          </DialogHeader>
          <div className="relative h-80 bg-black flex items-center justify-center">
            {/* Custom scanner for 2D matrix codes with green contour */}
            <MatrixScanner onDetected={onDetectCarrierTrackingNumber} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanMetrixTracking;
