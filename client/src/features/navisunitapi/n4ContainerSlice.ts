/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UnitCurrentStatus , ContainerImportDto, ContainerExportDto} from "../../app/models/container/container.types";

import Agent from "../../app/agent/agent";
import { FieldValues } from "react-hook-form";

interface NavisApiState {
  unitCurrentStatus: UnitCurrentStatus | null;
  unitImportLifeTime: ContainerImportDto | null;
  unitExportLIfeTime: ContainerExportDto | null;
  status: string;
}

const initialState: NavisApiState = { // Make sure to upgrade the list.
  unitCurrentStatus: null,
  unitImportLifeTime: null,
  unitExportLIfeTime: null,
  status: "idle",
};

export const getUnitCurrentStatusAsync = createAsyncThunk<
  UnitCurrentStatus,
  string
>("navisApiSlice/getUnitCurrentLocationAsync", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getUnitCurrentLocation(data);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});


export const getImportUnitLifeTimeAsync = createAsyncThunk<
  ContainerImportDto,
  FieldValues
>("navisApiSlice/getImportUnitLifeTime", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getImportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const getExportUnitLifeTimeAsync = createAsyncThunk<
  ContainerExportDto,
  FieldValues
>("navisApiSlice/getExportUnitLifeTime", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getExportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const n4ContainerSlice = createSlice({
  name: "navisApiSlice",
  initialState: initialState,
  reducers: {

    resetUnitCurrentStatus: (state) => {
      state.unitCurrentStatus = null;
    },
    
    resetImportExportLifeTime: (state) => {
      state.unitImportLifeTime = null;
      state.unitExportLIfeTime = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUnitCurrentStatusAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(getUnitCurrentStatusAsync.pending, (state) => {
      console.log("Call Pening");
      state.status = "pendingCallToApi";
    });
    builder.addCase(getUnitCurrentStatusAsync.fulfilled, (state, action) => {
      state.unitCurrentStatus = action.payload;
      state.status = "idle";
      
    });

    builder.addCase(getImportUnitLifeTimeAsync.rejected, (state) => {
      state.status = "idle";
      console.log("Call Rejected To Import LifeTime.");
    });
    builder.addCase(getImportUnitLifeTimeAsync.pending, (state) => {
      state.status = "pendingImportUnitLifeTime";
    });

    builder.addCase(getImportUnitLifeTimeAsync.fulfilled, (state, action) => {
      state.unitExportLIfeTime = null;
      console.log(action.payload);
      state.unitImportLifeTime = action.payload;
      state.status = "idle";
    });

    builder.addCase(getExportUnitLifeTimeAsync.rejected, (state) => {
      state.status = "idle";
      console.log("Call Rejected To Export LifeTime");
    });
    builder.addCase(getExportUnitLifeTimeAsync.pending, (state) => {
      state.status = "pendingExportUnitLifeTime";
    });
    builder.addCase(getExportUnitLifeTimeAsync.fulfilled, (state, action) => {
      state.unitImportLifeTime = null;
      state.unitExportLIfeTime = action.payload;
      state.status = "idle";
    });
  },
});

export const {
  resetImportExportLifeTime,
  resetUnitCurrentStatus,
} = n4ContainerSlice.actions;
