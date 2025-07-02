/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SLParentAndPartnerInvoiceItemsDto } from "../../../app/models/invoice/invoice.types";
import Agent from "../../../app/agent/agent";

export const getShippingLineAndPartnerInvoiceItemsThunk = createAsyncThunk<
  SLParentAndPartnerInvoiceItemsDto,
  string
>(
  "shippingLineInvoiceItemsSlice/getShippingLineAndPartnerInvoiceItemsThunk",
  async (invoiceGkey, thunkAPI) => {
    try {
      return await Agent.ShippingLineInvoiceAPIRequests.getSLParentAndPartnerInvoiceItems(
        invoiceGkey
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data ?? "An error occurred"
      );
    }
  }
);
