"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReceivingState, useAppDispatch, useAppSelector } from "@/redux";
import { useSession } from "next-auth/react";

enum ShippingSize {
  SMALL = "Small",
  MEDIUM = "Medium", 
  LARGE = "Large"
}

const ShippingSizeSelector = () => {
  const dispatch = useAppDispatch();
  const receivingState = useAppSelector((state) => state.receiving);

  const shippingSizes = {
    "1": ShippingSize.SMALL,
    "2": ShippingSize.MEDIUM,
    "3": ShippingSize.LARGE,
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="shipping-size" className="text-sm font-medium">
          Select Shipping Size
        </label>
        <Select
          onValueChange={(value) =>
            dispatch(updateReceivingState({ key: "shipping_size", value: {
              id: Number(value),
              name: shippingSizes[value as keyof typeof shippingSizes] || value,
            }}))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a shipping size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder" disabled>
              Select a shipping size
            </SelectItem>
            {Object.entries(shippingSizes).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShippingSizeSelector;
