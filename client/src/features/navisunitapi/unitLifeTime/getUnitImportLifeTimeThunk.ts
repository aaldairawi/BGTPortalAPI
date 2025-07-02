/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import Agent from "../../../app/agent/agent";
import { ContainerImportDto } from "../../../app/models/container/unit.types";
import { FieldValues } from "react-hook-form";



export const getUnitImportLifeTimeThunk = createAsyncThunk<
  ContainerImportDto,
  FieldValues
>("unitLifeTimeSlice/getUnitImportLifeTimeThunk", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getImportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

