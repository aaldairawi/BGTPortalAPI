/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { FinalizedInvoiceItemDto } from "../../app/models/invoice/finalizedinvoice.types";
import { RootState } from "../../app/store/configureStore";
import Agent from "../../app/agent/agent";

interface ICtypeFinalizedInvoiceItemsState {
  invoiceItemsLoaded: boolean;
  invoiceItemStatus: string;
  showInvoiceItemBackdrop: boolean;
}
const invoiceItemsAdapter = createEntityAdapter<FinalizedInvoiceItemDto>();

export const getInvoiceItemsAsync = createAsyncThunk<
  FinalizedInvoiceItemDto[],
  string,
  { state: RootState }
>(
  "cTypeInvoiceItemSlice/getInvoiceItemsAsync",

  async (data, thunkArgApi) => {
    try {
      return await Agent.SapIntegration.getCTypeFinalizedInvoiceItems(data);
    } catch (error: any) {
      return thunkArgApi.rejectWithValue({ error: error.data });
    }
  }
);

export const cTypeInvoiceItemSlice = createSlice({
  name: "cTypeInvoiceItemSlice",
  initialState:
    invoiceItemsAdapter.getInitialState<ICtypeFinalizedInvoiceItemsState>({
      invoiceItemStatus: "idle",
      invoiceItemsLoaded: false,
      showInvoiceItemBackdrop: false,
    }),
  reducers: {
    onHandleHideInvoiceItemBackdrop: (state) => {
      state.showInvoiceItemBackdrop = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getInvoiceItemsAsync.rejected, (state, action) => {
      state.invoiceItemStatus = "idle";
      console.log(action.payload);
    });
    builder.addCase(getInvoiceItemsAsync.pending, (state) => {
      state.invoiceItemStatus = "pendingGetInvoiceItemsAsync";
      invoiceItemsAdapter.removeAll(state);
      state.invoiceItemsLoaded = false;
      state.showInvoiceItemBackdrop = false;
    });
    builder.addCase(getInvoiceItemsAsync.fulfilled, (state, action) => {
      invoiceItemsAdapter.setAll(state, action.payload);
      state.invoiceItemsLoaded = true;
      state.showInvoiceItemBackdrop = true;
      state.invoiceItemStatus = "idle";
    });
  },
});

export const invoiceItemsSelector = invoiceItemsAdapter.getSelectors(
  (state: RootState) => state.cInvoiceItemsSlice
);

export const { onHandleHideInvoiceItemBackdrop } =
  cTypeInvoiceItemSlice.actions;
