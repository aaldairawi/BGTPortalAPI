import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CsvReadyMap {
  [invoiceFinalNumber: string]: {
    sl2Ready: boolean;
    sl4Ready: boolean;
  };
}
interface ShippingLineInvoiceCsvState {
  csvReadiness: CsvReadyMap;

  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ShippingLineInvoiceCsvState = {
  csvReadiness: {},

  status: "idle",
  error: null,
};

export const shippingLineInvoiceCsvSlice = createSlice({
  name: "shippingLineInvoiceCsvSlice",
  initialState,
  reducers: {
    setSL2CsvReady: (
      state,
      action: PayloadAction<{
        invoiceFinalNumber: string;
        ready: boolean;
      }>
    ) => {
      const { invoiceFinalNumber, ready } = action.payload;
      state.csvReadiness[invoiceFinalNumber] = {
        ...state.csvReadiness[invoiceFinalNumber],
        sl2Ready: ready,
      };
    },

    setSL4CsvReady: (
      state,
      action: PayloadAction<{
        invoiceFinalNumber: string;
        ready: boolean;
      }>
    ) => {
      const { invoiceFinalNumber, ready } = action.payload;
      state.csvReadiness[invoiceFinalNumber] = {
        ...state.csvReadiness[invoiceFinalNumber],
        sl4Ready: ready,
      };
    },

    setCsvStatus: (
      state,
      action: PayloadAction<ShippingLineInvoiceCsvState["status"]>
    ) => {
      state.status = action.payload;
    },
    setCsvError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetShippingLineCsvState: () => initialState,
  },
});

export const {
  setSL2CsvReady,
  setSL4CsvReady,
  setCsvStatus,
  setCsvError,
  resetShippingLineCsvState,
} = shippingLineInvoiceCsvSlice.actions;
