import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavisApiSliceActions } from "./navisApiPanelActions";

export interface INavisApiPanelSlice {
  text: NavisApiSliceActions;
  action: { adminActionValue: NavisApiSliceActions; display: boolean };
}

export const navisApiPanelSliceArray: INavisApiPanelSlice[] = [
  {
    text: NavisApiSliceActions.UNIT_STATUS,
    action: {
      adminActionValue: NavisApiSliceActions.UNIT_STATUS,
      display: false,
    },
  },
  {
    text: NavisApiSliceActions.UNIT_LIFETIME,
    action: {
      adminActionValue: NavisApiSliceActions.UNIT_LIFETIME,
      display: false,
    },
  },
];

interface INavisApiPanelState {
  items: INavisApiPanelSlice[];
  activePanel: NavisApiSliceActions | null;
}
const initialState: INavisApiPanelState = {
  items: navisApiPanelSliceArray,
  activePanel: null,
};

export const navisApiPanelSlice = createSlice({
  name: "navisApiPanelSlice",
  initialState,
  reducers: {
    setActiveNavisApiPanelDisplay: (
      state,
      action: PayloadAction<NavisApiSliceActions>
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
    resetNavisApiPanelDisplay: (state) => {
      state.activePanel = null;
    },
  },
});

export const { setActiveNavisApiPanelDisplay, resetNavisApiPanelDisplay } =
  navisApiPanelSlice.actions;
