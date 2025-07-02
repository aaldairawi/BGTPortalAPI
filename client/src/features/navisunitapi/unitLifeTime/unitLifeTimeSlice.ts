import { createSlice } from "@reduxjs/toolkit";

import {
  ContainerImportDto,
  ContainerExportDto,
} from "../../../app/models/container/unit.types";
import { getUnitImportLifeTimeThunk } from "./getUnitImportLifeTimeThunk";
import { getUnitExportLifeTimeThunk } from "./getUnitExportLifeTimeThunk";

interface UnitLifeTimeState {
  unitImportLifeTime: ContainerImportDto | null;
  unitExportLIfeTime: ContainerExportDto | null;
  status: "idle" | "pending" | "success" | "rejected";
}

const initialState: UnitLifeTimeState = {
  unitImportLifeTime: null,
  unitExportLIfeTime: null,
  status: "idle",
};

export const unitLifeTimeSlice = createSlice({
  name: "unitLifeTimeSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnitImportLifeTimeThunk.rejected, (state) => {
      state.status = "rejected";
    });
    builder.addCase(getUnitImportLifeTimeThunk.pending, (state) => {
      state.status = "pending";
    });

    builder.addCase(getUnitImportLifeTimeThunk.fulfilled, (state, action) => {
      state.unitExportLIfeTime = null;
      
      state.unitImportLifeTime = action.payload;
      state.status = "success";
    });

    builder.addCase(getUnitExportLifeTimeThunk.rejected, (state) => {
      state.status = "rejected";
    });
    builder.addCase(getUnitExportLifeTimeThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getUnitExportLifeTimeThunk.fulfilled, (state, action) => {
      state.unitImportLifeTime = null;
      state.unitExportLIfeTime = action.payload;
      state.status = "idle";
    });
  },
});
