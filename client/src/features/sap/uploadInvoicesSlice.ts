import { createSlice } from "@reduxjs/toolkit";

import { uploadInovicesToPreviewCSVThunk } from "./uploadInovicesToPreviewCSVThunk";

interface UploadInvoicesState {
  invoicesUploadedSuccessfully: boolean;
  status: "idle" | "success" | "pendingUploadInvoices" | "rejected";
}

const initialState: UploadInvoicesState = {
  status: "idle",
  invoicesUploadedSuccessfully: false,
};

export const uploadInvoicesSlice = createSlice({
  name: "uploadInvoicesSlice",
  initialState: initialState,
  reducers: {
    resetUploadState: (state) => {
      state.invoicesUploadedSuccessfully = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      uploadInovicesToPreviewCSVThunk.rejected,
      (state, action) => {
        console.log(action.payload);
        state.status = "rejected";
        state.invoicesUploadedSuccessfully = false;
      }
    );
    builder.addCase(
      uploadInovicesToPreviewCSVThunk.pending,
      (state, action) => {
        state.status = "pendingUploadInvoices";
        console.log(action.payload);
      }
    );
    builder.addCase(
      uploadInovicesToPreviewCSVThunk.fulfilled,
      (state, action) => {
        state.status = "idle";
        state.invoicesUploadedSuccessfully = action.payload;
      }
    );
  },
});

export const { resetUploadState } = uploadInvoicesSlice.actions;
