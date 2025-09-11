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
