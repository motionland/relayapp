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
import { useEffect, useState } from "react";
import {
  fetchPackageTypes,
  PackageTypeResponse,
  usePackageTypes,
} from "@/hooks/use-package-types";

const PackageTypeSelector = () => {
  const dispatch = useAppDispatch();
  
  const { data: packageTypes, isLoading } = usePackageTypes();

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="package-type" className="text-sm font-medium">
          Select Package Type
        </label>
        <Select
          disabled={isLoading}
          onValueChange={(value) => {
            const selectedType = packageTypes?.data.find(
              (type) => type.value === value
            );
            dispatch(
              updateReceivingState({
                key: "package_type",
                value: {
                  id: Number(value),
                  name: selectedType?.label || value,
                },
              })
            );
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a package type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder" disabled>
              Select a package type
            </SelectItem>
            {packageTypes?.data?.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            Loading package types...
          </p>
        )}
      </div>
    </div>
  );
};

export default PackageTypeSelector;
