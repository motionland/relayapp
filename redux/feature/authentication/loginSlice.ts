import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  isEmailMode: boolean;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  login_token: string | null;
  isAuthenticated: boolean;
}

interface LoginSliceState {
  loginState: LoginState;
}

const initialLoginState: LoginState = {
  isEmailMode: true,
  email: null,
  phone: null,
  countryCode: null,
  login_token: null,
  isAuthenticated: false,
};

const initialState: LoginSliceState = {
  loginState: initialLoginState,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    updateLoginState: <K extends keyof LoginState>(
      state: LoginSliceState,
      action: PayloadAction<{ key: K; value: LoginState[K] }>
    ) => {
      const { key, value } = action.payload;
      state.loginState[key] = value;
    },
    resetLogin: (state: LoginSliceState) => {
      state.loginState = initialLoginState;
    },
    setAuthenticated: (state: LoginSliceState, action: PayloadAction<boolean>) => {
      state.loginState.isAuthenticated = action.payload;
    },
  },
});

export const { updateLoginState, resetLogin, setAuthenticated } = loginSlice.actions;

export default loginSlice.reducer;
