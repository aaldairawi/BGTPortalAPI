/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUnitCurrentStatus } from "../../app/models/container/unitCurrentStatus";
import agent from "../../app/agent/agent";
import {
  IContainerExportDto,
  IContainerImportDto,
} from "../../app/models/container/unitLifeTime";
import { FieldValues } from "react-hook-form";

interface INavisApiState {
  unitCurrentStatus: IUnitCurrentStatus | null;
  unitImportLifeTime: IContainerImportDto | null;
  unitExportLIfeTime: IContainerExportDto | null;
  status: string;
}

const initialState: INavisApiState = {
  unitCurrentStatus: null,
  unitImportLifeTime: null,
  unitExportLIfeTime: null,
  status: "",
};
export const getUnitCurrentStatusAsync = createAsyncThunk<
  IUnitCurrentStatus,
  string
>("navisApiSlice/getUnitCurrentLocationAsync", async (data, thunkApi) => {
  try {
    return await agent.NavisUnitApi.getUnitCurrentLocation(data);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const getImportUnitLifeTimeAsync = createAsyncThunk<
  IContainerImportDto,
  FieldValues
>("navisApiSlice/getImportUnitLifeTime", async (data, thunkApi) => {
  try {
    return await agent.NavisUnitApi.getImportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const getExportUnitLifeTimeAsync = createAsyncThunk<
  IContainerExportDto,
  FieldValues
>("navisApiSlice/getExportUnitLifeTime", async (data, thunkApi) => {
  try {
    return await agent.NavisUnitApi.getExportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const navisApiSlice = createSlice({
  name: "navisApiSlice",
  initialState: initialState,
  reducers: {
    setUnitCurrentStatus: (state, action) => {
      state.unitCurrentStatus = action.payload;
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
      console.log("Call Fulfiled");
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
      console.log("Call Fulfilled To Import LifeTime");
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
      console.log("Call Fulfilled To Export LifeTime");
    });
  },
});
