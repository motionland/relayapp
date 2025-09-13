import { useState, useEffect } from "react";
import api from "../redux/helper/axios";

export interface PackageActivityData {
  scanned: number;
  completed: number;
  warehouse_capacity: number;
}

export interface PackageActivityResponse {
  success: boolean;
  message: string;
  data: PackageActivityData;
}

export const usePackageActivityToday = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<PackageActivityResponse | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await api.get<PackageActivityResponse>("/package-activity-today");
      setData(response.data);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching package activity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, isError, refetch: fetchData };
};
