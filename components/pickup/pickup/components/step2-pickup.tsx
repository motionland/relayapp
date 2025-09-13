"use client";
import CustomerInfoCard from "./customer-info-card";
import CustomerHubCard from "./customer-hub-card";
import PackageListWrapper from "./package-list";
import { useSession } from "next-auth/react";
import { useGetPackageReadyToPickup } from "@/hooks/use-get-packages";
import { useAppSelector } from "@/redux";

const Step2Pickup = () => {
  const pickupState = useAppSelector((state) => state.pickup);

  const { data: packagesReadyToPickups } = useGetPackageReadyToPickup(
    pickupState.customerData?.id!
  );

  return (
    <div className="px-4 space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-1">Package Details</h2>
        <p className="text-gray-500 text-sm">
          Locate each package and tap to mark as found
        </p>
      </div>

      <div className="space-y-4">
        <CustomerInfoCard
          name={pickupState.customerData?.full_name || ""}
          metroId={pickupState.customerData?.user_id || ""}
        />
        <CustomerHubCard
          warehouse="Warehouse A01"
          address="123 Distribution Center Rd, Industrial Park, CA 94103"
        />
        {packagesReadyToPickups?.packages.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-500">No packages ready to pickup</p>
          </div>
        ) : (
          <PackageListWrapper packagesReadyToPickups={packagesReadyToPickups!} />
        )}
      </div>
    </div>
  );
};

export default Step2Pickup;
