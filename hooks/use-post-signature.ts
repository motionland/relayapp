"use client";

import { useState } from "react";
import api from "../redux/helper/axios";

export interface SignaturePayload {
  signature: string;
}

export interface SignatureResponse {
  ok: boolean;
  message?: string;
  [key: string]: any;
}

const postSignature = async (
  packageId: string,
  input: SignaturePayload
): Promise<SignatureResponse> => {
  try {
    const response = await api.post<SignatureResponse>(
      `/v1/packege/${packageId}/signature`,
      input
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Signature failed: ${error.response?.status} ${error.response?.statusText} ${error.message}`
    );
  }
};

export const usePostSignature = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<SignatureResponse | null>(null);

  const execute = async ({
    packageId,
    input,
  }: {
    packageId: string;
    input: SignaturePayload;
  }) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const response = await postSignature(packageId, input);
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
