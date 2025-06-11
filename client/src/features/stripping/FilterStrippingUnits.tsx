import { Box, Button, Popover, Select, MenuItem } from "@mui/material";
import Calendar from "../../app/components/Calendar";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import React, { useState } from "react";
import { updateStrippingFilterData } from "./strippingSlice";

import { getAllStrippedUnitsThunk } from "./getAllStrippedUnitsThunk";
import dayjs from "dayjs";

const FilterStrippingUnits = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { strippingFilterData } = useAppSelector((state) => state.stripping);

  const dispatch = useAppDispatch();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log("Anchor set");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        onClick={(event) => handleClick(event)}
        sx={{ cursor: "pointer" }}
        variant="contained"
      >
        Filter Batch
      </Button>
      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box>
          <Select
            onChange={(event) =>
              dispatch(
                updateStrippingFilterData({
                  berth: event.target.value,
                })
              )
            }
            value={strippingFilterData.berth}
            sx={{ textAlign: "center" }}
          >
            {["B27", "B20"].map((berthValue) => (
              <MenuItem value={berthValue} key={berthValue}>
                {berthValue}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Calendar
            value={
              strippingFilterData.dateStripped
                ? dayjs(strippingFilterData.dateStripped)
                : dayjs()
            }
            onChange={(dateFinalized) =>
              dispatch(
                updateStrippingFilterData({
                  dateStripped: dateFinalized.format("YYYY-MM-DD"),
                })
              )
            }
          />
          <Button
            onClick={() =>
              dispatch(
                getAllStrippedUnitsThunk({
                  dateStripped: strippingFilterData.dateStripped,
                  berth: strippingFilterData.berth,
                })
              )
            }
            variant="contained"
            fullWidth
          >
            Apply Filter
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default FilterStrippingUnits;
