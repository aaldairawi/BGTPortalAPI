import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import UnitCurrentStatus from "./UnitCurrentStatus";
import UnitLifeTime from "./UnitLifeTime";
import { useAppDispatch } from "../../app/store/configureStore";
import {
  resetImportExportLifeTime,
  resetUnitCurrentStatus,
} from "./n4ContainerSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const NavisApiCustomPanel = (props: TabPanelProps) => {
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

const NavisContainerAPIPanel = () => {
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  const onHandleResetCurrentUnitStatus = () => {
    dispatch(resetUnitCurrentStatus());
  };

  const onHandleResetUnitImportExport = () => {
    dispatch(resetImportExportLifeTime());
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="Current Status"
            {...a11yProps(0)}
            onClick={onHandleResetCurrentUnitStatus}
          />
          
          <Tab
            label="Unit Lifetime"
            {...a11yProps(1)}
            onClick={onHandleResetUnitImportExport}
          />
        </Tabs>
      </Box>
      <NavisApiCustomPanel value={value} index={0}>
        <UnitCurrentStatus />
      </NavisApiCustomPanel>
      <NavisApiCustomPanel value={value} index={1}>
        <UnitLifeTime />
      </NavisApiCustomPanel>
    </Box>
  );
};

export default NavisContainerAPIPanel;
