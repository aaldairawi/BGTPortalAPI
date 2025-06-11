import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { usersSlice } from "../../features/admin/users/usersSlice";
import { accountSlice } from "../../features/account/accountSlice";
import { rolesSlice } from "../../features/admin/roles/rolesSlice";
import { n4ContainerSlice } from "../../features/navisunitapi/n4ContainerSlice";
import { cTypeInvoiceSlice } from "../../features/sap/ctype/cTypeInvoiceSlice";
import { sTypeInvoiceSlice } from "../../features/sap/stype/sTypeInvoicSlice";
import { singleInvoiceSlice } from "../../features/sap/singleInvoiceSlice";
import { uploadInvoicesSlice } from "../../features/sap/uploadInvoicesSlice";
import { strippingSlice } from "../../features/stripping/strippingSlice";
import { strippingDriversSlice } from "../../features/stripping/stripping-drivers/strippingDriversSlice";
import { invoiceFiltersSlice } from "../../features/sap/invoicefilters/invoiceFiltersSlice";
import { finalizedInvoiceItemsSlice } from "../../features/sap/finalizedInvoiceItemsSlice";
import { strippingLaborTypeSlice } from "../../features/stripping/stripping-labor-types/strippingLaborTypeSlice";

const appReducer = combineReducers({
  account: accountSlice.reducer,
  roles: rolesSlice.reducer,
  users: usersSlice.reducer,
  n4Containers: n4ContainerSlice.reducer,
  cTypeInvoices: cTypeInvoiceSlice.reducer,
  sTypeInvoices: sTypeInvoiceSlice.reducer,
  singleInvoice: singleInvoiceSlice.reducer,
  uploadInvoices: uploadInvoicesSlice.reducer,
  stripping: strippingSlice.reducer,
  strippingDrivers: strippingDriversSlice.reducer,
  strippingLabor: strippingLaborTypeSlice.reducer,
  invoiceFilters: invoiceFiltersSlice.reducer,
  invoiceItems: finalizedInvoiceItemsSlice.reducer,
});

export type AppState = ReturnType<typeof appReducer>;

const rootReducer = (state: AppState | undefined, action: { type: string }) => {
  if (action.type === "accountSlice/signOut") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
