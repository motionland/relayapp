import React, { useEffect, useState } from "react";
import RealtimeScanner from "./realtime-scanner";
import CustomerBarcodeInput from "./customer-barcode-input";
import { useAppDispatch } from "@/redux";
import { updatePickupState } from "@/redux/feature/pickup";
import { useCustomerLookup } from "@/hooks/use-customer-lookup";

const Step1Pickup = () => {
  const dispatch = useAppDispatch();
  const [customerBarcode, setCustomerBarcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useScanner, setUseScanner] = useState(true);

  const { data: customerData, isLoading, isError, lookupCustomer } = useCustomerLookup();
  const isFetched = !!customerData;

  useEffect(() => {
    if (customerBarcode) {
      lookupCustomer(customerBarcode);
    }
  }, [customerBarcode, lookupCustomer]);

  useEffect(() => {
    if (isError) {
      setError("Failed to lookup customer");
    }
  }, [isError]);

  useEffect(() => {
    if (isFetched && customerData?.success) {
      dispatch(
        updatePickupState({ key: "customerData", value: customerData.data })
      );
      dispatch(updatePickupState({ key: "currentStep", value: 2 }));
    }
  }, [customerData, dispatch, isFetched]);

  useEffect(() => {
    if (isFetched && !customerData?.success) {
      setError("Customer not found");
    }
  }, [customerData, isFetched]);

  return (
    <>
      <RealtimeScanner
        onBarcodeDetected={(barcode: string) => setCustomerBarcode(barcode)}
        onUseScanner={useScanner}
      />
      <div className="bg-white rounded-t-xl -mt-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center">
            <h2 className="text-lg font-bold">Scan Customer</h2>
            <div className="ml-2 bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
          </div>
        </div>

        <div className="p-4">
          <CustomerBarcodeInput
            onSubmit={(barcode: string) => setCustomerBarcode(barcode)}
          />
          {isLoading && (
            <p className="text-gray-500 mt-2">Looking up customer...</p>
          )}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Step1Pickup;
