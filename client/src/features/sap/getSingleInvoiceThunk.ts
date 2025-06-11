/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import Agent from "../../app/agent/agent";

export const getSingleInvoiceThunk = createAsyncThunk<
  FinalizedInvoiceDto,
  string
>(
  "singleInvoiceSlice/getOneFinalizedInvoiceByFinalIdAsync",
  async (invoiceFinalId, thunkAPI) => {
    try {
      console.log(invoiceFinalId);

      const result =
        await Agent.InvoicesAPIRequest.getOneFinalizedInvoiceByFinalId(
          invoiceFinalId
        );
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
