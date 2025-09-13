"use client";

import { useState } from "react";
import { Session } from "next-auth";
import api from "../redux/helper/axios";

export interface VerifyPackagePayload {
  verify_image: string;
}

export interface VerifyPackageResponse {
  ok: boolean;
  message?: string;
  [key: string]: any;
}

const postVerifyPackage = async (
  input: VerifyPackagePayload
): Promise<VerifyPackageResponse> => {
  try {
    
    const response = await api.post<VerifyPackageResponse>(
      `/v1/package/verify`,
      input
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Verify package failed: ${error.response?.status} ${error.response?.statusText} ${error.message}`
    );
  }
};

export const useVerifyPackage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<VerifyPackageResponse | null>(null);

  const execute = async (input: VerifyPackagePayload) => {

    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const response = await postVerifyPackage(input);
      setData(response);
      return response;
    } catch (err: any) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setIsError(true);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, isLoading, isError, error, data };
};
