import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  CustomerLookupData,
  fetchCustomerLookup,
} from "@/hooks/use-customer-lookup";

interface Customer {
  id?: number | null;
  user_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  shipping_code?: string | null;
  packages_count?: number | null;
}

interface CustomerBarcodeInputProps {
  onSubmit: (barcode: string) => void;
}

const CustomerBarcodeInput: React.FC<CustomerBarcodeInputProps> = ({
  onSubmit,
}) => {
  const { data: session } = useSession();
  const [customerBarcode, setCustomerBarcode] = React.useState("");
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [customerData, setCustomerData] =
    React.useState<CustomerLookupData | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetched, setIsFetched] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const lookupCustomer = async () => {
      if (!customerBarcode) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchCustomerLookup(customerBarcode);
        setCustomerData(response?.data as CustomerLookupData);
        setIsFetched(true);
      } catch (err) {
        setError("Failed to lookup customer");
      } finally {
        setIsLoading(false);
      }
    };

    lookupCustomer();
  }, [customerBarcode]);

  // Show dropdown when there are customers and search term is long enough
  useEffect(() => {
    if (customerBarcode.length > 1 && customerData) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [customerBarcode, customerData]);

  const handleSelectCustomer = (customer: Customer) => {
    if (customer.shipping_code) {
      setCustomerBarcode(customer.shipping_code);
      setShowDropdown(false);
      setTimeout(() => onSubmit(customer?.shipping_code!), 100);
    }
  };

  const handleSubmit = () => {
    if (customerBarcode) {
      onSubmit(customerBarcode);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-medium mb-1">Scan Customer Barcode</h2>
        <p className="text-gray-500 text-sm">
          Position barcode within the frame or enter ID manually
        </p>
      </div>

      <div className="space-y-3 mt-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Enter Customer ID or scan barcode"
            value={customerBarcode}
            onChange={(e) => {
              setCustomerBarcode(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && customerBarcode) {
                handleSubmit();
              }
            }}
            onFocus={() => customerBarcode.length > 1 && setShowDropdown(true)}
            className="border-0 bg-gray-50 h-12 pl-4 pr-10 rounded-xl"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Barcode className="h-5 w-5" />
          </div>

          {/* Dropdown search results */}
          {showDropdown && customerData && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div
                key={customerData.id}
                className="px-4 py-3 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                onClick={() => handleSelectCustomer(customerData)}
              >
                <div>
                  <div className="font-medium">
                    {customerData.full_name || "Unknown Customer"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customerData.shipping_code}
                  </div>
                </div>
                <div className="text-sm bg-gray-100 rounded-full px-2 py-1">
                  {customerData.packages_count || 0} packages
                </div>
              </div>
            </div>
          )}

          {/* Show message when no customers found */}
          {showDropdown && customerBarcode.length > 1 && !isFetched && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-3 text-center text-gray-500">
              No customers found
            </div>
          )}

          {/* Show loading state */}
          {showDropdown && isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-3 text-center text-gray-500">
              Searching...
            </div>
          )}

          {/* Show error message */}
          {showDropdown && error && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-3 text-center text-red-500">
              Error searching customers
            </div>
          )}
        </div>

        <Button
          className="w-full h-12 bg-black hover:bg-gray-800 text-white rounded-xl"
          onClick={handleSubmit}
          disabled={!customerBarcode}
        >
          Process Scan
        </Button>
      </div>
    </>
  );
};

export default CustomerBarcodeInput;
