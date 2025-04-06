/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

import Agent from "../../app/agent/agent";


import {
  UserAppInfo,
  UserDto,
} from "../../app/models/account/user";

export const getAllUsersAsync = createAsyncThunk<
  UserDto[],
  void
>("usersSlice/getAllUsersAsync", async (_, thunkApi) => {
  try {
    return await Agent.Users.getall();
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});


/**
 * Fetches a users current Roles, Username and Password from backend based on the users Id.
 * @returns A IUserAppInfo dto from the API.
 */
export const getUserToUpdateInfoAsync = createAsyncThunk<UserAppInfo, string>(
  "userSlice/getUserToUpdateInfoAsync",
  async (userId, thunkAPI) => {
    try {
      return await Agent.Users.getUserToUpdate(userId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ erro: error.data });
    }
  }
);
