/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  UploadShippingLineInvoicesDTO,
  UploadSl4InvoiceDto,
} from "../../../app/models/invoice/invoice.types";
import Agent from "../../../app/agent/agent";

export const uploadSL2InvoiceToPreviewCSVThunk = createAsyncThunk<
  boolean,
  UploadShippingLineInvoicesDTO
>(
  "uploadShippingLineInvoicesSlice/uploadShippingLineInvoicesToPreviewCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadSL2InvoiceToPreview(data);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const uploadSL2InvoiceToProductionCSVThunk = createAsyncThunk<
  boolean,
  UploadShippingLineInvoicesDTO
>(
  "uploadShippingLineInvoicesSlice/uploadSL2InvoiceToProductionCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadSL2InvoiceToProduction(
          data
        );
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
export const uploadSL4InvoiceToPreviewCSVThunk = createAsyncThunk<
  boolean,
  UploadSl4InvoiceDto
>(
  "uploadShippingLineInvoicesSlice/uploadSL4InvoiceToPreviewCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result = await Agent.UploadInovicesAPIRequests.uploadSL4ToPreview(
        data
      );
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const uploadSL4InvoiceToProductionCSVThunk = createAsyncThunk<
  boolean,
  UploadSl4InvoiceDto
>(
  "uploadShippingLineInvoicesSlice/uploadSL4InvoiceToProductionCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadSL4ToProduction(data);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
