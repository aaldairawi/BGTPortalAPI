import { createSlice } from "@reduxjs/toolkit";
import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import { getSingleInvoiceThunk } from "./getSingleInvoiceThunk";

type SingleInvoiceState = {
  status: "idle" | "pending" | "failed" | "success";
  singleInvoiceResult: FinalizedInvoiceDto | null;
  invoiceLoaded: boolean;
};

const initialState: SingleInvoiceState = {
  status: "idle",
  singleInvoiceResult: null,
  invoiceLoaded: false,
};
export const singleInvoiceSlice = createSlice({
  name: "singleInvoiceSlice",
  initialState: initialState,
  reducers: {
    resetSingleInvoiceLoaded: (state) => {
      state.invoiceLoaded = false;
      state.singleInvoiceResult = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleInvoiceThunk.rejected, (state, action) => {
      state.status = "failed";
      console.log(action.payload);
    });
    builder.addCase(getSingleInvoiceThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getSingleInvoiceThunk.fulfilled, (state, action) => {
      state.status = "success";
      state.invoiceLoaded = true;
      state.singleInvoiceResult = action.payload;
      console.log(action.payload);
    });
  },
});

export const { resetSingleInvoiceLoaded } = singleInvoiceSlice.actions;
