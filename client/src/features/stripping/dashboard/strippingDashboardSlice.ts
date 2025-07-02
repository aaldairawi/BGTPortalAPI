import { createSlice } from "@reduxjs/toolkit";

import { StrippingDashboardDto } from "../../../app/models/stripping/stripping.types";
import { fetchDashboardThunk } from "./fetchDashboardThunk";
import { downloadStrippedCsvThunk } from "../csv/downloadStrippedCsvThunk";

interface DashboardState {
  data: StrippingDashboardDto[];

  // dashboard fetch status
  status: "idle" | "loading" | "succeeded" | "failed";

  // csv download status + error
  downloadStatus: "idle" | "loading" | "succeeded" | "failed";
  downloadError: string | null;
}

const initialState: DashboardState = {
  data: [],
  status: "idle",
  downloadStatus: "idle",
  downloadError: null,
};
export const strippingDashboardSlice = createSlice({
  name: "strippingDashboardSlice",
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.data = [];
      state.status = "idle";
      state.downloadStatus = "idle";
      state.downloadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboardThunk.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(downloadStrippedCsvThunk.pending, (state) => {
        state.downloadStatus = "loading";
        state.downloadError = null;
      })
      .addCase(downloadStrippedCsvThunk.fulfilled, (state) => {
        state.downloadStatus = "succeeded";
      })
      .addCase(downloadStrippedCsvThunk.rejected, (state, action) => {
        state.downloadStatus = "failed";
        state.downloadError = action.payload ?? "Unknown error";
      });
  },
});

export const { resetDashboard } = strippingDashboardSlice.actions;
