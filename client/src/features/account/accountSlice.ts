/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../app/agent/agent";
import { FieldValues } from "react-hook-form";
import {
  ILoggedInUser,
  IUser,
  IUserRegister,
} from "../../app/models/account/user";
import router from "../../app/router/Routes";
import { toast } from "react-toastify";

interface AccountState {
  user: IUser | null;
}
const initialState: AccountState = {
  user: null,
};

export const signInUserAsync = createAsyncThunk<IUser, FieldValues>(
  "account/signInUserAsync",
  async (data, thunkApi) => {
    try {
      const loginUserDto = await agent.Account.login(data);
      if (loginUserDto) {
        localStorage.setItem("user", JSON.stringify(loginUserDto));
      }

      return loginUserDto;
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const registerUserAsync = createAsyncThunk<IUser, FieldValues>(
  "account/registerUserAsync",
  async (data, thunkApi) => {
    try {
      return await agent.Account.register(data as IUserRegister);
    } catch (error: any) {
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchCurrentUserAsync = createAsyncThunk<ILoggedInUser>(
  "account/fetchCurrentUserAsync",
  async (_, thunkApi) => {
    thunkApi.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const loginUserDto = await agent.Account.getCurrentUser();
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
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
      const roles =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      state.user = {
        ...action.payload,
        roles: typeof roles === "string" ? [roles] : roles,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerUserAsync.fulfilled, () => {
      toast.success("Registration successful, please log in.", {
        autoClose: 1200,
      });
      router.navigate("/login");
    });
    builder.addCase(registerUserAsync.rejected, (_, action) => {
      console.log(action.payload);
      toast.error("Something went wrong registering.", { autoClose: 1200 });
    });
    builder.addCase(fetchCurrentUserAsync.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session expired  - please log in again");
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
        
        toast.success(`Welcome ${state.user.userName}`, {
          autoClose: 1200,
        });
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
