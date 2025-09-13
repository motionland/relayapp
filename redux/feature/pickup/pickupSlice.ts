import { PickupState } from "./type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialPickupState: PickupState = {
  currentStep: 1,
  selectedPackages: [],
  customerData: null,
};

const pickupSlice = createSlice({
  name: "pickup",
  initialState: initialPickupState,
  reducers: {
    updatePickupState: <K extends keyof PickupState>(
      state: PickupState,
      action: PayloadAction<{ key: K; value: PickupState[K] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },
    resetPickup: (state) => {
      Object.assign(state, initialPickupState);
    },
  },
});

export const { updatePickupState, resetPickup } = pickupSlice.actions;
export default pickupSlice.reducer;
