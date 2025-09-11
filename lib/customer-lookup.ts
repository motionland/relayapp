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
