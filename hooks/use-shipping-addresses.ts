import { Session } from "next-auth";
import { useState } from "react";
import api from "../redux/helper/axios";

export interface ShippingAddressData {
  value: string;
  label: string;
}

export interface ShippingAddressResponse {
  success: boolean;
  message: string;
  data: ShippingAddressData[];
}

export const fetchShippingAddresses = async (session: Session): Promise<ShippingAddressResponse> => {
  const response = await api.get<ShippingAddressResponse>("/master/shipping-addresses");
  return response.data;
};

export const useShippingAddresses = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<ShippingAddressResponse | null>(null);

  const fetchData = async (session: Session) => {
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchShippingAddresses(session);
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching shipping addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, isError, fetchData };
};
