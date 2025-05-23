/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../app/agent/agent";

import { RootState } from "../../app/store/configureStore";
import { getAxiosParams } from "./finalizedInvoicesSlice";
import { FinalInvoiceResponseDto} from "../../app/models/invoice/invoice.types";

export const getAllFinalizedInvoicesAsync = createAsyncThunk<FinalInvoiceResponseDto, void, {state: RootState}>(
  "finalizedInvoicesSlice/getAllFinalizedInvoicesAsync",
  async (_, thunkAPI) => {
    const params  = getAxiosParams(thunkAPI.getState().finalizedInvoices.invoiceParams);
    
    try {
        const response = agent.InvoicesAPIRequest.getFinalizedInvoices(params);
        return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);



