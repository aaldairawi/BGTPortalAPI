import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import LoadingComponent from "../../app/components/LoadingComponent";

import { cTypeInvoicesSelector } from "./ctype/cTypeInvoiceSlice";
import { sTypeInvoicesSelector } from "./stype/sTypeInvoicSlice";

import SearchSingleInvoice from "./SearchSingleInvoice";
import InvoiceBatchUpload from "./ctype/InvoiceBatchUpload";
import {
  getCTypeInvoiceFiltersAsync,
  getSTypeInvoiceFiltersAsync,
} from "./invoicefilters/getInvoiceFiltersThunk";

import InvoiceDetailsBackdrop from "./InvoiceDetailsBackdrop";
import ShippingLineUpload from "./stype/ShippingLineUpload";
import {
  InvoiceParams,
  InvoicesLoadedDetails,
  FinalizedInvoiceDto,
} from "../../app/models/invoice/invoice.types";
import CustomPanel, { a11yProps } from "../../app/components/CustomPanel";


const SapIntegrationPanel = () => {
  const [value, setValue] = useState(0);
  const dispatch = useAppDispatch();

  const { invoiceItems, showInvoiceItemBackdrop } = useAppSelector(
    (state) => state.invoiceItems
  );
  const {
    invoicesLoaded: cTypeInvoicesLoaded,
    cTypeInvoiceParams,
    cTypeInvoiceLoadedDetails,
    status: cTypeLoadingStatus,
  } = useAppSelector((state) => state.cTypeInvoices);

  const {
    invoicesLoaded: sTypeInvoicesLoaded,
    sTypeInvoiceParams,
    sTypeInvoiceLoadedDetails,
    status: sTypeLoadingStatus,
  } = useAppSelector((state) => state.sTypeInvoices);

  const { status: uploadInvoicesStatus } = useAppSelector(
    (state) => state.uploadInvoices
  );

  const cTypeInvoices = useAppSelector(cTypeInvoicesSelector.selectAll);
  const sTypeInvoices = useAppSelector(sTypeInvoicesSelector.selectAll);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event);

    setValue(newValue);
  };
  const { cType, sType } = useAppSelector((state) => state.invoiceFilters);

  useEffect(() => {
    if (cType.status === "idle" && !cType.invoiceFiltersLoaded) {
      dispatch(getCTypeInvoiceFiltersAsync());
    }
    if (sType.status === "idle" && !sType.invoiceFiltersLoaded) {
      dispatch(getSTypeInvoiceFiltersAsync());
    }
  }, [
    cType.invoiceFiltersLoaded,
    sType.invoiceFiltersLoaded,
    dispatch,
    cType.status,
    sType.status,
  ]);

  const loadingFilters =
    cType.status === "getCTypeInvoiceFiltersPending" ||
    sType.status === "getSTypeInvoiceFiltersPending" ||
    !cType.invoiceFiltersLoaded ||
    !sType.invoiceFiltersLoaded;

  if (loadingFilters) {
    return <LoadingComponent message="Loading Filters" />;
  }

  const fetchingCTypeinvoices =
    cTypeLoadingStatus === "pendingGetAllCTypeInvoicesThunk";

  const fetchingSTypeInvoices =
    sTypeLoadingStatus === "pendingGetAllSTypeInvoicesThunk";

  const invoicesUploading = uploadInvoicesStatus === "pendingUploadInvoices";

  const renderInvoiceUploadTab = (
    invoiceTypeToPass: "C" | "S",
    invoiceStatus: boolean,
    invoiceParams: InvoiceParams,
    invoiceLoadedDetails: InvoicesLoadedDetails | null,
    invoicesLoaded: boolean,
    invoices: FinalizedInvoiceDto[]
  ) => (
    <InvoiceBatchUpload
      invoiceUploadingStatus={invoicesUploading}
      invoiceStatus={invoiceStatus}
      invoiceParams={invoiceParams}
      invoiceLoadedDetails={invoiceLoadedDetails}
      invoicesToUpload={invoices}
      invoiceTypeToPass={invoiceTypeToPass}
      invoicesLoaded={invoicesLoaded}
      invoicesToDisplay={invoices}
    />
  );
const tabLabels = [
  "Consignee Invoices",
  "Shipping Line Invoices",
  "Single",
  "Upload SL Invoices",
  "Dashboard",
];

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="SAP Integration Tabs Panel"
          >
            {tabLabels.map((label, index) => (<Tab key={index} label={label} {...a11yProps(index)} />) )}
          </Tabs>
        </Box>
        <CustomPanel value={value} index={0}>
          {renderInvoiceUploadTab(
            "C",
            fetchingCTypeinvoices,
            cTypeInvoiceParams,
            cTypeInvoiceLoadedDetails,
            cTypeInvoicesLoaded,
            cTypeInvoices
          )}
        </CustomPanel>
        <CustomPanel value={value} index={1}>
          {renderInvoiceUploadTab(
            "S",
            fetchingSTypeInvoices,
            sTypeInvoiceParams,
            sTypeInvoiceLoadedDetails,
            sTypeInvoicesLoaded,
            sTypeInvoices
          )}
        </CustomPanel>
        <CustomPanel value={value} index={2}>
          <SearchSingleInvoice />
        </CustomPanel>
        <CustomPanel value={value} index={3}>
          <ShippingLineUpload />
        </CustomPanel>

        <CustomPanel value={value} index={4}>
          Dashboard
        </CustomPanel>
      </Box>
      {showInvoiceItemBackdrop && invoiceItems.length > 0 && (
        <InvoiceDetailsBackdrop invoiceItems={invoiceItems} />
      )}
    </>
  );
};

export default SapIntegrationPanel;
