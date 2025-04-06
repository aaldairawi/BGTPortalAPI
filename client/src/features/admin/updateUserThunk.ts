/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";

import Agent from "../../app/agent/agent";


import { UpdateUserDto } from "../../app/models/account/user";

export const sendUpdatedUserInfoAsync = createAsyncThunk<void, UpdateUserDto>(
  "usersSlice/sendUpdatedUserInfoAsync",
  async (data, thunkApi) => {
    try {
      return await Agent.Users.edit(data);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);


