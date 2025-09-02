import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { sendLoginRequest, verifyLoginCredential } from "./authThunk";
import { tokenStorage } from "@/redux/helper/axios";

interface AuthState {
  token: string | null;
  loginToken: string | null;
  loading: boolean;
  error: string | null;
  step: "idle" | "awaitingCredential" | "awaitingOtp" | "authenticated";
  method: "password" | "pin" | null;
  message: string | null;
}

const initialState: AuthState = {
  token: null,
  loginToken: null,
  loading: false,
  error: null,
  step: "idle",
  method: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoginMethod: (state, action: PayloadAction<"password" | "pin">) => {
      state.method = action.payload;
      state.step = "awaitingCredential";
    },
    logout: (state) => {
      state.token = null;
      state.loginToken = null;
      state.step = "idle";
      state.method = null;
      state.error = null;
      state.message = null;
      tokenStorage.clearAll(); // ✅ hapus semua token dari localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      /* STEP 1: Login Request */
      .addCase(sendLoginRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.loginToken = action.payload.token_login;
        state.step = "awaitingCredential";
        state.message = "Please enter your password or PIN.";

        // ✅ simpan login token sementara
        tokenStorage.setLoginToken(action.payload.token_login);
      })
      .addCase(sendLoginRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      /* STEP 2: Verify Credential */
      .addCase(verifyLoginCredential.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginCredential.fulfilled, (state, action) => {
        state.loading = false;
        if ("token" in action.payload) {
          // ✅ sukses login
          state.token = action.payload.token;
          state.step = "authenticated";
          state.message = "Login successful!";

          // simpan auth token & hapus login token
          tokenStorage.setAuthToken(action.payload.token);
          tokenStorage.clearLoginToken();
        } else if ("need_otp" in action.payload) {
          // butuh OTP
          state.step = "awaitingOtp";
          state.message = "OTP required. Please check your device.";
        } else {
          state.error = "Unexpected response format.";
        }
      })
      .addCase(verifyLoginCredential.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoginMethod, logout } = authSlice.actions;
export default authSlice.reducer;
