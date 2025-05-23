/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  FinalizedInvoiceDto,
  InvoiceFilters,
  InvoiceParams,
  InvoicesLoadedDetails,
} from "../../app/models/invoice/invoice.types";
import { RootState } from "../../app/store/configureStore";
import { getAllFinalizedInvoicesAsync } from "./getAllFinalizedInvoicesThunk";
import { getInvoiceFiltersAsync } from "./getInvoiceFiltersThunk";
import { getOneFinalizedInvoiceByFinalIdAsync } from "./getOneFinalizedInvoiceThunk";
import { calculateInvoicesTotalAmount } from "../../app/helper/invoice";

interface FinalizedInvoicesState {
  invoicesLoaded: boolean;
  invoiceFiltersLoaded: boolean;

  invoiceOrderByFilters: InvoiceFilters[];
  invoiceTypeFilters: InvoiceFilters[];

  status: string;
  invoicesLoadedDetails: InvoicesLoadedDetails | null;
  invoiceParams: InvoiceParams;
}

const invoicesAdapter = createEntityAdapter<FinalizedInvoiceDto>();

export const getAxiosParams = (invoiceParams: InvoiceParams) => {
  const params = new URLSearchParams();
  params.append("orderBy", invoiceParams.orderBy);
  params.append("invoiceType", invoiceParams.invoiceType);
  params.append("finalizedDate", invoiceParams.dateFinalized);

  return params;
};


const initParams = (): InvoiceParams => {
  const defaultTodaysDate = new Date();
  const year = defaultTodaysDate.getFullYear();
  const month = defaultTodaysDate.getMonth() + 1;
  const day = defaultTodaysDate.getDate();

  return {
    dateFinalized: `${year}-${month}-${day}`,
    orderBy: "Final",
    invoiceType: "C1_",
  };
};

export const finalizedInvoicesSlice = createSlice({
  name: "finalizedInvoicesSlice",
  initialState: invoicesAdapter.getInitialState<FinalizedInvoicesState>({
    invoicesLoaded: false,

    invoiceFiltersLoaded: false,
    invoiceOrderByFilters: [],

    invoiceTypeFilters: [],
    status: "idle",
    invoiceParams: initParams(),

    invoicesLoadedDetails: {
      invoicesLoadedLength: 0,
      invoicesLoadedType: "",
      invoicesLoadedTotalAmount: "",
    },
  }),

  reducers: {
    setInvoiceParams: (state, action) => {
      state.invoiceParams = { ...state.invoiceParams, ...action.payload };
    },

    resetInvoiceParams: (state) => {
      state.invoiceParams = initParams();
    },
    resetInvoicesLoaded: (state) => {
      state.invoicesLoaded = false;
      state.invoicesLoadedDetails = null;
      invoicesAdapter.removeAll(state);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllFinalizedInvoicesAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getAllFinalizedInvoicesAsync.pending, (state) => {
      state.status = "pendingGetAllFinalizedInvoicesAsync";
    });
    builder.addCase(getAllFinalizedInvoicesAsync.fulfilled, (state, action) => {
      invoicesAdapter.setAll(state, action.payload.invoices);
      state.status = "idle";
      state.invoicesLoaded = true;

      state.invoicesLoadedDetails = {
        invoicesLoadedLength: action.payload.invoicesLength,
        invoicesLoadedTotalAmount: calculateInvoicesTotalAmount(
          action.payload.invoices
        ),
        invoicesLoadedType: action.payload.invoiceId,
      };
    });

    builder.addCase(getOneFinalizedInvoiceByFinalIdAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getOneFinalizedInvoiceByFinalIdAsync.pending, (state) => {
      state.status = "pendingGetOneFinalizedInvoiceById";
    });
    builder.addCase(
      getOneFinalizedInvoiceByFinalIdAsync.fulfilled,
      (state, action) => {
        state.invoicesLoaded = true;
        state.status = "idle";
        invoicesAdapter.setAll(state, action.payload.invoices);
        state.invoicesLoadedDetails = {
          invoicesLoadedLength: action.payload.invoicesLength,
          invoicesLoadedTotalAmount: calculateInvoicesTotalAmount(
            action.payload.invoices
          ),
          invoicesLoadedType: action.payload.invoiceId,
        };
      }
    );

    builder.addCase(getInvoiceFiltersAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getInvoiceFiltersAsync.pending, (state) => {
      state.status = "pendingGetInvoiceFiltersAsync";
    });
    builder.addCase(getInvoiceFiltersAsync.fulfilled, (state, action) => {
      state.invoiceTypeFilters = action.payload.invoiceTypesByIdResult;

      state.invoiceOrderByFilters = action.payload.invoiceOrderByHeaders;
      state.status = "idle";
      state.invoiceFiltersLoaded = true;
    });
  },
});

export const invoicesSelector = invoicesAdapter.getSelectors(
  (state: RootState) => state.finalizedInvoices
);

export const { resetInvoicesLoaded, resetInvoiceParams, setInvoiceParams } =
  finalizedInvoicesSlice.actions;
