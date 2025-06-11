/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateRetiredContainersDto } from "../../app/models/stripping/stripping.types";
import Agent from "../../app/agent/agent";
import { RootState } from "../../app/store/configureStore";
export const updateRetiredUnitsThunk = createAsyncThunk<
  boolean,
  UpdateRetiredContainersDto,
  { state: RootState }
>("strippingSlice/updateStrippingUnitsThunk", async (data, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
    const dateTime = state.stripping.strippingFilterData.dateStripped;

    const objectToSendToApi: UpdateRetiredContainersDto = {
      containers: data.containers,
      driverName: data.driverName,
      laborType: data.laborType,
      dateStripped: dateTime,
    };

    return Agent.StrippingUnitsAPI.updateRetiredContainers(objectToSendToApi);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});
