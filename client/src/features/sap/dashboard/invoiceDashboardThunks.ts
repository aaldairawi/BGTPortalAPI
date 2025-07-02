/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  InvoiceHeaderDto,
  InvoicePendingUploadDto,
} from "../../../app/models/invoicedashboard/invoicedashboard.types";
import Agent from "../../../app/agent/agent";

export const getPendingInvoicesThunk = createAsyncThunk<
  InvoicePendingUploadDto[],
  string,
  { rejectValue: string }
>(
  "pendingDashboardInvoicesSlice/getPendingInvoicesThunk",
  async (finalizedDate, thunkAPI) => {
    try {
      const result = await Agent.SapDashboardAPIRequests.getPendingInvoices(
        finalizedDate
      );

      return result;
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue("Error fetching pending invoices.");
    }
  }
);

export const getUploadedInvoicesThunk = createAsyncThunk<
  InvoiceHeaderDto[],
  string
>(
  "uploadedDashboardInvoicesSlice/getUploadedInvoicesThunk",
  async (uploadedDate, thunkAPI) => {
    try {
      const result = await Agent.SapDashboardAPIRequests.getUploadedInvoices(
        uploadedDate
      );

      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
