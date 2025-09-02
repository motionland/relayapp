import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/redux/helper";

/* ================================
  STEP 1: Login Request
  ================================ */
export interface LoginRequestInput {
  email?: string;
  phone?: string;
  countryCode?: string;
}

export interface LoginRequestApiResponse {
  success: boolean;
  message: string;
  data: {
    token_login: string;
  };
}

export type LoginRequestResponse = LoginRequestApiResponse["data"];

export const sendLoginRequest = createAsyncThunk<
  LoginRequestResponse,
  LoginRequestInput,
  { rejectValue: string }
>("auth/sendLoginRequest", async (input, { rejectWithValue }) => {
  try {
    const res = await api.post<LoginRequestApiResponse>(
      "/auth/login-request",
      input
    );
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send login request"
    );
  }
});

/* ================================
  STEP 2: Verify Password / PIN
  ================================ */
export interface LoginCredentialInput {
  login_token: string;
  password?: string;
  pin?: string;
}

export interface LoginSuccessApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
  };
}

export interface OtpChallengeApiResponse {
  success: boolean;
  message: string;
  data: {
    need_otp: true;
    credential: string;
    device_token: string;
  };
}

export type LoginCredentialResponse =
  | LoginSuccessApiResponse["data"]
  | OtpChallengeApiResponse["data"];

export const verifyLoginCredential = createAsyncThunk<
  LoginCredentialResponse,
  LoginCredentialInput,
  { rejectValue: string }
>("auth/verifyLoginCredential", async (input, { rejectWithValue }) => {
  try {
    const res = await api.post<LoginSuccessApiResponse | OtpChallengeApiResponse>(
      "/auth/login-credential",
      input
    );
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify login credential"
    );
  }
});

/* ================================
  STEP 3a: Request OTP (Send OTP)
  ================================ */
export interface SendOtpInput {
  login_token: string;
}

export interface SendOtpApiResponse {
  success: boolean;
  message: string;
  data: {
    login_token: string;
  };
}

export type SendOtpResponse = SendOtpApiResponse["data"];

export const sendOtpLogin = createAsyncThunk<
  SendOtpResponse,
  SendOtpInput,
  { rejectValue: string }
>("auth/sendOtpLogin", async (input, { rejectWithValue }) => {
  try {
    const res = await api.post<SendOtpApiResponse>("/login-sendotp", input);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send OTP"
    );
  }
});

/* ================================
  STEP 3b: Verify OTP
  ================================ */
export interface VerifyOtpInput {
  login_token: string;
  otp: string;
}

export interface VerifyOtpApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
  };
}

export type VerifyOtpResponse = VerifyOtpApiResponse["data"];

export const verifyOtpLogin = createAsyncThunk<
  VerifyOtpResponse,
  VerifyOtpInput,
  { rejectValue: string }
>("auth/verifyOtpLogin", async (input, { rejectWithValue }) => {
  try {
    const res = await api.post<VerifyOtpApiResponse>("/login-verify", input);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify OTP"
    );
  }
});

/* ================================
  MAGIC LINK FLOW
  ================================ */
export interface SendMagicLinkInput {
  email?: string;
  phone?: string;
  countryCode?: string;
}

export interface SendMagicLinkApiResponse {
  success: boolean;
  message: string;
  data: null;
}

export type SendMagicLinkResponse = string; // cukup ambil message

export const sendMagicLink = createAsyncThunk<
  SendMagicLinkResponse,
  SendMagicLinkInput,
  { rejectValue: string }
>("auth/sendMagicLink", async (input, { rejectWithValue }) => {
  try {
    const res = await api.post<SendMagicLinkApiResponse>("/magic-link", input);
    return res.data.message;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to send magic link"
    );
  }
});

export interface VerifyMagicLinkInput {
  token: string;
}

export interface VerifyMagicLinkApiResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    type: string;
  };
}

export type VerifyMagicLinkResponse = VerifyMagicLinkApiResponse["data"];

export const verifyMagicLink = createAsyncThunk<
  VerifyMagicLinkResponse,
  VerifyMagicLinkInput,
  { rejectValue: string }
>("auth/verifyMagicLink", async (input, { rejectWithValue }) => {
  try {
    const res = await api.get<VerifyMagicLinkApiResponse>("/magic-link", {
      params: input,
    });
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to verify magic link"
    );
  }
});
