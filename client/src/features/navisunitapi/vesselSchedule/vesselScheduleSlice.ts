import { createSlice } from "@reduxjs/toolkit";
import { VesselDtoBase } from "../../../app/models/container/unit.types";
import { getVesselScheduleThunk } from "./getVesselScheduleThunk";

interface VesselScheduleState {
  vesselsLoaded: boolean;
  status: "idle" | "pending" | "succeeded" | "failed";
  vessels: VesselDtoBase[] | null;
}

const initialState: VesselScheduleState = {
  vesselsLoaded: false,
  status: "idle",
  vessels: null,
};

export const vesselScheduleSlice = createSlice({
  name: "vesselScheduleSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVesselScheduleThunk.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getVesselScheduleThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vesselsLoaded = true;
        state.vessels = action.payload;
      })
      .addCase(getVesselScheduleThunk.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default vesselScheduleSlice.reducer;
