/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import agent from "../../app/agent/agent";

import { FinalInvoiceResponseDto } from "../../app/models/invoice/invoice.types";

export const getOneFinalizedInvoiceByFinalIdAsync = createAsyncThunk<FinalInvoiceResponseDto, string
>(
  "finalizedInvoicesSlice/getOneFinalizedInvoiceByFinalIdAsync",
  async (invoiceFinalId, thunkAPI) => {
    try {
      return agent.InvoicesAPIRequest.getOneFinalizedInvoiceByFinalId(
        invoiceFinalId
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
