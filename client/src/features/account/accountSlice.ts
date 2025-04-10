/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import Agent from "../../app/agent/agent";
import { FieldValues } from "react-hook-form";
import { LoggedInUser, UserRegister } from "../../app/models/account/user";

import router from "../../app/router/Routes";

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
      const loginUserDto = await Agent.Account.login(data);
      if (loginUserDto) {
        localStorage.setItem("user", JSON.stringify(loginUserDto));
      }
      return loginUserDto;
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUserAsync = createAsyncThunk<void, FieldValues>(
  "account/registerUserAsync",
  async (data, thunkApi) => {
    try {
      return await Agent.Account.register(data as UserRegister);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

/**
 * Fetches the current loggedin user from the API.
 */
export const fetchCurrentUserAsync = createAsyncThunk<LoggedInUser>(
  "account/fetchCurrentUserAsync",
  async (_, thunkApi) => {
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const loginUserDto = await Agent.Account.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(loginUserDto));
      return loginUserDto;
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
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
      } else {
        console.log("No user fonund for data");
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAsync.fulfilled, () => {
      router.navigate("/login");
    });

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
