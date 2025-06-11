/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { strippingDriversSelector } from "./stripping-drivers/strippingDriversSlice";
import { strippingLaborTypeSelectors } from "./stripping-labor-types/strippingLaborTypeSlice";
import {
  resetStrippedContainers,
  updateDriverNameForStrippingContainers,
  updateLaborTypeForStrippingContainers,
} from "./strippingSlice";
import { updateRetiredUnitsThunk } from "./updateStrippingUnitsThunk";
import { toast } from "react-toastify";

export function StrippingUploadAction() {
  const dispatch = useAppDispatch();

  const drivers = useAppSelector(strippingDriversSelector.selectAll);
  const laborTypes = useAppSelector(strippingLaborTypeSelectors.selectAll);
  const { strippingContainersToBeUpdated } = useAppSelector(
    (state) => state.stripping
  );

  const [selectedDriverId, setSelectedDriverId] = useState<
    number | undefined
  >();
  const [selectedLaborTypeId, setSelectedLaborTypeId] = useState<
    number | undefined
  >();

  const selectedDriver = drivers.find(
    (driver) => driver.id === selectedDriverId
  );
  const selectedLaborType = laborTypes.find(
    (labor) => labor.id === selectedLaborTypeId
  );

  const handleDriverChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    const driverId = value === "" ? undefined : Number(value);

    setSelectedDriverId(driverId);

    const driver = drivers.find((d) => d.id === driverId);
    if (driver) {
      dispatch(updateDriverNameForStrippingContainers(driver.name));
    }
  };

  const handleLaborChange = (event: SelectChangeEvent<number | "">) => {
    const value = event.target.value;
    const laborId = value === "" ? undefined : Number(value);

    setSelectedLaborTypeId(laborId);

    const labor = laborTypes.find((l) => l.id === laborId);
    if (labor) {
      dispatch(updateLaborTypeForStrippingContainers(labor.laborType));
    }
  };

  // inside handleSubmit
  const handleSubmit = async () => {
    if (!selectedDriver || !selectedLaborType) {
      alert("Please select both a driver and labor type.");
      return;
    }

    try {
      const resultAction = await dispatch(
        updateRetiredUnitsThunk({
          containers: strippingContainersToBeUpdated.containers,
          driverName: selectedDriver.name,
          laborType: selectedLaborType.laborType,
        })
      );

      if (updateRetiredUnitsThunk.fulfilled.match(resultAction)) {
        const wasSuccessful = resultAction.payload;

        if (wasSuccessful) {
          toast.success("Retired containers updated successfully!", {
            autoClose: 600,
          });
          setSelectedDriverId(undefined);
          setSelectedLaborTypeId(undefined);
          dispatch(updateDriverNameForStrippingContainers(""));
          dispatch(updateLaborTypeForStrippingContainers(""));
          dispatch(resetStrippedContainers());
        } else {
          toast.error("Some containers failed to update.");
        }
      } else {
        toast.error("Failed to update containers.");
      }
    } catch (err: any) {
      console.log(err);

      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <Box display="flex" flexDirection="row" gap={2} alignItems="center">
      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="driver-select-label">Driver</InputLabel>
        <Select<number | "">
          labelId="driver-select-label"
          id="driver-select"
          value={selectedDriverId ?? ""}
          label="Driver"
          onChange={handleDriverChange}
        >
          <MenuItem value="">
            <em>Select Driver</em>
          </MenuItem>
          {drivers.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              {driver.name.slice(0, 25)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel id="labor-select-label">Labor Type</InputLabel>
        <Select<number | "">
          labelId="labor-select-label"
          id="labor-select"
          value={selectedLaborTypeId ?? ""}
          label="Labor Type"
          onChange={handleLaborChange}
        >
          <MenuItem value="">
            <em>Select Labor Type</em>
          </MenuItem>
          {laborTypes.map((labor) => (
            <MenuItem key={labor.id} value={labor.id}>
              {labor.laborType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 180 }}>
        Submit
      </Button>
    </Box>
  );
}
