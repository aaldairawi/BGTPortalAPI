/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addRoleToUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string }
>("usersSlice/addRoleToUserAsync", async () => {
  try {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 1000)
    );
  } catch (error: any) {
    console.log(error);
  }
});

export const removeRoleFromUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string; name: string }
>("usersSlice/removeRoleFromUserAsync", async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  } catch (error: any) {
    console.log(error);
  }
});
