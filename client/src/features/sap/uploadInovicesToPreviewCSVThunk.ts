/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UploadInvoicesDTO } from "../../app/models/invoice/invoice.types";
import Agent from "../../app/agent/agent";

export const uploadInovicesToPreviewCSVThunk = createAsyncThunk<
  boolean,
  UploadInvoicesDTO
>(
  "uploadInvoicesSlice/uploadInovicesToPreviewCSVThunk",
  async (data, thunkAPI) => {
    try {
      const result =
        await Agent.UploadInovicesAPIRequests.uploadToPreviewCSV(
          data
        );
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

