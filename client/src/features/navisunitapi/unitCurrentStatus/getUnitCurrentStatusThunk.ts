/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UnitCurrentStatus } from "../../../app/models/container/unit.types";
import Agent from "../../../app/agent/agent";



export const getUnitCurrentStatusThunk = createAsyncThunk<
  UnitCurrentStatus,
  string
>("unitCurrentStatusSlice/getUnitCurrentStatusThunk", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getUnitCurrentLocation(data);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});
