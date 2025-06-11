import {
  createEntityAdapter,
  createSlice,
  //PayloadAction,
} from "@reduxjs/toolkit";
import { UserAppInfo, UserDto } from "../../../app/models/account/user.types";
import { RootState } from "../../../app/store/configureStore";

import { getAllUsersAsync, getUserToUpdateInfoAsync } from "./getUserThunks";

import { deleteUserAsync } from "./deleteUserThunk";
import { sendUpdatedUserInfoAsync } from "../updateUserThunk";

import {
  addRoleToUserAsync,
  removeRoleFromUserAsync,
} from "../roles/roleThunks";

interface UserState {
  usersloaded: boolean;
  status: string;
  existingUserAppInfo: UserAppInfo;
  userToEditFetched: boolean;
  editUserFormTouched: boolean;
}

const usersAdapter = createEntityAdapter<UserDto>();

export const usersSlice = createSlice({
  name: "usersSlice",
  initialState: usersAdapter.getInitialState<UserState>({
    usersloaded: false,
    status: "idle",
    userToEditFetched: false,
    editUserFormTouched: false,
    existingUserAppInfo: {
      userId: 0,
      roles: [],
      passwordPlaceHolder: "",
      username: "",
      email: "",
      registered: "",
      lastLoggedIn: "",
    },
  }),
  reducers: {
    removeUserById: usersAdapter.removeOne,
    createUser: usersAdapter.addOne,

    cancelEditingUser: (state) => {
      state.existingUserAppInfo = {
        userId: 0,
        roles: [],
        passwordPlaceHolder: "",
        username: "",
        email: "",
        lastLoggedIn: "",
        registered: "",
      };

      state.editUserFormTouched = false;
      state.userToEditFetched = false;
    },
    setEditFormTouched: (state) => {
      if (!state.editUserFormTouched) {
        state.editUserFormTouched = true;
      }
    },
    clearUsersLoadedFromAdapter: (state) => {
      usersAdapter.removeAll(state);
      state.usersloaded = false;
    },
    resetEditUserFetched: (state) => {
      state.userToEditFetched = false;
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
    });

    builder.addCase(getUserToUpdateInfoAsync.pending, (state) => {
      state.userToEditFetched = false;
      state.status = "pendingGettingUserAppInfo";
    });

    builder.addCase(getUserToUpdateInfoAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action);
    });

    builder.addCase(getUserToUpdateInfoAsync.fulfilled, (state, action) => {
      state.existingUserAppInfo.roles = [...action.payload.roles];
      state.existingUserAppInfo.userId = action.payload.userId;
      state.existingUserAppInfo.username = action.payload.username;
      state.existingUserAppInfo.email = action.payload.email;
      state.existingUserAppInfo.registered = action.payload.registered;
      state.existingUserAppInfo.lastLoggedIn = action.payload.lastLoggedIn;
      state.existingUserAppInfo.passwordPlaceHolder =
        action.payload.passwordPlaceHolder;
      state.userToEditFetched = true;
      state.status = "idle";
    });

    builder.addCase(sendUpdatedUserInfoAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(sendUpdatedUserInfoAsync.pending, (state) => {
      state.status = "pendingsendUpdatedUserInfoAsync";
    });
    builder.addCase(sendUpdatedUserInfoAsync.fulfilled, (state) => {
      state.status = "idle";
    });
    builder.addCase(addRoleToUserAsync.rejected, (state) => {
      state.status = "idle";
    });
    builder.addCase(addRoleToUserAsync.pending, (state, action) => {
      state.status = "pendingAddingRoleToUser" + action.meta.arg.roleId;
    });

    builder.addCase(addRoleToUserAsync.fulfilled, (state, action) => {
      const indexOfRoleToAdd = state.existingUserAppInfo.roles.findIndex(
  (role) => role.id === action.meta.arg.roleId
);

      if (indexOfRoleToAdd === -1) return;

      state.existingUserAppInfo.roles[indexOfRoleToAdd].status = true;
      if (!state.editUserFormTouched) {
        state.editUserFormTouched = true;
      }

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
      const indexOfRemovedRole = state.existingUserAppInfo.roles.findIndex(
        (role) => role.name === action.meta.arg.role
      );
      state.existingUserAppInfo.roles[indexOfRemovedRole].status = false;
      state.status = "idle";
      if (!state.editUserFormTouched) {
        state.editUserFormTouched = true;
      }
    });
  },
});

export const userSelectors = usersAdapter.getSelectors(
  (state: RootState) => state.users
);

export const {
  setEditFormTouched,
  cancelEditingUser,
  createUser,
  removeUserById,
  clearUsersLoadedFromAdapter,
  resetEditUserFetched,
} = usersSlice.actions;
