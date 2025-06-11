/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosParams } from "./cTypeInvoiceSlice";
import Agent from "../../../app/agent/agent";
import {  FinalizedInvoiceDto } from "../../../app/models/invoice/invoice.types";
import { RootState } from "../../../app/store/configureStore";

export const getCTypeInvoicesThunk = createAsyncThunk<
  FinalizedInvoiceDto[],
  void,
  { state: RootState }
>("cTypeInvoiceSlice/getCTypeInvoicesThunk", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().cTypeInvoices.cTypeInvoiceParams
  );
  
  try {
    const response = Agent.InvoicesAPIRequest.getFinalizedInvoices(params);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
