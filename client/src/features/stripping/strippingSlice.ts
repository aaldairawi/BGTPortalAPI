import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  StrippingContainer,
  StrippingLoadedDetails,
  UpdateRetiredContainersDto,
} from "../../app/models/stripping/stripping.types";
import { getAllStrippedUnitsThunk } from "./getAllStrippedUnitsThunk";
import { updateRetiredUnitsThunk } from "./updateStrippingUnitsThunk";

interface StrippingSliceState {
  status: string;
  strippingUnitsLoaded: boolean;
  strippedUnits: StrippingContainer[];
  strippingFilterData: { dateStripped: string; berth: string };
  strippingLoadedDetails: StrippingLoadedDetails | null;
  strippingContainersToBeUpdated: UpdateRetiredContainersDto;
}

const initialState: StrippingSliceState = {
  status: "idle",
  strippedUnits: [],
  strippingUnitsLoaded: false,
  strippingFilterData: { dateStripped: new Date().toISOString(), berth: "B27" },
  strippingLoadedDetails: null,
  strippingContainersToBeUpdated: {
    containers: [],
    driverName: "",
    laborType: "",
    dateStripped: "",
  },
};

export const strippingSlice = createSlice({
  name: "strippingSlice",
  initialState: initialState,
  reducers: {
    updateStrippingFilterData: (
      state,
      action: PayloadAction<Partial<{ dateStripped: string; berth: string }>>
    ) => {
      state.strippingFilterData = {
        ...state.strippingFilterData,
        ...action.payload,
      };
    },
    updateContainerList: (state, action: PayloadAction<string>) => {
      const containerList = state.strippingContainersToBeUpdated.containers;
      const containerIndex = containerList.findIndex(
        (c) => c === action.payload
      );

      if (containerIndex === -1) {
        // Not in the list, add it
        containerList.push(action.payload);
      } else {
        // In the list, remove it
        containerList.splice(containerIndex, 1);
      }
    },
    updateDriverNameForStrippingContainers: (
      state,
      action: PayloadAction<string>
    ) => {
      state.strippingContainersToBeUpdated.driverName = action.payload;
    },

    updateLaborTypeForStrippingContainers: (
      state,
      action: PayloadAction<string>
    ) => {
      state.strippingContainersToBeUpdated.laborType = action.payload;
    },
    resetStrippedContainersToBeUpdated: (state) => {
      state.strippingContainersToBeUpdated.containers = [];
    },
    resetLoadedContainers: (state) => {
      state.strippedUnits = [];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getAllStrippedUnitsThunk.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(getAllStrippedUnitsThunk.pending, (state) => {
      state.status = "pending";
    });
    builder.addCase(getAllStrippedUnitsThunk.fulfilled, (state, action) => {
      state.status = "idle";
      state.strippingUnitsLoaded = true;
      state.strippedUnits = action.payload;

      state.strippingLoadedDetails = {
        strippedContainersLength: action.payload.filter(
          (element) => element.final == true
        ).length,
        retiredContainersLength: action.payload.filter(
          (element) => element.final == false
        ).length,
      };
    });

    builder.addCase(updateRetiredUnitsThunk.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(updateRetiredUnitsThunk.pending, (state) => {
      state.status = "pendingRetireUnits";
    });
    builder.addCase(updateRetiredUnitsThunk.fulfilled, (state,
      action 
    ) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

export const {
  updateContainerList,
  updateStrippingFilterData,
  updateDriverNameForStrippingContainers,
  updateLaborTypeForStrippingContainers,
  resetStrippedContainersToBeUpdated,
  resetLoadedContainers,
} = strippingSlice.actions;
