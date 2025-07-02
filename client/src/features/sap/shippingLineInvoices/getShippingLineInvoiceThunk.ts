/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FinalizedInvoiceDto } from "../../../app/models/invoice/invoice.types";
import Agent from "../../../app/agent/agent";

export const getShippingLineInvoicesByFinalizedDateThunk = createAsyncThunk<
  FinalizedInvoiceDto[],
  string
>(
  "shippingLineInvoicesSlice/getShippingLineInvoicesByFinalizedDateThunk",
  async (finalInvoiceNumber, thunkAPI) => {
    try {
      const response =
        await Agent.ShippingLineInvoiceAPIRequests.getSLInvoiceByFinalNumber(
          finalInvoiceNumber
        );
      if (Array.isArray(response)) {
        return response;
      } else {
        console.warn("Expected an array but got:", response);
        return [];
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
