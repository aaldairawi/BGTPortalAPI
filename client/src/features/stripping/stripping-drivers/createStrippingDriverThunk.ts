/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  CreateStrippingDriver,
  StrippingDriverDto,
} from "../../../app/models/stripping/stripping.types";
import Agent from "../../../app/agent/agent";

export const createStrippingDriverThunk = createAsyncThunk<
  StrippingDriverDto,
  CreateStrippingDriver
>("strippingDriversSlice/createStrippingDriver", async (data, thunkAPI) => {
  try {
    const result = await Agent.StrippingUnitsAPI.addStrippingDriver(data);
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
