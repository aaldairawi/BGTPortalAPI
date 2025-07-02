import { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import LoadingComponent from "../../app/components/LoadingComponent";

import { cTypeInvoicesSelector } from "./consigneeInvoices/consigneeInvoiceSlice";

import ConsigneeInvoiceBatchUpload from "./consigneeInvoices/ConsigneeInvoiceBatchUpload";
import { getCTypeInvoiceFiltersAsync } from "./invoicefilters/getInvoiceFiltersThunk";

import ShippingLineUpload from "./shippingLineInvoices/ShippingLineUpload";
import ShippingLineInvoiceDetails from "./shippingLineInvoices/ShippingLineInvoiceDetails";

import ConsigneeInvoiceDetailsBackdrop from "./consigneeInvoices/ConsigneeInvoiceDetailsBackdrop";
import { a11yProps } from "../../app/components/tabUtils";
import CustomPanel from "../../app/components/CustomPanel";
import { UploadedInvoices } from "./dashboard/UploadedInvoices";
import { PendingInvoices } from "./dashboard/PendingInvoices";


const SapIntegrationPanel = () => {
  const [value, setValue] = useState(0);
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.account);
  const hasIraqFinanceRole = user?.roles?.includes("IraqFinance");

  const { consigneeInvoiceItems, showInvoiceItemBackdrop } = useAppSelector(
    (state) => state.consigneeInvoiceItems
  );
  const { displayShippingLineInvoiceItems, shippingLinePartnerItems } =
    useAppSelector((state) => state.shippingLineInvoiceItems);

  const {
    invoicesLoaded,
    cTypeInvoiceParams,
    cTypeInvoiceLoadedDetails,
    status,
  } = useAppSelector((state) => state.consigneeInvoices);

  const { status: uploadInvoicesStatus } = useAppSelector(
    (state) => state.uploadConsigneeInvoices
  );

  const cTypeInvoices = useAppSelector(cTypeInvoicesSelector.selectAll);
  const { cType } = useAppSelector((state) => state.invoiceFilters);

  useEffect(() => {
    if (cType.status === "idle" && !cType.invoiceFiltersLoaded) {
      dispatch(getCTypeInvoiceFiltersAsync());
    }
  }, [cType.invoiceFiltersLoaded, dispatch, cType.status]);

  const loadingFilters =
    cType.status === "getCTypeInvoiceFiltersPending" ||
    !cType.invoiceFiltersLoaded;

  if (loadingFilters) {
    return <LoadingComponent message="Loading Filters" />;
  }

  const isFetchingInvoices = status === "pending";
  const invoicesUploading = uploadInvoicesStatus === "pendingUploadInvoices";

  // Tab labels based on roles
  const tabLabels = [
    "Consignee Invoices",
    ...(!hasIraqFinanceRole
      ? ["SL2 & SL4 Invoices", "Uploaded Invoices", "Pending Invoices"]
      : []),
  ];

  // Calculate index for dashboard panel dynamically
  const slUploadIndex = tabLabels.indexOf("SL2 & SL4 Invoices");

  const uploadedInvoicesIndex = tabLabels.indexOf("Uploaded Invoices");
  const pendingInvoicesIndex = tabLabels.indexOf("Pending Invoices");

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={(_, newVal) => setValue(newVal)}
            aria-label="SAP Integration Tabs Panel"
            sx={{
              bgcolor: "#f5f5f5",
              px: 2,
              pt: 1,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}
          >
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        <CustomPanel value={value} index={0}>
          <ConsigneeInvoiceBatchUpload
            invoiceUploadingStatus={invoicesUploading}
            invoiceStatus={isFetchingInvoices}
            invoiceParams={cTypeInvoiceParams}
            invoiceLoadedDetails={cTypeInvoiceLoadedDetails}
            invoicesToUpload={cTypeInvoices}
            invoicesLoaded={invoicesLoaded}
            invoicesToDisplay={cTypeInvoices}
          />
        </CustomPanel>

        {!hasIraqFinanceRole && (
          <CustomPanel value={value} index={slUploadIndex}>
            <ShippingLineUpload />
          </CustomPanel>
        )}

        {!hasIraqFinanceRole && (
          <CustomPanel value={value} index={uploadedInvoicesIndex}>
            <UploadedInvoices />
          </CustomPanel>
        )}

        {!hasIraqFinanceRole && (
          <CustomPanel value={value} index={pendingInvoicesIndex}>
            <PendingInvoices/>
          </CustomPanel>
        )}
      </Box>

      {showInvoiceItemBackdrop && consigneeInvoiceItems.length > 0 && (
        <ConsigneeInvoiceDetailsBackdrop invoiceItems={consigneeInvoiceItems} />
      )}
      {displayShippingLineInvoiceItems && shippingLinePartnerItems && (
        <ShippingLineInvoiceDetails invoiceItems={shippingLinePartnerItems} />
      )}
    </>
  );
};

export default SapIntegrationPanel;
