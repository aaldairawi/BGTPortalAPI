import { configureStore } from "@reduxjs/toolkit";
import { usersSlice } from "../../features/admin/usersSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { accountSlice } from "../../features/account/accountSlice";

import { rolesSlice } from "../../features/admin/rolesSlice";
import { navisApiSlice } from "../../features/navisunitapi/navisApiSlice";

import { cTypeFinalizedSlice } from "../../features/sap/cTypeFinalizedSlice";
import { invoiceTypeSlice } from "../../features/sap/invoiceTypeSlice";
import { cTypeInvoiceItemSlice } from "../../features/sap/cTypeInvoiceItemSlice";

export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,

    roles: rolesSlice.reducer,
    users: usersSlice.reducer,
 
    navisApiSlice: navisApiSlice.reducer,
    cFinalizedInvoicesSlice: cTypeFinalizedSlice.reducer,
    cInvoiceTypeSlice: invoiceTypeSlice.reducer,
    cInvoiceItemsSlice: cTypeInvoiceItemSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
