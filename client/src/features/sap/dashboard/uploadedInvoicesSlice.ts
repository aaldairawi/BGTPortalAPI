import { createSlice } from "@reduxjs/toolkit";
import { InvoiceHeaderDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";
import { getUploadedInvoicesThunk } from "./invoiceDashboardThunks";

interface UploadedInvoicesState {
  invoicesLoaded: boolean;
  status: "idle" | "pending" | "rejected" | "success";
  invoices: InvoiceHeaderDto[];
}

const initialState: UploadedInvoicesState = {
  invoices: [],
  status: "idle",
  invoicesLoaded: false,
};

export const uploadedDashboardInvoicesSlice = createSlice({
  name: "uploadedDashboardInvoicesSlice",
  initialState: initialState,
  reducers: {
    resetUploadedInvoicesDashboard: (state) => {
      state.invoices = [];
      state.invoicesLoaded = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUploadedInvoicesThunk.rejected, (state, action) => {
      state.status = "rejected";
      console.log(action.payload);
    });
    builder.addCase(getUploadedInvoicesThunk.pending, (state, action) => {
      state.status = "pending";
      console.log(action.payload);
    });
    builder.addCase(getUploadedInvoicesThunk.fulfilled, (state, action) => {
      state.status = "success";
      state.invoicesLoaded = true;
      state.invoices = action.payload;
    });
  },
});

export const { resetUploadedInvoicesDashboard} = uploadedDashboardInvoicesSlice.actions;
