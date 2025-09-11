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
