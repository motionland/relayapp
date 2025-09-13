import { useState, useEffect } from "react";
import api from "../redux/helper/axios";

export interface CustomerLookupData {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  shipping_code: string;
  packages_count: number;
}

export interface CustomerLookupResponse {
  success: boolean;
  message: string;
  data: CustomerLookupData;
}

export const fetchCustomerLookup = async (code: string): Promise<CustomerLookupResponse | null> => {
  if (!code || code.trim().length === 0) {
    return null;
  }

  try {
    const response = await api.get<CustomerLookupResponse>(`customer-lookup?code=${code}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer lookup:", error);
    throw error;
  }
};

export const useCustomerLookup = (initialCode?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setData] = useState<CustomerLookupResponse | null>(null);
  const [code, setCode] = useState<string | undefined>(initialCode);

  const lookupCustomer = async (lookupCode?: string) => {
    const codeToUse = lookupCode || code;
    if (!codeToUse) return;
    
    setIsLoading(true);
    setIsError(false);
    
    try {
      const response = await fetchCustomerLookup(codeToUse);
      setData(response);
    } catch (error) {
      setIsError(true);
      console.error("Error in customer lookup:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCode) {
      lookupCustomer(initialCode);
    }
  }, []);

  return { data, isLoading, isError, lookupCustomer, setCode };
};
