import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { getStrippingLaborTypeThunk } from "./getStrippingLaborTypeThunk";
import { LaborType } from "../../../app/models/stripping/stripping.types";
import { RootState } from "../../../app/store/configureStore";

interface StrippingLaborTypeState {
  strippingLaborTypesLoaded: boolean;
  status: "idle" | "success" | "rejected" | "pending";
}

const strippingLaborTypeAdapter = createEntityAdapter<LaborType>();

export const strippingLaborTypeSlice = createSlice({
  name: "strippingLaborTypeSlice",
  initialState:
    strippingLaborTypeAdapter.getInitialState<StrippingLaborTypeState>({
      strippingLaborTypesLoaded: false,
      status: "idle",
    }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getStrippingLaborTypeThunk.rejected, (state) => {
      state.status = "rejected";
    });

    builder.addCase(getStrippingLaborTypeThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getStrippingLaborTypeThunk.fulfilled, (state, action) => {
      state.status = "success";
      strippingLaborTypeAdapter.setAll(state, action.payload);
    });
  },
});

export const strippingLaborTypeSelectors =
  strippingLaborTypeAdapter.getSelectors(
    (state: RootState) => state.strippingLabor
  );
