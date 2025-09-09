import { api } from "@/redux/helper";
import { ErrorResponse, SuccessResponse } from "@/redux/helper/types";
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * layer interface request 
 */
export interface StoreEmailTemplateRequest {
    key: string;
    language: "en_US";
    name: string;
    subject: string;
    title: string;
    content: string;
    category?: string | null;
    status: 'active' | 'inactive' | 'draft',
    type: "email" | 'system', 
}

interface UpdateEmailTemplate extends StoreEmailTemplateRequest {}

/**
 * layer resource response json
 */
export interface EmailTemplateResource {
    id: number;
    key: string;
    language: "en_US";
    name: string;
    view?: string;
    from: {
        name: string;
        email: string;
    };
    subject: string;
    preheader?: string;
    title: string;
    content: string;
    logo?: string;
    category: string;
    status: 'active' | 'inactive' | 'draft'
    type: "email" | 'system', 
    created_at: Date | string;
    updated_at?: Date | string;
    deleted_at?: Date | string;
}

/**
 * GET all templates
 */
export const getEmailTemplates = createAsyncThunk<
    EmailTemplateResource[],
    void,
    { rejectValue: string }
>("emailTemplate/getAll", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get<
            SuccessResponse<EmailTemplateResource[]> | ErrorResponse
        >("/admin/email-templete");

        const data = res.data;

        if (!data.success) {
            return rejectWithValue(
                data.message || "Failed to fetch email template settings"
            );
        }
        return data.data;
    } catch (err: any) {
        const message =
            err.response?.data?.message || err.message || "Network error";
        return rejectWithValue(message);
    }
});

/**
 * GET details by id
 */
export const getEmailTemplateDetails = createAsyncThunk<
    EmailTemplateResource,
    number,
    { rejectValue: string }
>("emailTemplate/getDetails", async (id, { rejectWithValue }) => {
    try {
        const res = await api.get<
            SuccessResponse<EmailTemplateResource> | ErrorResponse
        >(`/admin/email-templete/${id}`);

        const data = res.data;

        if (!data.success) {
            return rejectWithValue(
                data.message || "Failed to fetch email template details"
            );
        }
        return data.data;
    } catch (err: any) {
        const message =
            err.response?.data?.message || err.message || "Network error";
        return rejectWithValue(message);
    }
});

/**
 * CREATE new template
 */
export const createEmailTemplate = createAsyncThunk<
    EmailTemplateResource,
    StoreEmailTemplateRequest,
    { rejectValue: string }
>("emailTemplate/create", async (payload, { rejectWithValue }) => {
    try {
        const res = await api.post<
            SuccessResponse<EmailTemplateResource> | ErrorResponse
        >("/admin/email-templete", payload);

        const data = res.data;

        if (!data.success) {
            return rejectWithValue(
                data.message || "Failed to create email template"
            );
        }
        return data.data;
    } catch (err: any) {
        const message =
            err.response?.data?.message || err.message || "Network error";
        return rejectWithValue(message);
    }
});

/**
 * UPDATE template
 */
export const updateEmailTemplate = createAsyncThunk<
    EmailTemplateResource,
    { key: string; body: UpdateEmailTemplate },
    { rejectValue: string }
>("emailTemplate/update", async ({ key, body }, { rejectWithValue }) => {
    try {
        const res = await api.put<
            SuccessResponse<EmailTemplateResource> | ErrorResponse
        >(`/admin/email-templete/${key}`, body);

        const data = res.data;

        if (!data.success) {
            return rejectWithValue(
                data.message || "Failed to update email template"
            );
        }
        return data.data;
    } catch (err: any) {
        const message =
            err.response?.data?.message || err.message || "Network error";
        return rejectWithValue(message);
    }
});

/**
 * DELETE template
 */
export const deleteEmailTemplate = createAsyncThunk<
    { key: string },
    string,
    { rejectValue: string }
>("emailTemplate/delete", async (key, { rejectWithValue }) => {
    try {
        const res = await api.delete<SuccessResponse<{}> | ErrorResponse>(
            `/admin/email-templete/${key}`
        );

        const data = res.data;

        if (!data.success) {
            return rejectWithValue(
                data.message || "Failed to delete email template"
            );
        }
        return { key };
    } catch (err: any) {
        const message =
            err.response?.data?.message || err.message || "Network error";
        return rejectWithValue(message);
    }
});
