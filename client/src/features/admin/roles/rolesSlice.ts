/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

import { Role } from "../../../app/models/role/role.types";

import { RootState } from "../../../app/store/configureStore";

import agent from "../../../app/agent/agent";

interface IRoleState {
  rolesloaded: boolean;
  status: string;
}

const rolesAdapter = createEntityAdapter<Role>();

export const getAllRolesAsync = createAsyncThunk<
  Role[],
  void,
  { state: RootState }
>("rolesSlice/getAllRolesAsync", async (_, thunkApi) => {
  try {
    return await agent.RolesAPIRequests.get();
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const rolesSlice = createSlice({
  name: "rolesSlice",
  initialState: rolesAdapter.getInitialState<IRoleState>({
    rolesloaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllRolesAsync.pending, (state) => {
      state.status = "pendingGetAllRoles";
    });
    builder.addCase(getAllRolesAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(getAllRolesAsync.fulfilled, (state, action) => {
      rolesAdapter.setAll(state, action.payload);
      state.rolesloaded = true;
      state.status = "idle";
    });
  },
});

export const rolesSelctors = rolesAdapter.getSelectors<RootState>(
  (state) => state.roles
);
