/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import Agent from "../../app/agent/agent";
import { FieldValues } from "react-hook-form";

import {
  LoggedInUser,
  UserRegister,
} from "../../app/models/account/user.types";

import router from "../../app/router/Routes";
import { RootState } from "../../app/store/configureStore";
import { clearUsersLoadedFromAdapter } from "../admin/users/usersSlice";

interface AccountState {
  user: LoggedInUser | null;
  isUserAnAdmin: boolean;
}

const initialState: AccountState = {
  user: null,
  isUserAnAdmin: false,
};

export const signInUserAsync = createAsyncThunk<LoggedInUser, FieldValues>(
  "account/signInUserAsync",
  async (data, thunkApi) => {
    try {
      const loginUserDto = await Agent.AccountAPIRequests.login(data);
      if (loginUserDto) {
        localStorage.setItem("user", JSON.stringify(loginUserDto));
      
      }
      
      return loginUserDto;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error.data);
    }
  }
);

export const registerUserAsync = createAsyncThunk<
  void,
  FieldValues,
  { state: RootState }
>("account/registerUserAsync", async (data, thunkApi) => {
  try {
    const result = await Agent.AccountAPIRequests.register(
      data as UserRegister
    );
    const state = thunkApi.getState();
    if (state.account.isUserAnAdmin) {
      thunkApi.dispatch(clearUsersLoadedFromAdapter());
    }
    return result;
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error });
  }
});

export const fetchCurrentUserAsync = createAsyncThunk<LoggedInUser>(
  "account/fetchCurrentUserAsync",
  async (_, thunkApi) => {
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const loginUserDto = await Agent.AccountAPIRequests.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(loginUserDto));
      return loginUserDto;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) {
        return false;
      }
    },
  }
);
export const accountSlice = createSlice({
  name: "accountSlice",
  initialState: initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      state.isUserAnAdmin = false;
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
      const roles =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      state.user = {
        ...action.payload,
        roles: typeof roles === "string" ? [roles] : roles,
      };
      if (state.user && state.user.roles?.includes("Admin")) {
        state.isUserAnAdmin = true;
      }
    
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAsync.rejected, (_, action) => {
      console.log(action.payload);
    });

    builder.addCase(fetchCurrentUserAsync.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    });

    builder.addMatcher(
      isAnyOf(signInUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled),
      (state, action) => {
        const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
        const roles =
          claims[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        state.user = {
          ...action.payload,
          roles: typeof roles === "string" ? [roles] : roles,
        };
        if (state.user && state.user.roles?.includes("Admin")) {
          state.isUserAnAdmin = true;
        }
      
      }
    );
    builder.addMatcher(
      isAnyOf(signInUserAsync.rejected, fetchCurrentUserAsync.rejected),
      (_state, action) => {
        throw action.payload;
      }
    );
  },
});

export const { setUser, signOut } = accountSlice.actions;
