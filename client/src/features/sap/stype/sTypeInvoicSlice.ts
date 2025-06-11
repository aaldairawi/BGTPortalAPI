/* eslint-disable @typescript-eslint/no-explicit-any */

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import {
  FinalizedInvoiceDto,
  InvoiceParams,
  InvoicesLoadedDetails,
} from "../../../app/models/invoice/invoice.types";
import { RootState } from "../../../app/store/configureStore";
import { calculateInvoicesTotalAmount } from "../../../app/helper/invoice";
import { getSTypeInvoicesThunk } from "./getSTypeInvoicesThunk";

interface STypeInvoicesState {
  invoicesLoaded: boolean;
  status: string;
  sTypeInvoiceLoadedDetails: InvoicesLoadedDetails | null;
  sTypeInvoiceParams: InvoiceParams;
  isSTypePanelActive: boolean;
}

const sTypeInvoicesAdapter = createEntityAdapter<FinalizedInvoiceDto>();

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
    invoiceType: "SL1",
  };
};

export const sTypeInvoiceSlice = createSlice({
  name: "sTypeInvoiceSlice",
  initialState: sTypeInvoicesAdapter.getInitialState<STypeInvoicesState>({
    invoicesLoaded: false,

    status: "idle",
    sTypeInvoiceParams: initParams(),

    sTypeInvoiceLoadedDetails: {
      invoicesLoadedLength: 0,
      invoicesLoadedTotalAmount: "",
    },
    isSTypePanelActive: false,
  }),

  reducers: {
    setSTypeInvoiceParams: (state, action) => {
      state.sTypeInvoiceParams = {
        ...state.sTypeInvoiceParams,
        ...action.payload,
      };
    },

    resetSTypeInvoiceParams: (state) => {
      state.sTypeInvoiceParams = initParams();
    },
    resetSTypeInvoices: (state) => {
      state.invoicesLoaded = false;
      state.sTypeInvoiceLoadedDetails = null;
      sTypeInvoicesAdapter.removeAll(state);
    },
    resetSTypeActivePanel: (state) => {
      state.isSTypePanelActive = !state.isSTypePanelActive;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getSTypeInvoicesThunk.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getSTypeInvoicesThunk.pending, (state) => {
      state.status = "pendingGetAllSTypeInvoicesThunk";
    });
    builder.addCase(getSTypeInvoicesThunk.fulfilled, (state, action) => {
      sTypeInvoicesAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.invoicesLoaded = true;
      state.sTypeInvoiceLoadedDetails = {
        invoicesLoadedLength: action.payload.length,
        invoicesLoadedTotalAmount: calculateInvoicesTotalAmount(action.payload),
      };
    });
    
  },
});

export const sTypeInvoicesSelector = sTypeInvoicesAdapter.getSelectors(
  (state: RootState) => state.sTypeInvoices
);

export const {
  resetSTypeInvoices,
  resetSTypeInvoiceParams,
  setSTypeInvoiceParams,
  resetSTypeActivePanel,
} = sTypeInvoiceSlice.actions;
