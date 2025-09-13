"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateReceivingState, useAppDispatch } from "@/redux";
import { useCarriers } from "@/hooks/use-carriers";

const CarrierSelector = () => {
  const dispatch = useAppDispatch();
  const { data: carriers, isLoading } = useCarriers();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="carrier" className="text-sm font-medium">
          Select Carrier
        </label>
        <Select
          disabled={isLoading}
          onValueChange={(value) =>
            dispatch(
              updateReceivingState({
                key: "carrier",
                value: { id: Number(value), name: value },
              })
            )
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a carrier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder" disabled>
              Select a carrier
            </SelectItem>
            {carriers?.data?.map((carrier) => (
              <SelectItem key={carrier.value} value={carrier.value}>
                {carrier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading carriers...</p>
        )}
      </div>
    </div>
  );
};

export default CarrierSelector;
