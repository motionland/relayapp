import { Session } from "next-auth";
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

/**
 * Fetch package types data
 * @param session - The user session containing auth token
 * @returns Promise<PackageTypeResponse>
 */
export const fetchPackageTypes = async (session: Session): Promise<PackageTypeResponse> => {
  const response = await api.get<PackageTypeResponse>("/master/package-types");
  return response.data;
};
