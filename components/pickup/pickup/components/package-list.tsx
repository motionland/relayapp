"use client";

import React from "react";
import {
  AlertTriangle,
  Box,
  CheckCircle,
  Clock3,
  Package,
  Snowflake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux";
import { updatePickupState } from "@/redux/feature/pickup";

// Interface for API response (same as PackagePickup for consistency)
interface PackageReadyToPickup {
  id: number;
  tracking_number: string;
  carrier: string;
  status: string;
  type: string;
  sender_from: string;
  facility: string;
  warehouse_location: string;
}

// Use PackagePickup from context
export interface PackageListProps {
  packages: PackageReadyToPickup[];
}

// Use API-provided type if available, otherwise fallback to logic
export const getPackageType = (type?: string, id?: string) => {
  if (type && ["fragile", "fridge", "urgent", "standard"].includes(type)) {
    return type;
  }
  if (!id) return "standard";
  const lastChar = id.charAt(id.length - 1);
  const lastDigit = Number.parseInt(lastChar);

  if (isNaN(lastDigit)) return "standard";

  if (lastDigit <= 2) return "fragile";
  if (lastDigit <= 5) return "fridge";
  if (lastDigit <= 8) return "urgent";
  return "standard";
};

const getPackageTypeInfo = (type: string | undefined) => {
  switch (type) {
    case "fragile":
      return {
        icon: <AlertTriangle className="h-3.5 w-3.5" />,
        color: "text-amber-500 bg-amber-50 border-amber-200",
      };
    case "fridge":
      return {
        icon: <Snowflake className="h-3.5 w-3.5" />,
        color: "text-blue-500 bg-blue-50 border-blue-200",
      };
    case "urgent":
      return {
        icon: <Clock3 className="h-3.5 w-3.5" />,
        color: "text-red-500 bg-red-50 border-red-200",
      };
    case "standard":
    default:
      return {
        icon: <Box className="h-3.5 w-3.5" />,
        color: "text-gray-500 bg-gray-50 border-gray-200",
      };
  }
};

const parseBinLocation = (binLocation: string) => {
  // Example format: A01-R01-B01-L05
  const parts = binLocation.split("-");
  return {
    area: parts[0]?.charAt(0) || "A",
    row: parts[1]?.substring(1) || "01",
    bay: parts[2]?.substring(1) || "01",
    level: parts[3]?.substring(1) || "05",
    bin: parts[0]?.substring(1, 2) || "A",
  };
};

const PackageList: React.FC<PackageListProps> = ({ packages }) => {
  const pickupState = useAppSelector((state) => state.pickup);
  const dispatch = useAppDispatch();
  const [locatedPackages, setLocatedPackages] = React.useState<{
    [id: string]: boolean;
  }>({});
  const allLocated =
    packages.length > 0 &&
    packages.every((pkg) => locatedPackages[pkg.tracking_number]);

  const handleLocatePackage = (tracking_number: string) => {
    setLocatedPackages((prev) => ({
      ...prev,
      [tracking_number]: !prev[tracking_number],
    }));
  };

  const onConfirm = () => {
    const locatedPackagesList = packages.filter(
      (pkg) => locatedPackages[pkg.tracking_number]
    );

    dispatch(updatePickupState({ key: "currentStep", value: 3 }));
    dispatch(updatePickupState({ key: "selectedPackages", value: locatedPackagesList }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-gray-500">Packages</p>
        <p className="text-sm font-medium">
          {Object.values(locatedPackages).filter(Boolean).length} of{" "}
          {packages.length} located
        </p>
      </div>

      {packages.length > 0 ? (
        <div className="space-y-2">
          {packages.map((pkg) => {
            const isLocated = locatedPackages[pkg.tracking_number];
            const packageType = getPackageType(pkg.type, pkg.tracking_number);
            const { icon, color } = getPackageTypeInfo(packageType);

            return (
              <div
                key={pkg.tracking_number}
                className={`p-4 rounded-xl transition-colors duration-200 cursor-pointer ${
                  isLocated
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50"
                }`}
                onClick={() => handleLocatePackage(pkg.tracking_number)}
              >
                <div className="flex items-start mb-3">
                  {isLocated ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  ) : (
                    <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium truncate">
                      {pkg.tracking_number}
                    </p>
                    {isLocated && (
                      <p className="text-xs text-green-600">Package located</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-100 p-5 pt-10 pb-14 rounded-xl relative">
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border ${color}`}
                    >
                      {icon}
                      <span className="uppercase">{packageType}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 right-3 flex gap-2 mt-4 pt-2">
                    {["fragile", "fridge", "urgent", "standard"].map((type) => {
                      const { icon, color } = getPackageTypeInfo(type);
                      const isActive = type === packageType;

                      return (
                        <div
                          key={type}
                          className={`flex items-center justify-center w-7 h-7 rounded-full border ${
                            isActive
                              ? color
                              : "text-gray-300 bg-gray-50 border-gray-200"
                          }`}
                          title={type.toUpperCase()}
                        >
                          {icon}
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-gray-700 font-medium mb-4">
                    Storage Information
                  </p>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-5 gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          AREA
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          ROW
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          BAY
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          LEVEL
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-600">
                          BIN
                        </p>
                      </div>
                    </div>
                    {(() => {
                      const location = parseBinLocation(pkg.warehouse_location);
                      return (
                        <div className="grid grid-cols-5 gap-4 items-center">
                          <div className="text-center">
                            <p className="text-3xl font-bold">
                              {location.area}
                            </p>
                          </div>
                          <div className="text-center flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400 mr-1">
                              -
                            </span>
                            <p className="text-3xl font-bold">{location.row}</p>
                          </div>
                          <div className="text-center flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400 mr-1">
                              -
                            </span>
                            <p className="text-3xl font-bold">{location.bay}</p>
                          </div>
                          <div className="text-center flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400 mr-1">
                              -
                            </span>
                            <p className="text-3xl font-bold">
                              {location.level}
                            </p>
                          </div>
                          <div className="text-center flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-400 mr-1">
                              -
                            </span>
                            <p className="text-3xl font-bold">{location.bin}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No packages found</p>
      )}

      <div className="space-y-2 mt-4">
        {!allLocated && (
          <p className="text-sm text-amber-600 text-center">
            Please locate all packages before proceeding
          </p>
        )}

        <Button
          className={`w-full h-12 rounded-xl ${
            allLocated
              ? "bg-black hover:bg-gray-800 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={onConfirm}
          disabled={!allLocated}
        >
          Confirm Pickup
        </Button>
      </div>
    </div>
  );
};

// Parent component to map API data to PackageList
interface PackageReadyToPickupResponse {
  packages: PackageReadyToPickup[];
}

interface PackageListWrapperProps {
  packagesReadyToPickups?: PackageReadyToPickupResponse;
}

const PackageListWrapper: React.FC<PackageListWrapperProps> = ({
  packagesReadyToPickups,
}) => {
  // Use only API data
  const mappedPackages: PackageReadyToPickup[] = packagesReadyToPickups?.packages || [];

  return (
    <>
      {mappedPackages.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <p className="text-sm text-gray-500">No packages ready to pickup</p>
        </div>
      ) : (
        <PackageList packages={mappedPackages} />
      )}
    </>
  );
};

export default PackageListWrapper;
