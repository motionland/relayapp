"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReceivingState, useAppDispatch } from "@/redux";
import { useShippingAddresses } from "@/hooks/use-shipping-addresses";

const ShippingAddressSelector = () => {
  const dispatch = useAppDispatch();

  const { data: shippingAddresses, isLoading } = useShippingAddresses();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="carrier" className="text-sm font-medium">
          Select Shipping Address
        </label>
        <Select
          disabled={isLoading}
          onValueChange={(value) =>
            dispatch(
              updateReceivingState({
                key: "shippingAddress",
                value: { id: Number(value), name: value },
              })
            )
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
              <SelectItem
                key={shippingAddress.value}
                value={shippingAddress.value}
              >
                {shippingAddress.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading shipping addresses...
          </p>
        )}
      </div>
    </div>
  );
};

export default ShippingAddressSelector;
