/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addRoleToUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string }
>("usersSlice/addRoleToUserAsync", async (arg) => {
  try {
    // Simulate API call using arg
    
    return new Promise<void>((resolve) =>
      setTimeout(() => {
        console.log(`Added role ${arg.role} with ID ${arg.roleId}`);
        resolve();
      }, 1000)
    );
  } catch (error: any) {
    console.log(error);
    throw error;
  }
});

export const removeRoleFromUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string; name: string }
>("usersSlice/removeRoleFromUserAsync", async (arg) => {
  try {
    // Simulate API call using arg
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Removed role ${arg.role} with ID ${arg.roleId}`);
        resolve();
      }, 1000);
    });
  } catch (error: any) {
    console.log(error);
    throw error;
  }
});
