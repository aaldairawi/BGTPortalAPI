import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { StrippingDriverDto } from "../../../app/models/stripping/stripping.types";

import { deleteStrippingDriverThunk } from "./deleteStrippingDriverThunk";
import { RootState } from "../../../app/store/configureStore";
import { createStrippingDriverThunk } from "./createStrippingDriverThunk";
import { getAllStrippingDriversThunk } from "./getAllStrippingDriversThunk";

interface StrippingDriversState {
  strippingDriversLoaded: boolean;
  strippingDriverStatus: "idle" | "rejected" | "success" | "pending";
}

const driversAdapter = createEntityAdapter<StrippingDriverDto>();
const initialState = driversAdapter.getInitialState<StrippingDriversState>({
  strippingDriverStatus: "idle",
  strippingDriversLoaded: false,
});

export const strippingDriversSlice = createSlice({
  name: "strippingDriversSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllStrippingDriversThunk.rejected, (state, action) => {
      state.strippingDriverStatus = "rejected";
      console.log(action.payload);
    });
    builder.addCase(getAllStrippingDriversThunk.pending, (state) => {
      state.strippingDriverStatus = "pending";
    });
    builder.addCase(getAllStrippingDriversThunk.fulfilled, (state, action) => {
      state.strippingDriverStatus = "success";
      state.strippingDriversLoaded = true;

      driversAdapter.setAll(state, action.payload);
    });
    builder.addCase(deleteStrippingDriverThunk.rejected, (state, action) => {
      state.strippingDriverStatus = "rejected";
      console.log(action.payload);
    });
    builder.addCase(deleteStrippingDriverThunk.pending, (state) => {
      state.strippingDriverStatus = "pending";
    });
    builder.addCase(deleteStrippingDriverThunk.fulfilled, (state, action) => {
      state.strippingDriverStatus = "success";
      

      driversAdapter.removeOne(state, action.meta.arg);
    });

    builder.addCase(createStrippingDriverThunk.rejected, (state, action) => {
      state.strippingDriverStatus = "idle";
      console.log(action.payload);
    });
    builder.addCase(createStrippingDriverThunk.pending, (state) => {
      state.strippingDriverStatus = "pending";
    });
    builder.addCase(createStrippingDriverThunk.fulfilled, (state, action) => {
      state.strippingDriverStatus = "success";

      driversAdapter.addOne(state, action.payload);
    });
  },
});

export const strippingDriversSelector = driversAdapter.getSelectors(
  (state: RootState) => state.strippingDrivers
);
