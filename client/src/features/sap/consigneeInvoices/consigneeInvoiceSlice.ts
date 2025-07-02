

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  FinalizedInvoiceDto,
  InvoiceParams,
  InvoicesLoadedDetails,
} from "../../../app/models/invoice/invoice.types";

import { RootState } from "../../../app/store/configureStore";

import { getConsigneeInvoicesThunk } from "./getConsigneeInvoicesThunk";
import { calculateInvoicesTotalAmount } from "../../../app/helper/invoiceTotalsAndFormat";

interface CTypeInvoicesState {
  invoicesLoaded: boolean;
  status: "idle" | "success" | "rejected" | "pending";
  cTypeInvoiceLoadedDetails: InvoicesLoadedDetails | null;
  cTypeInvoiceParams: InvoiceParams;
}

const invoicesAdapter = createEntityAdapter<FinalizedInvoiceDto>();

export const getAxiosParams = (invoiceParams: InvoiceParams) => {
  const params = new URLSearchParams();

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
    invoiceType: "C1_",
  };
};

export const consigneeInvoiceSlice = createSlice({
  name: "consigneeInvoiceSlice ",
  initialState: invoicesAdapter.getInitialState<CTypeInvoicesState>({
    invoicesLoaded: false,
    status: "idle",
    cTypeInvoiceParams: initParams(),
    cTypeInvoiceLoadedDetails: {
      invoicesLoadedLength: 0,
      invoicesLoadedTotalAmount: "",
    },
  }),

  reducers: {
    setCTypeInvoiceParams: (state, action) => {
      state.cTypeInvoiceParams = {
        ...state.cTypeInvoiceParams,
        ...action.payload,
      };
    },

    resetCTypeInvoiceParams: (state) => {
      state.cTypeInvoiceParams = initParams();
    },
    resetCTypeInvoices: (state) => {
      state.invoicesLoaded = false;
      state.cTypeInvoiceLoadedDetails = null;
      invoicesAdapter.removeAll(state);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getConsigneeInvoicesThunk.rejected, (state) => {
      state.status = "rejected";
    });
    builder.addCase(getConsigneeInvoicesThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getConsigneeInvoicesThunk.fulfilled, (state, action) => {
      invoicesAdapter.setAll(state, action.payload);
      state.status = "success";
      state.invoicesLoaded = true;

      state.cTypeInvoiceLoadedDetails = {
        invoicesLoadedLength: action.payload.length,
        invoicesLoadedTotalAmount: calculateInvoicesTotalAmount(action.payload),
      };
    });
  },
});

export const cTypeInvoicesSelector = invoicesAdapter.getSelectors(
  (state: RootState) => state.consigneeInvoices
);

export const {
  resetCTypeInvoices,
  resetCTypeInvoiceParams,
  setCTypeInvoiceParams,
} = consigneeInvoiceSlice.actions;

