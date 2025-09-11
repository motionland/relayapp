import { Session } from "next-auth";
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
