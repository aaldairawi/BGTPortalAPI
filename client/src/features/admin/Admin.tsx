import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import {Users} from "./Users";

import {Roles} from "./Roles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const AdminAPICustomPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

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
          <Tab label="App Users" {...a11yProps(0)} />
          <Tab label="App Roles" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <AdminAPICustomPanel value={value} index={0}>
        <Users />
      </AdminAPICustomPanel>
      <AdminAPICustomPanel value={value} index={1}>
        <Roles editingUser={false} />
      </AdminAPICustomPanel>
    </Box>
  );
};

export default AdminPanel;
