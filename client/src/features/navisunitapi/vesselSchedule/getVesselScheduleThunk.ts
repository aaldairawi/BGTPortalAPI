/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  VesselDtoBase
} from "../../../app/models/container/unit.types"; // or correct path
import Agent from "../../../app/agent/agent";

export const getVesselScheduleThunk = createAsyncThunk<VesselDtoBase[], void>(
  "vesselScheduleSlice/getVesselScheduleThunk",
  async (_, thunkAPI) => {
    try {
      const result = await Agent.VesselScheduleAPIRequests.getVesselSchedule();
      return result;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        error: error?.response?.data || error.message || "Unknown error",
      });
    }
  }
);
