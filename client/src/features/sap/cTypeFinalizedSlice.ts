/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  IFinalizedInvoiceDto,
  IFinalizedInvoiceResponse,
} from "../../app/models/invoice/finalizedinvoice";
import { RootState } from "../../app/store/configureStore";
import agent from "../../app/agent/agent";

interface ICtypeFinalizedSliceState {
  invoicesResponseDto: IFinalizedInvoiceResponse | null;
  invoiceTypeClicked: boolean;
  invoiceTypeSelected: string;
  invoiceDateSelected: string;
  status: string;
  invoicesLoaded: boolean;
}

const invoicesAdapter = createEntityAdapter<IFinalizedInvoiceDto>();

export const getAllCTypeFinalizedInvoicesAsync = createAsyncThunk<
  IFinalizedInvoiceResponse,
  { invoiceType: string; finalizedDate: string },
  { state: RootState }
>(
  "cTypeFinalizedSlice/getAllFinalizedInvoicesAsync",
  async (data, thunkArgApi) => {
    try {
      return await agent.SapIntegration.getFinalizedCTypeInvoices(data);
    } catch (error: any) {
      return thunkArgApi.rejectWithValue({ error: error.data });
    }
  }
);

export const cTypeFinalizedSlice = createSlice({
  name: "cTypeFinalizedSlice",
  initialState: invoicesAdapter.getInitialState<ICtypeFinalizedSliceState>({
    invoicesLoaded: false,
    invoicesResponseDto: null,
    status: "idle",
    invoiceTypeClicked: false,
    invoiceTypeSelected: "",
    invoiceDateSelected: "",
  }),
  reducers: {
    onSelectInvoiceType: (state, action: PayloadAction<string>) => {
      state.status = "settingInvoiceClicked";
      state.invoiceTypeClicked = true;
      state.invoiceTypeSelected = action.payload;
      state.status = "idle";
    },
    onSelectInvoiceDate: (state, action: PayloadAction<string>) => {
      state.status = "settingDateSelected";
      state.invoiceDateSelected = action.payload;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getAllCTypeFinalizedInvoicesAsync.rejected,
      (state, action) => {
        state.status = "idle";
        console.log(action.payload);
      }
    );
    builder.addCase(getAllCTypeFinalizedInvoicesAsync.pending, (state) => {
      console.log("Pending call to get all finalized");
      invoicesAdapter.removeAll(state);
      state.invoicesLoaded = false;
      state.status = "pendingGetAllCTypeFinalizedInvoicesAsync";
    });
    builder.addCase(
      getAllCTypeFinalizedInvoicesAsync.fulfilled,
      (state, action) => {
        state.invoiceTypeSelected = "";
        state.invoiceTypeClicked = false;
        state.invoicesLoaded = true;
        state.status = "idle";
        invoicesAdapter.removeAll(state);
        state.invoicesResponseDto = action.payload;
        invoicesAdapter.setAll(state, action.payload.invoices);
      }
    );
  },
});

export const ctypeInvoiceSelectors = invoicesAdapter.getSelectors(
  (state: RootState) => state.cFinalizedInvoicesSlice
);
export const { onSelectInvoiceType, onSelectInvoiceDate } =
  cTypeFinalizedSlice.actions;
