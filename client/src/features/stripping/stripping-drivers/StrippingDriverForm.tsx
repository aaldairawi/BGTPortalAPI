import { Box, Button, Popover, TextField } from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";

import React, { ChangeEvent, useState } from "react";
import { createStrippingDriverThunk } from "./createStrippingDriverThunk";
import { toast } from "react-toastify";

const StrippingDriverForm = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [driverName, setDriverName] = useState("");
  const { user } = useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();

  const onHandleDriverName = (event: ChangeEvent<HTMLInputElement>) => {
    setDriverName(event.target.value);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    console.log("Anchor set");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = async () => {
    if (!user || !user.userName) {
      console.log("No user logged in for the creator value");
      return;
    }
    try {
      await dispatch(
        createStrippingDriverThunk({
          name: driverName,
          creator: user.userName,
        })
      ).unwrap();
      toast.success(`Driver "${driverName}" created successfully!`, {
        autoClose: 300,
      });

      setDriverName("");
      handleClose();
    } catch (err) {
      console.error("Failed to create driver:", err);
      toast.error("Failed to create driver. Please try again.");
    }
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        onClick={(event) => handleClick(event)}
        sx={{ cursor: "pointer" }}
        variant="contained"
      >
        Add Driver
      </Button>
      <Popover
        anchorEl={anchorEl}
        onClose={handleClose}
        open={open}
        sx={{ mt: 3 }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            gap: 2,
          }}
        >
          <TextField
            placeholder="Driver Name"
            variant="outlined"
            value={driverName}
            onChange={onHandleDriverName}
          />
          <Button onClick={handleSubmit} variant="contained" fullWidth>
            Create
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default StrippingDriverForm;
