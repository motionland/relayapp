import { createSlice } from "@reduxjs/toolkit";
import type {
  ResponseNotification,
  ResponseNotificationSettings,
  ResponseNotifyPreferenceSettings,
} from "./notificationThunks";
import {
  getAdminNotificationSettings,
  updateAdminNotificationSettings,
  updateAdminNotifyPreference,
} from "./notificationThunks";

interface NotificationState {
  notification: ResponseNotificationSettings | null;
  preference: ResponseNotifyPreferenceSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notification: null,
  preference: null,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /**
     * getAdminNotificationSettings
     */
    builder
      .addCase(getAdminNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload.notification;
        state.preference = action.payload.preference;
      })
      .addCase(getAdminNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notification settings";
      });

    /**
     * updateAdminNotificationSettings
     */
    builder
      .addCase(updateAdminNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.notification = action.payload;
      })
      .addCase(updateAdminNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update notification settings";
      });

    /**
     * updateAdminNotifyPreference
     */
    builder
      .addCase(updateAdminNotifyPreference.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminNotifyPreference.fulfilled, (state, action) => {
        state.loading = false;
        state.preference = action.payload;
      })
      .addCase(updateAdminNotifyPreference.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update notify preference settings";
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
