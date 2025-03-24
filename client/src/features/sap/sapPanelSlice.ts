import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SapPanelActions } from "./sapActions";

export interface ISapApiPanelSlice {
  text: SapPanelActions;
  action: { sapUserOption: SapPanelActions; display: boolean };
}

export const sapApiPanelSliceArray: ISapApiPanelSlice[] = [
  {
    text: SapPanelActions.C_TYPE_INVOICE,
    action: {
      sapUserOption: SapPanelActions.C_TYPE_INVOICE,
      display: false,
    },
  },
  {
    text: SapPanelActions.S_TYPE_INVOICE,
    action: {
      sapUserOption: SapPanelActions.S_TYPE_INVOICE,
      display: false,
    },
  },
];

interface ISapPanelState {
  items: ISapApiPanelSlice[];
  activePanel: SapPanelActions | null;
}
const initialState: ISapPanelState = {
  items: sapApiPanelSliceArray,
  activePanel: null,
};
export const sapApiPanelSlice = createSlice({
  name: "sapApiPanelSlice",
  initialState,
  reducers: {
    setActiveSapApiPanelDisplay: (
      state,
      action: PayloadAction<SapPanelActions>
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
    resetSapApiPanelDisplay: (state) => {
      state.activePanel = null;
    },
  },
});

export const { setActiveSapApiPanelDisplay, resetSapApiPanelDisplay } =
  sapApiPanelSlice.actions;
