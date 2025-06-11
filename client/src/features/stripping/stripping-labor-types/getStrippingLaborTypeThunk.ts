/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { LaborType } from "../../../app/models/stripping/stripping.types";
import Agent from "../../../app/agent/agent";

export const getStrippingLaborTypeThunk = createAsyncThunk<LaborType[], void>(
  "strippingLaborTypeSlice/getStrippingLaborTypeThunk",
  async (_, thunkAPI) => {
    try {
      return await Agent.StrippingUnitsAPI.getStrippingLaborTypes();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);
