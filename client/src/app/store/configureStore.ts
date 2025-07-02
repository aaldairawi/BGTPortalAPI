import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { usersSlice } from "../../features/admin/users/usersSlice";
import { accountSlice } from "../../features/account/accountSlice";
import { rolesSlice } from "../../features/admin/roles/rolesSlice";
import { unitLifeTimeSlice } from "../../features/navisunitapi/unitLifeTime/unitLifeTimeSlice";
import { consigneeInvoiceSlice } from "../../features/sap/consigneeInvoices/consigneeInvoiceSlice";
import { shippingLineInvoicesSlice } from "../../features/sap/shippingLineInvoices/shippingLineInvoicesSlice";
import { singleInvoiceSlice } from "../../features/sap/singleInvoiceSlice";
import { uploadConsigneeInvoicesSlice } from "../../features/sap/consigneeInvoices/uploadConsigneeInvoicesSlice";
import { strippingSlice } from "../../features/stripping/strippingSlice";
import { strippingDriversSlice } from "../../features/stripping/stripping-drivers/strippingDriversSlice";
import { invoiceFiltersSlice } from "../../features/sap/invoicefilters/invoiceFiltersSlice";
import { consigneeInvoicesFinalizedInvoiceItemsSlice } from "../../features/sap/consigneeInvoices/consigneeInvoicesFinalizedInvoiceItemsSlice";
import { strippingLaborTypeSlice } from "../../features/stripping/stripping-labor-types/strippingLaborTypeSlice";
import { strippingDashboardSlice } from "../../features/stripping/dashboard/strippingDashboardSlice";
import { shippingLineInvoiceItemsSlice } from "../../features/sap/shippingLineInvoices/shippingLineInvoiceItemsSlice";
import { shippingLineInvoiceCsvSlice } from "../../features/sap/shippingLineInvoices/shippingLineInvoicesCsvSlice";

import { uploadSlInvoicesPreviewSlice } from "../../features/sap/shippingLineInvoices/uploadSlInvoicesPreviewSlice";
import { unitCurrentStatusSlice } from "../../features/navisunitapi/unitCurrentStatus/unitCurrentStatusSlice";
import { uploadedDashboardInvoicesSlice } from "../../features/sap/dashboard/uploadedInvoicesSlice";
import { pendingDashboardInvoicesSlice } from "../../features/sap/dashboard/pendingInvoicesSlice";
import { vesselScheduleSlice } from "../../features/navisunitapi/vesselSchedule/vesselScheduleSlice";

const appReducer = combineReducers({
  account: accountSlice.reducer,
  roles: rolesSlice.reducer,
  users: usersSlice.reducer,

  unitCurrentStatus: unitCurrentStatusSlice.reducer,
  unitLifeTime: unitLifeTimeSlice.reducer,
  consigneeInvoices: consigneeInvoiceSlice.reducer,
  shippingLineInvoices: shippingLineInvoicesSlice.reducer,
  singleInvoice: singleInvoiceSlice.reducer,
  uploadConsigneeInvoices: uploadConsigneeInvoicesSlice.reducer,
  uploadSlToPreview: uploadSlInvoicesPreviewSlice.reducer,

  stripping: strippingSlice.reducer,
  strippingDrivers: strippingDriversSlice.reducer,
  strippingLabor: strippingLaborTypeSlice.reducer,
  strippingDashboard: strippingDashboardSlice.reducer,
  invoiceFilters: invoiceFiltersSlice.reducer,
  consigneeInvoiceItems: consigneeInvoicesFinalizedInvoiceItemsSlice.reducer,
  shippingLineInvoiceItems: shippingLineInvoiceItemsSlice.reducer,
  shippingLineInvoiceCsv: shippingLineInvoiceCsvSlice.reducer,
  // Invoices Dashboard
  uploadedInvoicesDashboard: uploadedDashboardInvoicesSlice.reducer,
  pendingInvoicesDashboard: pendingDashboardInvoicesSlice.reducer,
  // Vessel Schedule
  vesselSchedule: vesselScheduleSlice.reducer,
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
