import { Session } from "next-auth";
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

export const fetchPackageActivityToday = async (): Promise<PackageActivityResponse> => {
  const response = await api.get<PackageActivityResponse>(
    "/package-activity-today"
  );
  return response.data;
};
