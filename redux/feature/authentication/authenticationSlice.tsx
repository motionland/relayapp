import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { loginWithPasswordOrPin, logout, requestLogin } from "./authenticationThunks";

type AuthMethod = "email" | "phone";
type SelectedMethod = "password" | null;

interface FormData {
  email?: string;
  phone?: string;
  countryCode?: "US" | "CA" | "MX";
  password?: string;
  pin?: string;
  remember?: boolean;
  deviceName?: string;
}

export interface AuthenticationState {
  loginCurrentStep: 1 | 2 | 3 | 4;
  authMethod: AuthMethod;
  selectedMethod: SelectedMethod;
  formData: FormData;
  isLoading: boolean;
  error?: string | null;
  token?: string | null;
  tokenLogin?: string | null;
  deviceToken: string | null;
  needOtp: boolean | null;
}

const persistedToken = Cookies.get("auth_token") || null;

const initialState: AuthenticationState = {
  loginCurrentStep: 1,
  authMethod: "email",
  selectedMethod: null,
  formData: {
    email: "",
    phone: "",
    countryCode: "US",
    password: "",
    pin: "",
    remember: false,
    deviceName: "Web Browser",
  },
  isLoading: false,
  error: null,
  token: persistedToken,
  tokenLogin: null,
  deviceToken: null,
  needOtp: null,
};

const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setLoginCurrentStep(
      state,
      action: PayloadAction<AuthenticationState["loginCurrentStep"]>
    ) {
      state.loginCurrentStep = action.payload;
      state.error = null;
    },
    setAuthMethod(state, action: PayloadAction<AuthMethod>) {
      state.authMethod = action.payload;
      state.error = null;
    },
    setSelectedMethod(state, action: PayloadAction<SelectedMethod>) {
      state.selectedMethod = action.payload;
      state.error = null;
    },
    setFormField(
      state,
      action: PayloadAction<{ field: keyof FormData; value: any }>
    ) {
      const { field, value } = action.payload;
      state.formData[field] = value;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
    resetState(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tokenLogin = action.payload.token_login;
        state.loginCurrentStep = 2;
      })
      .addCase(requestLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login request failed";
      });
    builder
      .addCase(loginWithPasswordOrPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPasswordOrPin.fulfilled, (state, action) => {
        state.isLoading = true;
        if ("token" in action.payload) {
          state.token = action.payload.token;   
          Cookies.set("auth_token", action.payload.token, {
            expires: state.formData.remember ? 30 : 1,
            secure: true,
            sameSite: "strict",
          });
        } else if ("need_otp" in action.payload) {
          state.needOtp = action.payload.need_otp;
          state.deviceToken = action.payload.device_token;
          state.loginCurrentStep = 4;
        }
      })
      .addCase(loginWithPasswordOrPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "login falied";
      });
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false
        Object.assign(state, initialState)
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "logout falied"
      })
  },
});

export const {
  setLoginCurrentStep,
  setAuthMethod,
  setSelectedMethod,
  setFormField,
  setLoading,
  setError,
  setToken,
  resetState,
} = authenticationSlice.actions;

export default authenticationSlice.reducer;
