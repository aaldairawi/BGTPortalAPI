/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  StrippingContainer,
  StrippingContainerRequestData,
} from "../../app/models/stripping/stripping.types";
import Agent from "../../app/agent/agent";

export const getAllStrippedUnitsThunk = createAsyncThunk<
  StrippingContainer[],
  StrippingContainerRequestData
>("strippingSlice/getAllStrippedUnitsThunk", async (data, thunkAPI) => {
  try {
    const result = await Agent.StrippingUnitsAPI.getStrippedContainers(data);
    return result;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
