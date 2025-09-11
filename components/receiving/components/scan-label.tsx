import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Barcode, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RealtimeScanner from "./realtime-scanner";
import { updateReceivingState, useAppDispatch } from "@/redux";

type LabelJson = {
  label_id: number;
  package_id: string;
  package_type: string;
  package_urgency: string;
  area: string;
  row: string;
  bay: string;
  level: string;
  bin_id: string;
  warehouse_location_id: number;
  warehouse: string;
};

const ScanLabel = () => {
  const dispatch = useAppDispatch();
  const [scannerOpen, setScannerOpen] = React.useState(false);
  const [labelJson, setLabelJson] = React.useState<string | null>(null);

  // Remove mock data - allow manual input only
  useEffect(() => {
    // Initialize with empty state
  }, []);

  const onDetectLabelJson = (labelJson: string) => {
    setLabelJson(labelJson);
    setScannerOpen(false);
    try {
      const parsedLabelJson = JSON.parse(labelJson) as LabelJson;
      // Example data format: {"label_id":4,"package_id":"ZMPKG-20250811-0004","package_type":"BOX","package_urgency":"unknown","area":"A01","row":"R01","bay":"B01","level":"L01","bin_id":"Bin001","warehouse_location_id":1,"warehouse":"-"}
      dispatch(updateReceivingState({ key: "labelId", value: parsedLabelJson.label_id }));
      dispatch(updateReceivingState({ key: "labelWarehouse", value: parsedLabelJson.warehouse }));
      dispatch(updateReceivingState({ key: "warehouseLocationId", value: parsedLabelJson.warehouse_location_id }));
    } catch (error) {
      console.error("Invalid JSON format");
    }
  };

  return (
    <>
      <p className="text-sm text-gray-500 mb-2">Scan Internal Label (JSON):</p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Enter or scan warehouse label"
            className="pl-9 pr-4"
            value={labelJson || ""}
            onChange={(e) => {
              setLabelJson(e.target.value);
              // Try to parse and update state if valid JSON
              try {
                const parsed = JSON.parse(e.target.value);
                if (parsed.label_id !== undefined) {
                  dispatch(updateReceivingState({ key: "labelId", value: parsed.label_id }));
                }
                if (parsed.warehouse !== undefined) {
                  dispatch(updateReceivingState({ key: "labelWarehouse", value: parsed.warehouse }));
                }
                if (parsed.warehouse_location_id !== undefined) {
                  dispatch(updateReceivingState({ key: "warehouseLocationId", value: parsed.warehouse_location_id }));
                }
              } catch (error) {
                // Not valid JSON yet, that's okay
              }
            }}
          />
          <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <Button
          variant="outline"
          className="bg-gray-100"
          onClick={() => setScannerOpen(true)}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Scanner Dialog */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-gray-50">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Scan Warehouse Label</DialogTitle>
          </DialogHeader>
          <div className="relative h-80 bg-black flex items-center justify-center">
            <RealtimeScanner
              onDetected={onDetectLabelJson}
              onUseScanner={scannerOpen}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanLabel;
