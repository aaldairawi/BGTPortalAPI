/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICInvoiceType } from "../../app/models/invoice/cinvoicetype";
import { RootState } from "../../app/store/configureStore";
import agent from "../../app/agent/agent";

interface IInvoiceTypeState {
  invoiceTypes: ICInvoiceType[] | null;
  invoiceTypesLoaded: boolean;
  status: string;
}

const initialState: IInvoiceTypeState = {
  invoiceTypes: null,
  invoiceTypesLoaded: false,
  status: "idle",
};

export const getAllCInvoiceTypesAsync = createAsyncThunk<
  ICInvoiceType[],
  void,
  { state: RootState }
>("invoiceTypeSlice/getAllCInvoiceTypesAsync", async (_, thunkArgApi) => {
  try {
    return await agent.SapIntegration.getCTypeInvoiceTypes();
  } catch (error: any) {
    return thunkArgApi.rejectWithValue({ error: error.data });
  }
});
export const invoiceTypeSlice = createSlice({
  name: "invoiceTypeSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCInvoiceTypesAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(getAllCInvoiceTypesAsync.pending, (state) => {
      state.status = "pendingGetAllCInvoiceTypesAsync";
    });
    builder.addCase(getAllCInvoiceTypesAsync.fulfilled, (state, action) => {
      state.status = "idle";
      state.invoiceTypes = action.payload;
    });
  },
});
