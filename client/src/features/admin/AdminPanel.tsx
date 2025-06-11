import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { Users } from "./users/Users";

import { Roles } from "./roles/Roles";
import Register from "../account/Register";
import CustomPanel from "../../app/components/CustomPanel";


const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const AdminPanel = () => {
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
          aria-label="basic tabs example"
        >
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Roles" {...a11yProps(1)} />
          <Tab label="Create User" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomPanel value={value} index={0}>
        <Users />
      </CustomPanel>
      <CustomPanel value={value} index={1}>
        <Roles editingUser={false} />
      </CustomPanel>
      <CustomPanel value={value} index={2}>
        <Register showCloseIcon={true} />
      </CustomPanel>
    </Box>
  );
};

export default AdminPanel;
