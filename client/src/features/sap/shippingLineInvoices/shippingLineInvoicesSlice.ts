import { createSlice } from "@reduxjs/toolkit";
import { FinalizedInvoiceDto } from "../../../app/models/invoice/invoice.types";

import { getShippingLineInvoicesByFinalizedDateThunk } from "./getShippingLineInvoiceThunk";

interface STypeInvoicesState {
  invoicesLoaded: boolean;
  status: "idle" | "rejected" | "success" | "pending";
  shippingLineInvoices: FinalizedInvoiceDto[];
}

const initialState: STypeInvoicesState = {
  shippingLineInvoices: [],
  status: "idle",
  invoicesLoaded: false,
};
export const shippingLineInvoicesSlice = createSlice({
  name: "shippingLineInvoicesSlice",
  initialState: initialState,

  reducers: {
    resetSTypeInvoices: (state) => {
      state.invoicesLoaded = false;
      state.shippingLineInvoices = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      getShippingLineInvoicesByFinalizedDateThunk.rejected,
      (state) => {
        state.status = "rejected";
      }
    );
    builder.addCase(
      getShippingLineInvoicesByFinalizedDateThunk.pending,
      (state) => {
        state.status = "pending";
      }
    );
    builder.addCase(
      getShippingLineInvoicesByFinalizedDateThunk.fulfilled,
      (state, action) => {
        state.status = "success";
        state.invoicesLoaded = true;
        state.shippingLineInvoices = action.payload;
      }
    );
  },
});

export const { resetSTypeInvoices } = shippingLineInvoicesSlice.actions;
