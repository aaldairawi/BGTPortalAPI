import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UnitCurrentStatus from "./unitCurrentStatus/UnitCurrentStatus";

import { a11yProps } from "../../app/components/tabUtils";
import CustomPanel from "../../app/components/CustomPanel";
import UnitLifeTime from "./unitLifeTime/UnitLifeTime";
import VesselSchedule from "./vesselSchedule/VesselSchedule";

const NavisContainerAPIPanel = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="Navis Container API Tabs"
          sx={{
            bgcolor: "#f5f5f5",
            px: 2,
            pt: 1,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        >
          <Tab label="Current Status" {...a11yProps(0)} />

          <Tab label="Unit Lifetime" {...a11yProps(1)} />
          <Tab label="Vessel Schedule" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomPanel value={value} index={0}>
        <UnitCurrentStatus />
      </CustomPanel>
      <CustomPanel value={value} index={1}>
        <UnitLifeTime />
      </CustomPanel>
      <CustomPanel value={value} index={2}>
        <VesselSchedule />
      </CustomPanel>
    </Box>
  );
};

export default NavisContainerAPIPanel;
