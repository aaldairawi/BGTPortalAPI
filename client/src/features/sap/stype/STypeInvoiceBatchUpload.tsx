
import {  useAppSelector } from "../../../app/store/configureStore";
import { cTypeInvoicesSelector } from "../ctype/cTypeInvoiceSlice";

import InvoicesList from "../InvoicesList";
import { Box, Typography } from "@mui/material";

import FilterInvoiceBatch from "../FilterInvoiceBatch";
import { InvoiceDetails } from "../../../app/components/InvoiceDetails";

export default function STypeInvoiceBatchUpload () {
  const { invoicesLoaded } = useAppSelector((state) => state.sTypeInvoices);


  const invoices = useAppSelector((state) => cTypeInvoicesSelector.selectAll(state));
  

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          pb: 1,
        }}
      >
        <FilterInvoiceBatch invoiceTypeToPass="S"/>
      </Box>

      {invoicesLoaded && invoices.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <InvoicesList invoices={invoices} />
          <InvoiceDetails />
        </Box>
      )}

      {invoices.length <= 0 && (
        <Typography
          variant="h5"
          sx={{
            mt: 10,
            width: "100%",
            textAlign: "center",
          }}
        >
          No invoices to display yet...
        </Typography>
      )}
    </>
  );
}


