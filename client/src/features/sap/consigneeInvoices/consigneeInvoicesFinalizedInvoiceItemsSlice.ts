import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  ConsigneeInvoiceItemDto,
} from "../../../app/models/invoice/invoice.types";
import { getConsigneeInvoiceItemsThunk } from "../getFinalizedInvoiceItemsThunk";

interface ConsigneeInvoiceFinalizedInvoiceItemsState {
  consigneeInvoiceItems: ConsigneeInvoiceItemDto[];
  showInvoiceItemBackdrop: boolean;
  status: string;
}

const initialState: ConsigneeInvoiceFinalizedInvoiceItemsState = {
  consigneeInvoiceItems: [],
  showInvoiceItemBackdrop: false,
  status: "idle",
};

export const consigneeInvoicesFinalizedInvoiceItemsSlice = createSlice({
  name: "consigneeInvoicesFinalizedInvoiceItemsSlice",
  initialState,
  reducers: {
    onHandleHideInvoiceItemBackdrop: (state) => {
      state.showInvoiceItemBackdrop = false;
      state.consigneeInvoiceItems = [];
    },
    resetFinalizedInvoiceItems: () => initialState,
  },

  extraReducers: (builder) => {
    builder.addCase(getConsigneeInvoiceItemsThunk.pending, (state, action) => {
      state.status = "pending" + action.meta.arg;
    });
    builder.addCase(getConsigneeInvoiceItemsThunk.rejected, (state) => {
      state.status = "failed";
      state.showInvoiceItemBackdrop = false;
      state.consigneeInvoiceItems = [];
    });
    builder.addCase(
      getConsigneeInvoiceItemsThunk.fulfilled,
      (state, action: PayloadAction<ConsigneeInvoiceItemDto[]>) => {
        state.consigneeInvoiceItems = action.payload;
        state.showInvoiceItemBackdrop = true;
        state.status = "succeeded";
      }
    );
  },
});

export const { onHandleHideInvoiceItemBackdrop, resetFinalizedInvoiceItems } =
  consigneeInvoicesFinalizedInvoiceItemsSlice.actions;

export default consigneeInvoicesFinalizedInvoiceItemsSlice.reducer;
