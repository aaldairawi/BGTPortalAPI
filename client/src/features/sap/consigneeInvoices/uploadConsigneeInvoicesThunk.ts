/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UploadInvoicesDTO } from "../../../app/models/invoice/invoice.types";
import Agent from "../../../app/agent/agent";

export const uploadConsigneeInvoicesToPreviewCSVThunk = createAsyncThunk<
  boolean,
  UploadInvoicesDTO
>(
  "uploadConsigneeInvoicesSlice/uploadConsigneeInvoicesToPreviewCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadConsigneeCSVToPreview(data);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
// Implement in production , change the APIRequest to have an additional endpoint for production upload.
export const uploadConsigneeInvoicesToProductionCSVThunk = createAsyncThunk<
  boolean,
  UploadInvoicesDTO
>(
  "uploadConsigneeInvoicesSlice/uploadConsigneeInvoicesToProductionCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadConsigneeCSVToPreview(data);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
