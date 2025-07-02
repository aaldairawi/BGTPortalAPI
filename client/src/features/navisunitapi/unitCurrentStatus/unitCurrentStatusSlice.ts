import { createSlice } from "@reduxjs/toolkit";
import { UnitCurrentStatus } from "../../../app/models/container/unit.types";
import { getUnitCurrentStatusThunk } from "./getUnitCurrentStatusThunk";

interface UnitCurrentStatusState {
  container: UnitCurrentStatus | null;
  containerLoaded: boolean;
  status: "idle" | "rejected" | "success" | "pending";
}

const initialState: UnitCurrentStatusState = {
  container: null,
  containerLoaded: false,
  status: "idle",
};
export const unitCurrentStatusSlice = createSlice({
  name: "unitCurrentStatusSlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUnitCurrentStatusThunk.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
    builder.addCase(getUnitCurrentStatusThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getUnitCurrentStatusThunk.fulfilled, (state, action) => {
      state.container = action.payload;
      state.status = "idle";
    });
  },
});
