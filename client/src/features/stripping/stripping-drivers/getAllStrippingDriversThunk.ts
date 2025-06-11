/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

import { StrippingDriverDto } from "../../../app/models/stripping/stripping.types";


import Agent from "../../../app/agent/agent";

export const getAllStrippingDriversThunk = createAsyncThunk<
  StrippingDriverDto[],
  void
>("strippingDriversSlice/getAllStrippingDriversThunk", async (_, thunkAPI) => {
  try {
    const result = await Agent.StrippingUnitsAPI.getAllStrippingDrivers();
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
