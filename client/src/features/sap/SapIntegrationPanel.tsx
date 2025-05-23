import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { getInvoiceFiltersAsync } from "./getInvoiceFiltersThunk";
import LoadingComponent from "../../app/components/LoadingComponent";

import { resetInvoicesLoaded } from "./finalizedInvoicesSlice";
import InvoiceBatchUpload from "./InvoiceBatchUpload";
import InvoiceSingleUpload from "./InvoiceSingleUpload";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SapCustomPanel = (props: TabPanelProps) => {
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

const SapIntegrationPanel = () => {
  const [value, setValue] = useState(0);
  const { status, invoiceFiltersLoaded } = useAppSelector(
    (state) => state.finalizedInvoices
  );
  const dispatch = useAppDispatch();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);
    setValue(newValue);
  };

  useEffect(() => {
    if (!invoiceFiltersLoaded) {
      dispatch(getInvoiceFiltersAsync());
    }
  }, [dispatch, invoiceFiltersLoaded]);

  if (status === "pendingGetInvoiceFiltersAsync")
    return <LoadingComponent message="Loading Filters" />;
  if (status === "pendingGetAllFinalizedInvoicesAsync")
    return <LoadingComponent message="Loading Invoices" />;
  if (status === "pendingGetOneFinalizedInvoiceById")
    return <LoadingComponent message="Loading Invoice" />;

  
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="SEARCH BATCH"
            {...a11yProps(0)}
            onClick={() => dispatch(resetInvoicesLoaded())}
          />
          <Tab
            label="SEARCH SINGLE"
            {...a11yProps(1)}
            onClick={() => dispatch(resetInvoicesLoaded())}
          />
          <Tab
            label="Dashboard"
            {...a11yProps(2)}
            onClick={() => dispatch(resetInvoicesLoaded())}
          />
        </Tabs>
      </Box>
      <SapCustomPanel value={value} index={0}>
        <InvoiceBatchUpload />
      </SapCustomPanel>
      <SapCustomPanel value={value} index={1}>
        <InvoiceSingleUpload />
      </SapCustomPanel>
      <SapCustomPanel value={value} index={2}>
        Dashboard
      </SapCustomPanel>
    </Box>
  );
};

export default SapIntegrationPanel;
