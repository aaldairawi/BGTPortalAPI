/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContainerExportDto } from "../../../app/models/container/unit.types";
import { FieldValues } from "react-hook-form";
import Agent from "../../../app/agent/agent";



export const getUnitExportLifeTimeThunk = createAsyncThunk<
  ContainerExportDto,
  FieldValues
>("unitLifeTimeSlice/getUnitExportLifeTimeThunk ", async (data, thunkApi) => {
  try {
    return await Agent.NavisUnitApi.getExportUnitLifeTime(data.unitNumber);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

