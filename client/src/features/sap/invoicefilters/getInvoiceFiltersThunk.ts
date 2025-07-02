/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

import Agent from "../../../app/agent/agent";

export const getCTypeInvoiceFiltersAsync = createAsyncThunk(
  "cTypeInvoiceSlice/getCTypeInvoiceFiltersAsync",
  async (_, thunkAPI) => {
    try {
      const result = Agent.InvoiceFiltersAPIRequest.getCtypeInvoiceFilters();
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const getSTypeInvoiceFiltersAsync = createAsyncThunk(
  "sTypeInvoiceSlice/getSTypeInvoiceFiltersAsync",
  async (_, thunkAPI) => {
    try {
      const result = Agent.InvoiceFiltersAPIRequest.getSTypeInvoiceFilters();
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
