/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import Agent from "../../app/agent/agent";


export const deleteUserAsync = createAsyncThunk<void, number>(
    "usersSlice/deleteUserAsync",
    async (id, thunkApi) => {
      try {
        return await Agent.Users.delete(id);
        
      } catch (error: any) {
        thunkApi.rejectWithValue({ error: error.data });
      }
    }
  );
  