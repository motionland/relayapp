import { useState, useEffect } from "react";
import { Session } from "next-auth";
import api from "../redux/helper/axios";

interface PackageResource {
  id: string;
  tracking_number: string;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
  };
  warehouseLocation?: {
    name: string;
    address: string;
  };
}

interface RecentPickupResponse {
  message: string;
  data: PackageResource[];
}

export const fetchRecentPickup = async (): Promise<RecentPickupResponse> => {
  const response = await api.get<RecentPickupResponse>(
    "/package-recent-pickup"
  );
  return response.data;
};

export const useRecentPickup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<RecentPickupResponse | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchRecentPickup();
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching recent pickup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, isError, refetch: fetchData };
};
