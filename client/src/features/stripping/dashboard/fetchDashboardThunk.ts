/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { StrippingDashboardDto } from "../../../app/models/stripping/stripping.types";
import Agent from "../../../app/agent/agent";

export const fetchDashboardThunk = createAsyncThunk<
  StrippingDashboardDto[],
  { fromDate: string; toDate: string }
>("strippingDashboardSlice/fetchDashboardThunk", async (data, thunkAPI) => {
  try {
    const result = await Agent.StrippingUnitsAPI.fetchDataForDashboard(
      data.fromDate,
      data.toDate
    );

    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
