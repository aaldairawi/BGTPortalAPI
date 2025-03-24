/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  IUpdateUserDto,
  IUser,
  IUserDto,
  IUserRegister,
} from "../../app/models/account/user";
import agent from "../../app/agent/agent";
import { RootState } from "../../app/store/configureStore";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import { IUpdateUserRole } from "../../app/models/role/role";

interface IUserState {
  usersloaded: boolean;
  status: string;
  userUpdatedData: IUpdateUserDto;
  userUpdateFormTouched: boolean;
}

const usersAdapter = createEntityAdapter<IUserDto>();

export const getAllUsersAsync = createAsyncThunk<
  IUserDto[],
  void,
  { state: RootState }
>("usersSlice/getAllUsersAsync", async (_, thunkApi) => {
  try {
    return await agent.Users.get();
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const createUserAsync = createAsyncThunk<IUser, FieldValues>(
  "usersSlice/createUserAsync",
  async (data, thunkApi) => {
    try {
      return await agent.Users.create(data as IUserRegister);
    } catch (error: any) {
      console.log(error);
      return thunkApi.rejectWithValue({ error: error.data });
    }
  }
);

export const editUserAsync = createAsyncThunk<
  IUserDto,
  IUpdateUserDto,
  { state: RootState }
>("usersSlice/editUserRolesAsync", async (data, thunkApi) => {
  try {
    return await agent.Users.edit(data);
  } catch (error: any) {
    return thunkApi.rejectWithValue({ error: error.data });
  }
});

export const addRoleToUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string },
  { state: RootState }
>("usersSlice/addRoleToUserAsync", async () => {
  try {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve();
      }, 2000)
    );
  } catch (error: any) {
    console.log(error);
  }
});

export const removeRoleFromUserAsync = createAsyncThunk<
  void,
  { roleId: number; role: string; name: string },
  { state: RootState }
>("usersSlice/removeRoleFromUserAsync", async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  } catch (error: any) {
    console.log(error);
  }
});

export const deleteUserAsync = createAsyncThunk<
  Promise<any>,
  number,
  { state: RootState }
>("usersSlice/deleteUserAsync", async (id, thunkApi) => {
  try {
    const deleteUserResponse = await agent.Users.delete(id);
    return deleteUserResponse;
  } catch (error: any) {
    thunkApi.rejectWithValue({ error: error.data });
  }
});

