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

export interface RecentReceivingResponse {
  message: string;
  data: PackageResource[];
}

export const fetchRecentReceiving = async (): Promise<RecentReceivingResponse> => {
  const response = await api.get<RecentReceivingResponse>(
    "/package-recent-receiving"
  );
  return response.data;
};

export const useRecentReceiving = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<RecentReceivingResponse | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchRecentReceiving();
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching recent receiving:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, isError, refetch: fetchData };
};
