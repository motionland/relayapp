import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getEmailTemplates,
  getEmailTemplateDetails,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  EmailTemplateResource,
} from "@/redux/feature/emailTemplete/emailTempleteThunk";

type FormMode = "create" | "edit" | "duplicate";

interface EmailTemplateState {
  list: EmailTemplateResource[];
  detail: EmailTemplateResource | null;
  loading: boolean;
  error: string | null;
  showEmailTemplateForm: {
    open: boolean;
    mode: FormMode | null;
  };
}

const initialState: EmailTemplateState = {
  list: [],
  detail: null,
  loading: false,
  error: null,
  showEmailTemplateForm: {
    open: false,
    mode: null,
  },
};

export const emailTemplateSlice = createSlice({
  name: "emailTemplate",
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
    showForm(
      state,
      action: PayloadAction<{
        mode: FormMode;
        template?: EmailTemplateResource;
      }>
    ) {
      state.showEmailTemplateForm = { open: true, mode: action.payload.mode };
      state.detail = action.payload.template || null;
    },
    hideForm(state) {
      state.showEmailTemplateForm = { open: false, mode: null };
      state.detail = null;
    },
  },
  extraReducers: (builder) => {
    // GET ALL
    builder
      .addCase(getEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch email templates";
      });

    // GET DETAIL
    builder
      .addCase(getEmailTemplateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmailTemplateDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(getEmailTemplateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch template details";
      });

    // CREATE
    builder
      .addCase(createEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create template";
      });

    // UPDATE
    builder
      .addCase(updateEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map((tpl) =>
          tpl.key === action.payload.key ? action.payload : tpl
        );
        if (state.detail?.key === action.payload.key) {
          state.detail = action.payload;
        }
      })
      .addCase(updateEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update template";
      });

    // DELETE
    builder
      .addCase(deleteEmailTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmailTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter((tpl) => tpl.key !== action.payload.key);
        if (state.detail?.key === action.payload.key) {
          state.detail = null;
        }
      })
      .addCase(deleteEmailTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete template";
      });
  },
});

export const { clearDetail, clearError, showForm, hideForm } = emailTemplateSlice.actions;

export default emailTemplateSlice.reducer;
