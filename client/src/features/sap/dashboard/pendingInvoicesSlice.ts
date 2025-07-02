import { createSlice } from "@reduxjs/toolkit";
import { InvoicePendingUploadDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";

import { getPendingInvoicesThunk } from "./invoiceDashboardThunks";

interface PendingInvoicesState {
  invoicesLoaded: boolean;
  status: "idle" | "pending" | "rejected" | "success";
  invoices: InvoicePendingUploadDto[];
}

const initialState: PendingInvoicesState = {
  invoices: [],
  status: "idle",
  invoicesLoaded: false,
};

export const pendingDashboardInvoicesSlice = createSlice({
  name: "pendingDashboardInvoicesSlice",
  initialState: initialState,
  reducers: {
    resetPendingInvoices: (state) => {
      state.invoices = [];
      state.invoicesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPendingInvoicesThunk.rejected, (state, action) => {
      state.status = "rejected";
      console.log(action.payload);

    });
    builder.addCase(getPendingInvoicesThunk.pending, (state) => {
      state.status = "pending";
    
    });
    builder.addCase(getPendingInvoicesThunk.fulfilled, (state, action) => {
      state.status = "success";
      state.invoicesLoaded = true;
      state.invoices = action.payload;
    });
  },
});

export const { resetPendingInvoices } = pendingDashboardInvoicesSlice.actions;
