/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAxiosParams } from "./consigneeInvoiceSlice";
import Agent from "../../../app/agent/agent";
import { FinalizedInvoiceDto } from "../../../app/models/invoice/invoice.types";
import { RootState } from "../../../app/store/configureStore";

export const getConsigneeInvoicesThunk = createAsyncThunk<
  FinalizedInvoiceDto[],
  void,
  { state: RootState }
>("consigneeInvoiceSlice/getConsigneeInvoicesThunk", async (_, thunkAPI) => {
  const params = getAxiosParams(
    thunkAPI.getState().consigneeInvoices.cTypeInvoiceParams
  );

  try {
    const response =
      Agent.ConsigneeInvoiceAPIRequests.getFinalizedInvoices(params);
    return response;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
