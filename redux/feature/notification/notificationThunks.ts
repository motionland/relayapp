import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/redux/helper";
import type { ErrorResponse, SuccessResponse } from "@/redux/helper/types";

/**
 * request types
 */
export interface UpdateNotificationRequest {
  is_email?: boolean;
  is_sms?: boolean;
  is_push_notification?: boolean;
}

export interface UpdateNotifyPreferenceRequest {
  is_package_arrival?: boolean;
  is_pickup_ready?: boolean;
  is_pickup_reminder?: boolean;
  is_pickup_final_reminder?: boolean;
  is_package_delivered_to_locker_or_alternative_location?: boolean;
  is_delivery_confirmation?: boolean;
  is_delay_notice?: boolean;
  is_special_handling_required?: boolean;
  is_account_or_subscription?: boolean;
}

export interface GetNotificationRequest {
  email?: string | null;
}

/**
 * response types
 */
export interface ResponseNotificationSettings {
  user_id: number;
  is_email: boolean;
  is_sms: boolean;
  is_push_notification: boolean;
}

export interface ResponseNotifyPreferenceSettings {
  user_id: number;
  is_package_arrival: boolean;
  is_pickup_ready: boolean;
  is_pickup_reminder: boolean;
  is_pickup_final_reminder: boolean;
  is_package_delivered_to_locker_or_alternative_location: boolean;
  is_delivery_confirmation: boolean;
  is_delay_notice: boolean;
  is_special_handling_required: boolean;
  is_account_or_subscription: boolean;
}

/**
 * wrapper response
 */
export interface ResponseNotification {
  notification: ResponseNotificationSettings;
  preference: ResponseNotifyPreferenceSettings;
}

/**
 * logic layer
 */
export const getAdminNotificationSettings = createAsyncThunk<
  ResponseNotification,
  GetNotificationRequest,
  { rejectValue: string }
>(
  "notification/getAdminNotificationSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.get<
        SuccessResponse<ResponseNotification> | ErrorResponse
      >("/admin/user/notification", {
        params: payload,
      });

      const data = res.data;

      if (!data.success) {
        return rejectWithValue(
          data.message || "Failed to fetch notification settings"
        );
      }

      return data.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(message);
    }
  }
);

export const updateAdminNotificationSettings = createAsyncThunk<
  ResponseNotificationSettings,
  UpdateNotificationRequest,
  { rejectValue: string }
>(
  "notification/updateAdminNotificationSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put<
        SuccessResponse<ResponseNotificationSettings> | ErrorResponse
      >("/admin/user/notification", payload);
      const data = res.data;

      if (!data.success) {
        return rejectWithValue(
          data.message || "Failed to fetch notification settings"
        );
      }

      return data.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(message);
    }
  }
);

export const updateAdminNotifyPreference = createAsyncThunk<
  ResponseNotifyPreferenceSettings,
  UpdateNotifyPreferenceRequest,
  { rejectValue: string }
>(
  "notification/updateAdminNotifyPreference",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put<
        SuccessResponse<ResponseNotifyPreferenceSettings> | ErrorResponse
      >("/admin/user/notify-preference", payload);

      const data = res.data;

      if (!data.success) {
        return rejectWithValue(
          data.message || "Failed to update notify preference"
        );
      }

      return data.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Network error";
      return rejectWithValue(message);
    }
  }
);
