
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CInvoiceTypeSection from "./CInvoiceTypeSection";


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const  SapCustomPanel = (props: TabPanelProps)  => {
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
}

const a11yProps =  (index: number) =>  {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const SapIntegrationPanel = () =>  {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <SapCustomPanel value={value} index={0}>
        <CInvoiceTypeSection/>
      </SapCustomPanel>
      <SapCustomPanel value={value} index={1}>
        SL Type Invoice
      </SapCustomPanel>
    </Box>
  );
}

export default SapIntegrationPanel;