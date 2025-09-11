"use client";
import React, { useCallback } from "react";
import Step1Receiving from "./components/step1-receiving";
import Step2Receiving from "./components/step2-receiving";
import Step3Receiving from "./components/step3-receiving";
import Step4Receiving from "./components/step4-receiving";
import { Building, History, Package, User } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useAppSelector } from "@/redux";
import { useEffect, useState } from "react";
import { fetchPackageActivityToday, PackageActivityResponse } from "@/lib/package-activity";
import {
  fetchRecentReceiving,
  RecentReceivingResponse,
} from "@/lib/recent-receiving";


const ReceivingViewDekstop = () => {
  const receivingState = useAppSelector((state) => state.receiving);
  // State for package activity
  const [activityData, setActivityData] = useState<PackageActivityResponse | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);

  // State for recent receiving
  const [recentData, setRecentData] = useState<RecentReceivingResponse | null>(null);
  const [recentLoading, setRecentLoading] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);

  // Fetch package activity data
  useEffect(() => {
      const loadPackageActivity = async () => {
        setActivityLoading(true);
        setActivityError(null);
        try {
          const data = await fetchPackageActivityToday();
          setActivityData(data);
        } catch (err) {
          setActivityError("Failed to load package activity");
          console.error("Error fetching package activity:", err);
        } finally {
          setActivityLoading(false);
        }
      };

      loadPackageActivity();
  }, []);

  // Fetch recent receiving data
  useEffect(() => {
    const loadRecentReceiving = async () => {
        setRecentLoading(true);
        setRecentError(null);
        try {
          const data = await fetchRecentReceiving();
          setRecentData(data);
        } catch (err) {
          setRecentError("Failed to load recent receiving");
          console.error("Error fetching recent receiving:", err);
        } finally {
          setRecentLoading(false);
        }
      };

      loadRecentReceiving();
  }, []);

  // Fallback values while loading or in case of error
  const scanned = activityData?.data?.scanned ?? 0;
  const completed = activityData?.data?.completed ?? 0;
  const warehouseCapacity = activityData?.data?.warehouse_capacity ?? 0;
  const recentPackages = recentData?.data ?? [];

  const renderStepContent = () => {
    switch (receivingState.currentStep) {
      case 1:
        return <Step1Receiving />;
      case 2:
        return <Step2Receiving />;
      case 3:
        return <Step3Receiving />;
      case 4:
        return <Step4Receiving />;
      default:
        return <div>Step 1</div>;
    }
  };

  return (
    <div className="min-h-screen px-[-1] py-6">
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="bg-white rounded-xl shadow-sm p-4">{renderStepContent()}</div>
      </div>

      <div className="w-full lg:w-[360px] space-y-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h5 className="mb-2 text-lg font-bold text-gray-900">Today's Activity</h5>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            Packages Scanned <span className="font-bold">{activityLoading ? '...' : scanned}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            Pickups Completed <span className="font-bold">{activityLoading ? '...' : completed}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            Warehouse Capacity <span className="font-bold">{activityLoading ? '...' : warehouseCapacity}</span>
          </div>
          {activityError && (
            <div className="text-red-500 text-sm mt-2">Error loading activity data</div>
          )}
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h5 className="flex items-center text-lg font-bold text-gray-800 mb-2">
            <History className="h-6 w-6 text-gray-600 mr-2" />
            Recent Receiving
          </h5>

          <div className="w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 pt-4 pb-3 bg-white">
              <h6 className="text-base font-semibold text-gray-800">Receiving history</h6>
              <p className="text-sm text-gray-500">Your recent package receiving activity</p>
            </div>

            {recentLoading ? (
              <div className="bg-white py-4 text-center">
                <p>Loading recent receiving...</p>
              </div>
            ) : recentError ? (
              <div className="bg-white py-4 text-center">
                <p className="text-red-500">Error loading recent receiving data</p>
              </div>
            ) : recentPackages.length === 0 ? (
              <div className="bg-white py-4 text-center">
                <p>No recent receiving activity</p>
              </div>
            ) : (
              recentPackages.map((pkg, index) => (
                <div key={pkg.id} className="bg-white py-2">
                  <div className="bg-gray-50 rounded-md overflow-hidden">
                    <div className="w-full h-[1px] bg-white" />
                    <div className="px-4 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-emerald-600">{pkg.tracking_number}</p>
                        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {pkg.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        {new Date(pkg.updated_at).toLocaleString()}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-green-500" />
                        <span>{pkg.user?.full_name || 'Unknown User'}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-700">
                        <Building className="w-4 h-4 text-green-500 mt-0.5" />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{pkg.warehouseLocation?.name || 'Unknown Location'}</p>
                          <p className="text-gray-500 text-xs truncate">
                            {pkg.warehouseLocation?.address || 'No address provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-700">
                        <div className="flex items-center gap-1">
                          <Package className="w-[14px] h-[14px] text-green-500" />
                          <span>1 package</span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-white" />

                    {index === recentPackages.length - 1 && (
                      <div className="mt-4">
                        <div className="bg-black hover:bg-slate-900 group px-4 py-2 rounded-2xl flex justify-center">
                          <button type="button" className="flex items-center text-gray-500 group-hover:text-white">
                            View All History
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ReceivingViewDekstop;
