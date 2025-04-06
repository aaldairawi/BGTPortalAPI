/* eslint-disable @typescript-eslint/no-explicit-any */

import { createAsyncThunk } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import Agent from "../../app/agent/agent";
import { UserDto, UserRegister } from "../../app/models/account/user";


export const createUserAsync = createAsyncThunk<UserDto, FieldValues>(
    "usersSlice/createUserAsync",
    async (data, thunkApi) => {
      try {
        return await Agent.Users.create(data as UserRegister);
      } catch (error: any) {
        console.log(error);
        return thunkApi.rejectWithValue({ error: error.data });
      }
    }
  );
  