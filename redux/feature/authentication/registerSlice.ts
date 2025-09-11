import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegisterState {
  registerStep: number;
  isEmailMode: boolean;
  email: string | null;
  phone: string | null;
  countryCode: string | null;
  full_name: string | null;
  password: string | null;
  confirm_password: string | null;
  passcode: string | null;
  confirm_passcode: string | null;
  register_token: string | null;
}

interface RegisterSliceState {
  registerState: RegisterState;
}

const initialRegisterState: RegisterState = {
  registerStep: 1,
  isEmailMode: true,
  email: null,
  phone: null,
  countryCode: null,
  full_name: null,
  password: null,
  confirm_password: null,
  passcode: null,
  confirm_passcode: null,
  register_token: null,
};

const initialState: RegisterSliceState = {
  registerState: initialRegisterState,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    updateRegisterState: <K extends keyof RegisterState>(
      state: RegisterSliceState,
      action: PayloadAction<{ key: K; value: RegisterState[K] }>
    ) => {
      const { key, value } = action.payload;
      state.registerState[key] = value;
    },
    resetRegister: (state: RegisterSliceState) => {
      state.registerState = initialRegisterState;
    },
  },
});

export const { updateRegisterState, resetRegister } = registerSlice.actions;

export default registerSlice.reducer;
