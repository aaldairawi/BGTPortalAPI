/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice } from "@reduxjs/toolkit";
import { SLParentAndPartnerInvoiceItemsDto } from "../../../app/models/invoice/invoice.types";

import { getShippingLineAndPartnerInvoiceItemsThunk } from "./getShippingLineAndPartnerInvoiceItemsThunk";

interface ShippingLineInvoiceItemsState {
  shippingLinePartnerItems: SLParentAndPartnerInvoiceItemsDto | null;
  shippingLineInvoiceItemsLoaded: boolean;
  status: string;
  displayShippingLineInvoiceItems: boolean;
}

const initialState: ShippingLineInvoiceItemsState = {
  shippingLinePartnerItems: null,
  shippingLineInvoiceItemsLoaded: false,
  status: "idle",
  displayShippingLineInvoiceItems: false,
};
export const shippingLineInvoiceItemsSlice = createSlice({
  name: "shippingLineInvoiceItemsSlice",
  initialState: initialState,

  reducers: {
    closeItemsDisplay: (state) => {
      state.displayShippingLineInvoiceItems = false;
      state.shippingLinePartnerItems = null;
      state.shippingLineInvoiceItemsLoaded = false;
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      getShippingLineAndPartnerInvoiceItemsThunk.rejected,
      (state, action) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addCase(
      getShippingLineAndPartnerInvoiceItemsThunk.pending,
      (state, action) => {
        const invoiceGkey = action.meta.arg;
        state.status = "pending" + invoiceGkey;
      }
    );
    builder.addCase(
      getShippingLineAndPartnerInvoiceItemsThunk.fulfilled,
      (state, action) => {
        state.shippingLinePartnerItems = action.payload;
        state.status = "success";
        state.shippingLineInvoiceItemsLoaded = true;
        state.displayShippingLineInvoiceItems = true;
      }
    );
  },
});

export const { closeItemsDisplay } = shippingLineInvoiceItemsSlice.actions;
