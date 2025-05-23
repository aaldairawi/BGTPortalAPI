import { createSlice } from "@reduxjs/toolkit";

import { uploadInvoicesToSap } from "./uploadInvoicesToSapThunk";

interface UploadInvoicesState {
  invoicesUploadedSuccessfully: boolean;
  status: string;
  uploadFailed: boolean;
}

const initialState: UploadInvoicesState = {
  status: "idle",
  invoicesUploadedSuccessfully: false,
  uploadFailed: false,
};

export const uploadInvoicesSlice = createSlice({
  name: "uploadInvoicesSlice",
  initialState: initialState,
  reducers: {
    resetUploadState: (state) => {
      state.invoicesUploadedSuccessfully = false;
      state.uploadFailed = false;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadInvoicesToSap.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
      state.uploadFailed = true;
    });
    builder.addCase(uploadInvoicesToSap.pending, (state, action) => {
      state.status = "pendingUploadInvoices";
      console.log(action.payload);
    });
    builder.addCase(uploadInvoicesToSap.fulfilled, (state, action) => {
      state.status = "idle";
      state.invoicesUploadedSuccessfully = action.payload;
      console.log(action.payload);
      state.uploadFailed = !action.payload;
    });
  },
});

export const { resetUploadState } = uploadInvoicesSlice.actions;
