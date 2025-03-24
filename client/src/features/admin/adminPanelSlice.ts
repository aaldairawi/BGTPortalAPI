import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminPanelActions } from "./adminActions";

export interface IAdminPanelSlice {
  text: AdminPanelActions;
  action: { adminActionView: AdminPanelActions; display: boolean };
}

export const adminPanelSliceArray: IAdminPanelSlice[] = [
  {
    text: AdminPanelActions.USERS,
    action: { adminActionView: AdminPanelActions.USERS, display: false },
  },
  {
    text: AdminPanelActions.ROLES,
    action: { adminActionView: AdminPanelActions.ROLES, display: false },
  },
];

interface AdminPanelState {
  items: IAdminPanelSlice[];
  activePanel: AdminPanelActions | null;
}
const initialState: AdminPanelState = {
  items: adminPanelSliceArray,
  activePanel: null,
};
export const adminPanelSlice = createSlice({
  name: "adminPanelSlice",
  initialState,
  reducers: {
    setActiveAdminPanelDisplay: (
      state,
      action: PayloadAction<AdminPanelActions>
    ) => {
      if (state.activePanel === action.payload) {
        return;
      }

      const existingDisplayActive = state.items.find(
        (obj) => obj.action.display === true
      );
      if (existingDisplayActive) {
        existingDisplayActive.action.display =
          !existingDisplayActive.action.display;
      }

      const selectedPanel = state.items.find(
        (obj) => obj.text === action.payload
      );
      if (!selectedPanel) return;
      selectedPanel.action.display = !selectedPanel?.action.display;
      state.activePanel = selectedPanel.text;
    },
    resetDisplay: (state) => {
      
      state.activePanel = null;

    },
  },
});

export const { setActiveAdminPanelDisplay, resetDisplay } =
  adminPanelSlice.actions;
