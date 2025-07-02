/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";


import Agent from "../../app/agent/agent";
import { ConsigneeInvoiceItemDto } from "../../app/models/invoice/invoice.types";

export const getConsigneeInvoiceItemsThunk = createAsyncThunk<
  ConsigneeInvoiceItemDto[],
  string
>(
  "consigneeInvoiceSlice/getConsigneeInvoiceItemsThunk",
  async (invoiceGkey, thunkAPI) => {
    try {
      return await Agent.ConsigneeInvoiceAPIRequests.getFinalizedInvoiceItems(
        invoiceGkey
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data ?? "An error occured"
      );
    }
  }
);