export const usersSlice = createSlice({
  name: "usersSlice",
  initialState: usersAdapter.getInitialState<IUserState>({
    usersloaded: false,
    status: "idle",
    userUpdatedData: {
      userId: "",
      roles: [
        { role: "Admin", status: false },
        { role: "DubaiBilling", status: false },
        { role: "Stripping", status: false },
        { role: "Billing", status: false },
        { role: "BillingSupervisor", status: false },
      ],
      password: { newPassword: "" },
    },
    userUpdateFormTouched: false,
  }),
  reducers: {
    removeUserById: usersAdapter.removeOne,
    createUser: usersAdapter.addOne,
    setUserData: (state, action: PayloadAction<IUpdateUserDto>) => {
      let roleName: string = "";
      let finalUpdatedArray: IUpdateUserRole[] = [];
      let rolesThatAreFalseFiltered: IUpdateUserRole[] = [];

      const rolesThatAreAssignedToUser = action.payload.roles.filter(
        (role) => role.status === true
      );

      if (rolesThatAreAssignedToUser.length > 0) {
        for (
          let index = 0;
          index < rolesThatAreAssignedToUser.length;
          index++
        ) {
          roleName = rolesThatAreAssignedToUser[index].role;
          rolesThatAreFalseFiltered = state.userUpdatedData.roles.filter(
            (role) => role.role !== roleName
          );
        }
        finalUpdatedArray = [
          ...rolesThatAreAssignedToUser,
          ...rolesThatAreFalseFiltered!,
        ];
      } else if (rolesThatAreAssignedToUser.length <= 0) {
        finalUpdatedArray = state.userUpdatedData.roles;
      }

      state.userUpdatedData.userId = action.payload.userId;
      state.userUpdatedData.roles = finalUpdatedArray;
      state.userUpdatedData.password = action.payload.password;
    },
    cancelEditingUser: (state) => {
      state.userUpdatedData = {
        userId: "",
        roles: [
          { role: "Admin", status: false },
          { role: "DubaiBilling", status: false },
          { role: "Stripping", status: false },
          { role: "Billing", status: false },
          { role: "BillingSupervisor", status: false },
        ],
        password: { newPassword: "" },
      };
      state.userUpdateFormTouched = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsersAsync.pending, (state) => {
      state.status = "pendingGetAllUsers";
    });
    builder.addCase(getAllUsersAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(getAllUsersAsync.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.usersloaded = true;
      toast.success("Retrieved all users.", {
        autoClose: 1500,
      });
    });
    builder.addCase(deleteUserAsync.pending, (state) => {
      state.status = "pendingDeleteUser";
    });
    builder.addCase(deleteUserAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(deleteUserAsync.fulfilled, (state) => {
      state.status = "idle";
      toast.success("Deleted user successfully!", { autoClose: 1500 });
    });
    builder.addCase(createUserAsync.rejected, (state) => {
      state.status = "idle";
      console.log("Creating user rejected");
    });
    builder.addCase(createUserAsync.pending, (state) => {
      state.status = "pendingCreateUserAsync";
    });
    builder.addCase(createUserAsync.fulfilled, (state, action) => {
      usersAdapter.setOne(state, action.payload);
      state.status = "idle";
      toast.success("User created successfully.", { autoClose: 1500 });
    });
    builder.addCase(editUserAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(editUserAsync.pending, (state) => {
      state.status = "pendingEditUserAsync";
    });
    builder.addCase(editUserAsync.fulfilled, (state, action) => {
      usersAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
      state.userUpdatedData = state.userUpdatedData = {
        userId: "",
        roles: [
          { role: "Admin", status: false },
          { role: "DubaiBilling", status: false },
          { role: "Stripping", status: false },
          { role: "Billing", status: false },
          { role: "BillingSupervisor", status: false },
        ],
        password: { newPassword: "" },
      };
      state.userUpdateFormTouched = false;
      state.status = "idle";
      toast.success("User updated successfully!", { autoClose: 1200 });
    });
    builder.addCase(addRoleToUserAsync.rejected, (state) => {
      state.status = "idle";
      console.log("rejected addRoleToUserAsync");
    });
    builder.addCase(addRoleToUserAsync.pending, (state, action) => {
      state.status = "pendingAddingRoleToUser" + action.meta.arg.roleId;
    });
    builder.addCase(addRoleToUserAsync.fulfilled, (state, action) => {
      const roleToAdjust = state.userUpdatedData.roles.find(
        (role) => role.role === action.meta.arg.role
      );
      const indexOfRoleToAdjust = state.userUpdatedData.roles.findIndex(
        (role) => role === roleToAdjust
      );
      state.userUpdatedData.roles[indexOfRoleToAdjust].status = true;
      state.userUpdateFormTouched = true;

      state.status = "idle";
    });
    builder.addCase(removeRoleFromUserAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(removeRoleFromUserAsync.pending, (state, action) => {
      state.status =
        "pendingRemovingRoleFromUser" +
        action.meta.arg.roleId +
        action.meta.arg.name;
    });
    builder.addCase(removeRoleFromUserAsync.fulfilled, (state, action) => {
      const roleClickedInList = state.userUpdatedData.roles.find(
        (role) => role.role === action.meta.arg.role
      );
      const indexOfClickedRole = state.userUpdatedData.roles.findIndex(
        (role) => role === roleClickedInList
      );
      state.userUpdatedData.roles[indexOfClickedRole].status = false;
      state.userUpdateFormTouched = true;
      state.status = "idle";
    });
  },
});

export const userSelectors = usersAdapter.getSelectors(
  (state: RootState) => state.users
);

export const { cancelEditingUser, setUserData, createUser, removeUserById } =
  usersSlice.actions;
