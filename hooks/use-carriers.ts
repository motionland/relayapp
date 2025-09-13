import { useState, useEffect } from "react";
import { Session } from "next-auth";
import api from "../redux/helper/axios";

export interface CarrierData {
  value: string;
  label: string;
}

export interface CarrierResponse {
  success: boolean;
  message: string;
  data: CarrierData[];
}

export const fetchCarriers = async (session: Session): Promise<CarrierResponse> => {
  const response = await api.get<CarrierResponse>("/master/carriers");
  return response.data;
};

export const useCarriers = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<CarrierResponse | null>(null);

  const fetchData = async (session: Session) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchCarriers(session);
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching carriers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, fetchData };
};
