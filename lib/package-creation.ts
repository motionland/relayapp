import { Session } from "next-auth";
import api from "../redux/helper/axios";

export interface CreatePackagePayload {
  user_id?: number | null;
  carrier_id: number;
  shipping_address_id: number;
  warehouse_location_id: number;
  customer_id: number;
  tracking_number: string;
  arrival_time: string | Date;
  deadline_at: string | Date;
  weight: number;
  dimensions: string;
  size_category: string;
  status: string;
  package_type_id: number;
  sender_from: string;
  label_id?: number | null;
  package_images?: Array<File | string>;
}

const dataUrlToFile = async (dataUrl: string, filename: string) => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};

const buildFormData = async (input: CreatePackagePayload) => {
  const fd = new FormData();

  // Field wajib/required
  Object.entries(input).forEach(([k, v]) => {
    if (v !== undefined && v !== null && k !== 'package_images') fd.append(k, String(v));
  });

  // Images
  if (!input.package_images?.length) {
    throw new Error("package_images minimal 1 file.");
  }

  let counter = 0;
  for (const img of input.package_images) {
    if (img instanceof File) {
      fd.append("package_images[]", img);
    } else {
      const file = await dataUrlToFile(img, `image_${counter++}.jpg`);
      fd.append("package_images[]", file);
    }
  }

  return fd;
};

export const createPackage = async (session: Session | null, input: CreatePackagePayload) => {
  if (!session?.auth_token) {
    throw new Error("Unauthenticated: session/auth_token missing");
  }
  
  const formData = await buildFormData(input);
  
  const response = await api.post("/admin/package", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};
