import { Session } from "next-auth";
import { useState, useEffect } from "react";
import api from "../redux/helper/axios";

interface PackageReadyToPickupResponse {
  packages: {
    id: number;
    tracking_number: string;
    carrier: string;
    status: string;
    type: string;
    sender_from: string;
    facility: string;
    warehouse_location: string;
  }[];
}

const fetchGetPackageReadyToPickup = async (
  userId: number,
): Promise<PackageReadyToPickupResponse> => {
  const response = await api.get<PackageReadyToPickupResponse>(
    `/customers/${userId}/packages`,
  );
  
  return response.data;
};

export const useGetPackageReadyToPickup = (
  userId: number,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<PackageReadyToPickupResponse | null>(null);

  const fetchData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const response = await fetchGetPackageReadyToPickup(userId);
      setData(response);
    } catch (err) {
      setIsError(true);
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error("Error fetching packages ready to pickup:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  return { data, isLoading, isError, error, refetch: fetchData };
};
