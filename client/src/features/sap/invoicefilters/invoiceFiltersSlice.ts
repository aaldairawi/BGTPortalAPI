import { createSlice } from "@reduxjs/toolkit";
import {
  getCTypeInvoiceFiltersAsync,
  getSTypeInvoiceFiltersAsync,
} from "./getInvoiceFiltersThunk";
import { InvoiceFilters } from "../../../app/models/invoice/invoice.types";

interface InvoiceFiltersGroup {
  invoiceFiltersLoaded: boolean;
  invoiceOrderByFilters: InvoiceFilters[];
  invoiceTypeFilters: InvoiceFilters[];
  status:
    | "idle"
    | "getCTypeInvoiceFiltersPending"
    | "getSTypeInvoiceFiltersPending";
}

interface InvoiceFiltersState {
  cType: InvoiceFiltersGroup;
  sType: InvoiceFiltersGroup;
}
const initialState: InvoiceFiltersState = {
  cType: {
    invoiceFiltersLoaded: false,
    invoiceOrderByFilters: [],
    invoiceTypeFilters: [],
    status: "idle",
  },
  sType: {
    invoiceFiltersLoaded: false,
    invoiceOrderByFilters: [],
    invoiceTypeFilters: [],
    status: "idle",
  },
};

export const invoiceFiltersSlice = createSlice({
  name: "invoiceFiltersSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // C-Type
    builder.addCase(getCTypeInvoiceFiltersAsync.pending, (state) => {
      state.cType.status = "getCTypeInvoiceFiltersPending";
    });
    builder.addCase(getCTypeInvoiceFiltersAsync.rejected, (state) => {
      state.cType.status = "idle";
    });
    builder.addCase(getCTypeInvoiceFiltersAsync.fulfilled, (state, action) => {
      state.cType.invoiceOrderByFilters = action.payload.invoiceOrderByHeaders;
      state.cType.invoiceTypeFilters = action.payload.invoiceTypesByIdResult;
      state.cType.status = "idle";
      state.cType.invoiceFiltersLoaded = true;
    });

    // S-Type
    builder.addCase(getSTypeInvoiceFiltersAsync.pending, (state) => {
      state.sType.status = "getSTypeInvoiceFiltersPending";
    });
    builder.addCase(getSTypeInvoiceFiltersAsync.rejected, (state) => {
      state.sType.status = "idle";
    });
    builder.addCase(getSTypeInvoiceFiltersAsync.fulfilled, (state, action) => {
      state.sType.invoiceOrderByFilters = action.payload.invoiceOrderByHeaders;
      state.sType.invoiceTypeFilters = action.payload.invoiceTypesByIdResult;
      state.sType.status = "idle";
      state.sType.invoiceFiltersLoaded = true;
    });
  },
});

