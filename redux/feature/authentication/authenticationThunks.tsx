import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/redux/helper";
import type { ErrorResponse, SuccessResponse } from "@/redux/helper/types";
import { tokenStorage } from "@/redux/helper/axios";
import Cookies from "js-cookie";

/**
 * layer interface form helper request authentications
 */
interface RequestLoginPayload {
  email?: string;
  phone?: string;
  countryCode?: "US" | "CA" | "MX";
  remember?: boolean;
}

interface RequestLoginWithPasswordOrPin {
  login_token: string;
  password?: string;
  pin?: string;
}

/**
 * layer interface resource helper authentications
 */
interface ResponseLoginRequest {
  token_login: string;
}

interface ResponseLoginWithPasswordOrPin {
  token: string;
  type: "Bearer" | string;
}

interface ResponseNewDeviceVerification {
  need_otp: boolean;
  credential: string;
  device_token: string;
}

/**
 * logic fetch api layer
 */

export const requestLogin = createAsyncThunk<
  ResponseLoginRequest,
  RequestLoginPayload,
  { rejectValue: string }
>("authentication/requestLogin", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post<
      SuccessResponse<ResponseLoginRequest> | ErrorResponse
    >("/auth/login-request", payload);

    const data = res.data;

    if (!data.success) {
      return rejectWithValue(data.message || "Login request failed");
    }

    return data.data as ResponseLoginRequest;
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Network error";
    return rejectWithValue(message);
  }
});

export const loginWithPasswordOrPin = createAsyncThunk<
  ResponseLoginWithPasswordOrPin | ResponseNewDeviceVerification,
  RequestLoginWithPasswordOrPin,
  { rejectValue: string }
>(
  "authentication/loginWithPasswordOrPin",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post<
        | SuccessResponse<
            ResponseLoginWithPasswordOrPin | ResponseNewDeviceVerification
          >
        | ErrorResponse
      >("/auth/login-credential", payload);

      const data = res.data;

      if (!data.success) {
        return rejectWithValue(data.message || "Login failed");
      }

      return data.data as
        | ResponseLoginWithPasswordOrPin
        | ResponseNewDeviceVerification;
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Network error";
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "authentication/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post<SuccessResponse<null> | ErrorResponse>(
        "/logout"
      );
      const data = res.data;
      if (!data.success) {
        return rejectWithValue(data.message || "logout failed");
      }

      Cookies.remove("auth_token");
      tokenStorage.clearAll();
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Network error";
      return rejectWithValue(message);
    }
  }
);
