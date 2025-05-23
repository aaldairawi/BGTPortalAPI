import { configureStore } from "@reduxjs/toolkit";
import { usersSlice } from "../../features/admin/usersSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";

import { rolesSlice } from "../../features/admin/rolesSlice";
import { n4ContainerSlice } from "../../features/navisunitapi/n4ContainerSlice";

import { finalizedInvoicesSlice } from "../../features/sap/finalizedInvoicesSlice";
import { uploadInvoicesSlice } from "../../features/sap/uploadInvoicesSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    roles: rolesSlice.reducer,
    users: usersSlice.reducer,
    n4Containers: n4ContainerSlice.reducer,
    finalizedInvoices: finalizedInvoicesSlice.reducer,
    uploadInvoices: uploadInvoicesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
