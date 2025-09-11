import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Check,
  Search,
  RotateCcw,
  User,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector, useAppDispatch, updateReceivingState } from "@/redux";
import { fetchCustomerLookup, CustomerLookupResponse } from "@/lib/customer-lookup";

const ConfirmCustomerCodeStep = () => {
  const { data: session } = useSession();
  const receivingState = useAppSelector((state) => state.receiving);
  const dispatch = useAppDispatch();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCodeInput, setManualCodeInput] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const prevCustomerCode = useRef<string | undefined>(undefined);
  const prevSearchCode = useRef<string>("");

  const [manualCustomerData, setManualCustomerData] = useState<any>(null);
  const [manualLookupLoading, setManualLookupLoading] = useState(false);

  const [autoCustomerData, setAutoCustomerData] = useState<any>(null);
  const [autoCustomerLookupLoading, setAutoCustomerLookupLoading] = useState(false);


  useEffect(() => {
    if (searchCode) {
      const fetchManualCustomer = async () => {
        setManualLookupLoading(true);
        try {
          const data = await fetchCustomerLookup(searchCode);
          setManualCustomerData(data);
        } catch (error) {
          setManualCustomerData(null);
        } finally {
          setManualLookupLoading(false);
        }
      };

      fetchManualCustomer();
    }
  }, [searchCode]);

  useEffect(() => {
    if (receivingState.customerCode) {
      const fetchAutoCustomer = async () => {
        setAutoCustomerLookupLoading(true);
        try {
          const data = await fetchCustomerLookup(receivingState.customerCode || "");
          setAutoCustomerData(data);
        } catch (error) {
          setAutoCustomerData(null);
        } finally {
          setAutoCustomerLookupLoading(false);
        }
      };

      fetchAutoCustomer();
    }
  }, [receivingState.customerCode]);

  const hasLabel = Boolean(receivingState.customerCode);
  
  const isValidCustomerData = (customerResponse: any) => {
    return customerResponse?.success === true && 
           customerResponse?.data && 
           customerResponse?.data.id && 
           customerResponse?.data.shipping_code;
  };
  
  const hasValidManualCustomer = isValidCustomerData(manualCustomerData);
  const hasValidAutoCustomer = isValidCustomerData(autoCustomerData);
  const hasValidCustomer = hasValidManualCustomer || hasValidAutoCustomer;

  console.log("receivingState", receivingState);
  console.log("manualCustomerData:", manualCustomerData);
  console.log("autoCustomerData:", autoCustomerData);
  console.log("hasValidCustomer:", hasValidCustomer);

  const handleContinueStep = () => {
    const customerData = hasValidManualCustomer ? manualCustomerData?.data : autoCustomerData?.data;
    
    if (customerData) {
      console.log("Setting customer data:", customerData);
      dispatch(updateReceivingState({ key: "customer", value: customerData }));
      dispatch(updateReceivingState({ key: "currentStep", value: 3 }));
    }
  };

  const handleManualSearch = async () => {
    if (!manualCodeInput?.trim()) {
      setErrorMessage("Please enter a customer code");
      return;
    }

    setErrorMessage(null);
    setSearchCode(manualCodeInput);
    console.log("Manual search initiated for code:", manualCodeInput);
  };
  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleManualSearch();
    }
  };

  const resetAndGoBack = () => {
    dispatch(updateReceivingState({ key: "customer", value: null }));
    dispatch(updateReceivingState({ key: "currentLabel", value: null }));
    dispatch(updateReceivingState({ key: "currentStep", value: 1 }));
    dispatch(updateReceivingState({ key: "customerCode", value: "" }));
    setSearchCode("");
    setManualCodeInput("");
    setErrorMessage(null);
    // Reset refs
    prevCustomerCode.current = undefined;
    prevSearchCode.current = "";
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold mb-1">Confirm Customer</h2>
        <p className="text-gray-500 text-sm">
          Verify the extracted customer information
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            Customer Information
            {(autoCustomerLookupLoading || manualLookupLoading) && (
              <div className="ml-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Display current shipping label */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Shipping Label
            </p>
            <p className="font-mono text-sm break-words">
              {hasLabel ? receivingState.currentLabel : "No label detected"}
            </p>
          </div>

          {/* Customer not found message */}
          {((searchCode && manualCustomerData?.success === false) || 
            (receivingState.customerCode && autoCustomerData?.success === false)) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Customer Not Found
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    We couldn't find a customer with the code:
                    <span className="font-mono bg-red-100 px-1.5 py-0.5 rounded ml-1">
                      {searchCode || receivingState.customerCode}
                    </span>
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    Please verify the code or enter it manually.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Display customer code status */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                Customer Code
              </p>
              <div className="flex items-center gap-2">
                {hasValidCustomer ? (
                  <>
                    <Badge className="bg-blue-100 text-blue-700 border-0 px-3 py-1 text-sm font-medium">
                      {(hasValidManualCustomer ? manualCustomerData?.data?.shipping_code : autoCustomerData?.data?.shipping_code) || searchCode || receivingState.customerCode}
                    </Badge>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs ml-1">Verified</span>
                    </div>
                  </>
                ) : (manualLookupLoading || autoCustomerLookupLoading) ? (
                  <>
                    <Badge className="bg-amber-100 text-amber-700 border-0 px-3 py-1 text-sm font-medium">
                      {searchCode || receivingState.customerCode || "Verifying..."}
                    </Badge>
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-xs ml-1">Verifying...</span>
                    </div>
                  </>
                ) : (searchCode || receivingState.customerCode) ? (
                  <Badge className="bg-red-100 text-red-700 border-0 px-3 py-1 text-sm font-medium">
                    {searchCode || receivingState.customerCode}
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 border-0 px-3 py-1 text-sm font-medium">
                    No code detected
                  </Badge>
                )}
              </div>
            </div>

            {/* Manual code input section */}
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto text-blue-600 hover:text-blue-800 hover:bg-transparent font-medium text-sm"
                onClick={() => {
                  setShowManualInput(!showManualInput);
                  setErrorMessage(null);
                }}
              >
                {showManualInput
                  ? "Cancel Manual Entry"
                  : "Enter Code Manually"}
              </Button>

              {showManualInput && (
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter customer code"
                      value={manualCodeInput}
                      onChange={(e) => setManualCodeInput(e.target.value)}
                      onKeyDown={handleInputKeyPress}
                      className="flex-1 text-sm"
                      disabled={manualLookupLoading}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={handleManualSearch}
                      disabled={manualLookupLoading || !manualCodeInput?.trim()}
                      className="px-3"
                    >
                      {manualLookupLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errorMessage && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={resetAndGoBack}
            >
              <RotateCcw className="h-4 w-4" />
              Rescan Label
            </Button>
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center gap-2"
              onClick={handleContinueStep}
              disabled={!hasValidCustomer}
            >
              Continue to Package Details
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmCustomerCodeStep;
