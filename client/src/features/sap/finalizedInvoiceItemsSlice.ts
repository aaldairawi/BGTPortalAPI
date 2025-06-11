import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { InvoiceItemUnion } from "../../app/models/invoice/invoice.types";
import { getFinalizedInvoiceItemsThunk } from "./getFinalizedInvoiceItemsThunk";

interface FinalizedInvoiceItemsState {
  invoiceItems: InvoiceItemUnion[];
  showInvoiceItemBackdrop: boolean;
  status: string;
}

const initialState: FinalizedInvoiceItemsState = {
  invoiceItems: [],
  showInvoiceItemBackdrop: false,
  status: "idle",
};

export const finalizedInvoiceItemsSlice = createSlice({
  name: "finalizedInvoiceItemsSlice",
  initialState,
  reducers: {
    onHandleHideInvoiceItemBackdrop: (state) => {
      state.showInvoiceItemBackdrop = false;
      state.invoiceItems = [];
    },
    resetFinalizedInvoiceItems: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getFinalizedInvoiceItemsThunk.pending, (state, action) => {
        console.log(action.meta.arg);
        state.status = "pending" + action.meta.arg;
      }
    )
      .addCase(
        getFinalizedInvoiceItemsThunk.fulfilled,
        (state, action: PayloadAction<InvoiceItemUnion[]>) => {
          state.invoiceItems = action.payload;
          state.showInvoiceItemBackdrop = true;
          state.status = "succeeded";
        }
      )
      .addCase(getFinalizedInvoiceItemsThunk.rejected, (state) => {
        state.status = "failed";
        state.showInvoiceItemBackdrop = false;
        state.invoiceItems = [];
      });
  },
});

export const { onHandleHideInvoiceItemBackdrop, resetFinalizedInvoiceItems } =
  finalizedInvoiceItemsSlice.actions;

export default finalizedInvoiceItemsSlice.reducer;
