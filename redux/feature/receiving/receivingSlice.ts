import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ReceivingState,
  CarrierType,
  ShippingAddressType,
  Warehouse,
  Customer,
  ShippingSizeType,
  PackageType,
} from "./types";
import { createPackage } from "./receivingThunks";

// Initial state
const initialReceivingState: ReceivingState = {
  currentStep: 1,
  currentLabel: null,
  customerCode: null,
  shippingAddress: null,
  labelId: null,
  labelWarehouse: null,
  carrierTracking: null,
  carrier: null,
  warehouseLocationId: null,
  warehouse: null,
  customer: null,
  capturedImages: [],
  arrivalTime: null,
  deadlineTime: null,
  weight: null,
  dimension: null,
  sender_name: null,
  shipping_size: null,
  package_type: null,
  scannedItems: [], // Initialize empty scannedItems array
};

const receivingSlice = createSlice({
  name: "receiving",
  initialState: initialReceivingState,
  reducers: {
    // Update a specific property in the current receiving state
    updateReceivingState: <K extends keyof ReceivingState>(
      state: ReceivingState,
      action: PayloadAction<{ key: K; value: ReceivingState[K] }>
    ) => {
      const { key, value } = action.payload;
      state[key] = value;
    },

    // Add the current receiving state to scannedItems and reset receiving (except scannedItems and customer)
    addScannedItem: (state) => {
      // Create a copy of current state without the nested scannedItems
      const { scannedItems, ...currentStateWithoutScannedItems } = state;

      // Add current state to scannedItems, exclude nested scannedItems
      const newItem = { ...state, scannedItems: [] };

      // Reset to initial state but preserve customer and scannedItems
      Object.assign(state, {
        ...initialReceivingState,
        customer: state.customer, // Preserve customer data
        scannedItems: [...state.scannedItems, newItem], // Add current state to scannedItems
      });
    },

    // Reset the current receiving state (except scannedItems and customer)
    resetReceiving: (state) => {
      Object.assign(state, {
        ...initialReceivingState,
        customer: state.customer, // Preserve customer data
        scannedItems: state.scannedItems, // Preserve scannedItems
      });
    },

    // Reset scannedItems only
    resetScannedItems: (state) => {
      state.scannedItems = [];
    },

    // Reset the entire receiving state
    resetAllReceiving: () => initialReceivingState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPackage.pending, (state) => {
        // Handle pending state if needed
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        // Handle successful package creation if needed
      })
      .addCase(createPackage.rejected, (state, action) => {
        // Handle error state if needed
        console.error("Failed to create package:", action.payload);
      });
  },
});

export const {
  updateReceivingState,
  addScannedItem,
  resetReceiving,
  resetScannedItems,
  resetAllReceiving,
} = receivingSlice.actions;

export default receivingSlice.reducer;
