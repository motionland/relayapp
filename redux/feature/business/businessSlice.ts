import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessState {
  status: string | null;
  loading: boolean;
  error: string | null;
  data?: any;
  uploadProgress?: number | null;
}

const initialState: BusinessState = {
  status: null,
  loading: false,
  error: null,
  data: undefined,
  uploadProgress: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<string | null>) {
      state.status = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setUploadProgress(state, action: PayloadAction<number | null>) {
      state.uploadProgress = action.payload;
    },
    setData(state, action: PayloadAction<any>) {
      state.data = action.payload;
    },
    reset(state) {
      state.status = "none";
      state.loading = false;
      state.error = null;
      state.data = undefined;
      state.uploadProgress = null;
    },
  },
});

export const {
  setStatus,
  setLoading,
  setError,
  setUploadProgress,
  setData,
  reset,
} = businessSlice.actions;

export default businessSlice.reducer;
