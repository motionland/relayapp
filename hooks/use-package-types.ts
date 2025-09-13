import { Session } from "next-auth";
import { useState } from "react";
import api from "../redux/helper/axios";

export interface PackageTypeData {
  value: string;
  label: string;
}

export interface PackageTypeResponse {
  success: boolean;
  message: string;
  data: PackageTypeData[];
}

export const fetchPackageTypes = async (session: Session): Promise<PackageTypeResponse> => {
  const response = await api.get<PackageTypeResponse>("/master/package-types");
  return response.data;
};

export const usePackageTypes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<PackageTypeResponse | null>(null);

  const fetchData = async (session: Session) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchPackageTypes(session);
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching package types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, fetchData };
};
