import { createSlice } from "@reduxjs/toolkit";

import { uploadConsigneeInvoicesToPreviewCSVThunk } from "./uploadConsigneeInvoicesThunk";

interface UploadInvoicesState {
  invoicesUploadedSuccessfully: boolean;
  status: "idle" | "success" | "pendingUploadInvoices" | "rejected";
}

const initialState: UploadInvoicesState = {
  status: "idle",
  invoicesUploadedSuccessfully: false,
};

export const uploadConsigneeInvoicesSlice = createSlice({
  name: "uploadConsigneeInvoicesSlice",
  initialState: initialState,
  reducers: {
    resetUploadState: (state) => {
      state.invoicesUploadedSuccessfully = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      uploadConsigneeInvoicesToPreviewCSVThunk.rejected,
      (state, action) => {
        console.log(action.payload);
        state.status = "rejected";
        state.invoicesUploadedSuccessfully = false;
      }
    );
    builder.addCase(uploadConsigneeInvoicesToPreviewCSVThunk.pending, (state) => {
      state.status = "pendingUploadInvoices";
    });
    builder.addCase(
      uploadConsigneeInvoicesToPreviewCSVThunk.fulfilled,
      (state, action) => {
        state.status = "idle";
        state.invoicesUploadedSuccessfully = action.payload;
      }
    );
  },
});

export const { resetUploadState } = uploadConsigneeInvoicesSlice.actions;
