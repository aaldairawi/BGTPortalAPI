/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Agent from "../../../app/agent/agent";

export const deleteStrippingDriverThunk = createAsyncThunk<boolean, number>(
  "strippingDriversSlice/deleteStrippingDriverThunk",
  async (data, thunkAPI) => {
    try {
      const result = Agent.StrippingUnitsAPI.deleteStrippingDriver(data);
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);


