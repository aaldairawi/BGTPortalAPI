import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";

import Tab from "@mui/material/Tab";

import Box from "@mui/material/Box";

//import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

//import LoadingComponent from "../../app/components/LoadingComponent";
import { Typography } from "@mui/material";
import StrippingUpload from "./StrippingUpload";

import { StrippingDriverUpload } from "./stripping-drivers/StrippingDriverUpload";
import CustomPanel, { a11yProps } from "../../app/components/CustomPanel";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { getAllStrippingDriversThunk } from "./stripping-drivers/getAllStrippingDriversThunk";
import { getStrippingLaborTypeThunk } from "./stripping-labor-types/getStrippingLaborTypeThunk";
import LoadingComponent from "../../app/components/LoadingComponent";

const StrippingUnitsPanel = () => {
  const [value, setValue] = useState(0);
  const { strippingDriversLoaded, strippingDriverStatus } = useAppSelector(
    (state) => state.strippingDrivers
  );
  const { strippingLaborTypesLoaded, status: strippingLaborTypeStatus } =
    useAppSelector((state) => state.strippingLabor);

  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  useEffect(() => {
    if (!strippingDriversLoaded) {
      dispatch(getAllStrippingDriversThunk());
    }
    if (!strippingLaborTypesLoaded) {
      dispatch(getStrippingLaborTypeThunk());
    }
  }, [dispatch, strippingDriversLoaded, strippingLaborTypesLoaded]);

  if (strippingDriverStatus === "pending")
    return <LoadingComponent message="Loading Drivers..." />;
  if (strippingLaborTypeStatus === "pending") {
    return <LoadingComponent message="Loading Labor Types..." />;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="stripping tabs">
          <Tab label="Strip Units" {...a11yProps(0)} />
          <Tab label="Stripping Drivers" {...a11yProps(1)} />
          <Tab label="Dashboard" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomPanel value={value} index={0}>
        <StrippingUpload />
      </CustomPanel>
      <CustomPanel value={value} index={1}>
        <StrippingDriverUpload />
      </CustomPanel>
      <CustomPanel value={value} index={2}>
        <Typography>Stripping dashboard To be continued</Typography>
      </CustomPanel>
    </Box>
  );
};

export default StrippingUnitsPanel;
