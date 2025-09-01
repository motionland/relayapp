import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../helper/axios";
import { setUploadProgress, setData, setStatus, setError } from "./businessSlice";

/**
 * submitBusinessApplication
 * payload: FormData
 */
export const submitBusinessApplication = createAsyncThunk(
  "business/submit",
  async (formData: FormData, thunkAPI) => {
    try {
      const res = await api.post("/business/business-application", formData, {
        onUploadProgress: (ev) => {
          const pct = ev.total ? Math.round((ev.loaded * 100) / ev.total) : 0;
          thunkAPI.dispatch(setUploadProgress(pct));
        },
        headers: {
           "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data.data;
      thunkAPI.dispatch(setData(data));
      thunkAPI.dispatch(setStatus("pending"));
      thunkAPI.dispatch(setUploadProgress(100));
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to submit business application";
      thunkAPI.dispatch(setError(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * fetchBusinessStatus
 * get current status for logged user
 */
export const fetchBusinessStatus = createAsyncThunk(
  "business/fetchStatus",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/business/me");
      const data = res.data.data;

      if (data?.status) {
        thunkAPI.dispatch(setStatus(data.status));
      }

      thunkAPI.dispatch(setData(data));
      return data;
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch business status";
      thunkAPI.dispatch(setError(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

