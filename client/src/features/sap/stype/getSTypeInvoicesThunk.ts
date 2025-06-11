/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FinalizedInvoiceDto } from "../../../app/models/invoice/invoice.types";
import { RootState } from "../../../app/store/configureStore";
import { getAxiosParams } from "./sTypeInvoicSlice";
import Agent from "../../../app/agent/agent";


export const getSTypeInvoicesThunk = createAsyncThunk<FinalizedInvoiceDto[], void, {state: RootState}>(
  "sTypeInvoiceSlice/getAllFinalizedSTypeInvoices",
  async (_, thunkAPI) => {
    const params  = getAxiosParams(thunkAPI.getState().sTypeInvoices.sTypeInvoiceParams);
    
    try {
        const response = Agent.InvoicesAPIRequest.getFinalizedInvoices(params);
        return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);






