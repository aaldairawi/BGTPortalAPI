/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  InvoiceItemUnion,
  GetInvoiceItemsParams,
} from "../../app/models/invoice/invoice.types";

import Agent from "../../app/agent/agent";

export const getFinalizedInvoiceItemsThunk = createAsyncThunk<
  InvoiceItemUnion[],
  GetInvoiceItemsParams
>(
  "finalizedInvoiceItemsSlice/getFinalizedInvoiceItemsThunk",
  async ({ invoiceGkey, invoiceType }, thunkAPI) => {
    try {
      if (invoiceType.startsWith("C")) {
        return await Agent.InvoicesAPIRequest.getFinalizedInvoiceItems(
          invoiceGkey
        );
      } else {
        return await Agent.InvoicesAPIRequest.getSLFinalizedInvoiceItems(
          parseInt(invoiceGkey)
        );
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data ?? "An error occured"
      );
    }
  }
);
