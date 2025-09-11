"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReceivingState, useAppDispatch } from "@/redux";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { fetchShippingAddresses, ShippingAddressResponse } from "@/lib/shipping-addresses";

const ShippingAddressSelector = () => {
  const {data: session} = useSession();
  const dispatch = useAppDispatch();
  
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      const loadShippingAddresses = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await fetchShippingAddresses(session);
          setShippingAddresses(data);
        } catch (err) {
          setError("Failed to load shipping addresses");
          console.error("Error fetching shipping addresses:", err);
        } finally {
          setIsLoading(false);
        }
      };

      loadShippingAddresses();
    }
  }, [session]);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="carrier" className="text-sm font-medium">
          Select Shipping Address
        </label>
        <Select
          disabled={isLoading}
          onValueChange={(value) =>
            dispatch(updateReceivingState({ key: "shippingAddress", value: { id: Number(value), name: value } }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shipping address" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder" disabled>
              Select a shipping address
            </SelectItem>
            {shippingAddresses?.data?.map((shippingAddress) => (
              <SelectItem key={shippingAddress.value} value={shippingAddress.value}>
                {shippingAddress.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading shipping addresses...</p>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressSelector;
