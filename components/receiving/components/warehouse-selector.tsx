"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReceivingContext } from "@/context/mobile/receiving-context";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    area: string;
    row: string;
    bay: string;
    level: string;
    bin: string;
    capacity: string;
    total_packages: number;
    description: string;
  }[];
}

const WarehouseSelector = () => {
  const {data: session} = useSession();
  const { updateReceivingState } = useReceivingContext();
  const [carriers, setCarriers] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCarriers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/warehouse/all`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.auth_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse;
      setCarriers(data);
      return data;
    } catch (error) {
      console.error("Error fetching carriers:", error);
      // setError("Failed to fetch carriers. Please try again.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="carrier" className="text-sm font-medium">
          Select Warehouse
        </label>
        <Select
          disabled={isLoading}
          onValueChange={(value) =>
            updateReceivingState("warehouse", {
              id: Number(value),
              area: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.area || "",
              row: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.row || "",
              bay: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.bay || "",
              level: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.level || "",
              bin: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.bin || "",
              capacity: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.capacity || "",
              total_packages: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.total_packages || 0,
              description: carriers?.data?.find((warehouse) => warehouse.id === Number(value))?.description || "",
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a warehouse" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder" disabled>
              Select a warehouse
            </SelectItem>
            {carriers?.data?.map((warehouse) => (
              <SelectItem
                key={warehouse.id}
                value={warehouse.id.toString()}
                className="flex items-center space-x-2"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">{warehouse.area}</p>
                  <p className="text-xs text-muted-foreground">
                    {warehouse.row} - {warehouse.bay} - {warehouse.level} -{" "}
                    {warehouse.bin}
                  </p>
                </div>
                <div className="flex items-center justify-end">
                  <p className="text-xs text-muted-foreground">
                    {warehouse.capacity}
                  </p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading warehouses...</p>
        )}
      </div>
    </div>
  );
};

export default WarehouseSelector;
