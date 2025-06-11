/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  FinalizedInvoiceDto,
  InvoiceParams,
  InvoicesLoadedDetails,
} from "../../../app/models/invoice/invoice.types";

import { RootState } from "../../../app/store/configureStore";

import { calculateInvoicesTotalAmount } from "../../../app/helper/invoice";
import { getCTypeInvoicesThunk } from "./getCTypeInvoicesThunk";

interface CTypeInvoicesState {
  invoicesLoaded: boolean;
  status: string;
  cTypeInvoiceLoadedDetails: InvoicesLoadedDetails | null;
  cTypeInvoiceParams: InvoiceParams;
  isCTypePanelActive: boolean;
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

export const cTypeInvoiceSlice = createSlice({
  name: "cTypeInvoiceSlice ",
  initialState: invoicesAdapter.getInitialState<CTypeInvoicesState>({
    invoicesLoaded: false,
    status: "idle",
    cTypeInvoiceParams: initParams(),
    cTypeInvoiceLoadedDetails: {
      invoicesLoadedLength: 0,
      invoicesLoadedTotalAmount: "",
    },
    isCTypePanelActive: true,
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
    resetCTypeActivePanel: (state) => {
      state.isCTypePanelActive = !state.isCTypePanelActive;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getCTypeInvoicesThunk.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getCTypeInvoicesThunk.pending, (state) => {
      state.status = "pendingGetAllCTypeInvoicesThunk";
    });
    builder.addCase(getCTypeInvoicesThunk.fulfilled, (state, action) => {
      invoicesAdapter.setAll(state, action.payload);
      state.status = "idle";
      
      state.invoicesLoaded = true;
      
      state.cTypeInvoiceLoadedDetails = {
        invoicesLoadedLength: action.payload.length,
        invoicesLoadedTotalAmount: calculateInvoicesTotalAmount(action.payload),
      };
    });
  },
});

export const cTypeInvoicesSelector = invoicesAdapter.getSelectors(
  (state: RootState) => state.cTypeInvoices
);

export const {
  resetCTypeInvoices,
  resetCTypeInvoiceParams,
  setCTypeInvoiceParams,
  resetCTypeActivePanel,
} = cTypeInvoiceSlice.actions;
