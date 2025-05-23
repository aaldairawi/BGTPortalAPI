import { useAppSelector } from "../../app/store/configureStore";
import { invoicesSelector } from "./finalizedInvoicesSlice";

import InvoicesList from "./InvoicesList";
import { Box, Typography } from "@mui/material";

import FilterInvoiceBatch from "./FilterInvoiceBatch";
import { InvoicesLoadedDetails } from "../../app/components/InvoicesLoadedDetails";

export default function InvoiceBatchUpload() {
  const { invoicesLoaded } = useAppSelector((state) => state.finalizedInvoices);

  const invoices = useAppSelector((state) => invoicesSelector.selectAll(state));

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
        <FilterInvoiceBatch />
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
          <InvoicesList invoices={invoices} invoicesLoaded={invoicesLoaded} />
          <InvoicesLoadedDetails />
          
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
