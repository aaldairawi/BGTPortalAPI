import { Box, Typography } from "@mui/material";



import {
  InvoiceParams,
  InvoicesLoadedDetails as InvoicesLoadedDetailsType,
} from "../models/invoice/invoice.types";

type Props = {
  invoiceLoadedDetails: InvoicesLoadedDetailsType | null;
  invoiceParams: InvoiceParams;
};

export function InvoiceDetails({ invoiceLoadedDetails }: Props) {
  if (!invoiceLoadedDetails) return null;

  return (
    <Box
      sx={{
        gap: 4,
        display: "flex",
        alignItems: "center",
        width: "30rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          gap: 3,
          p: 1,
          width: "100%",
          bgcolor: "white",
          color: "grey",
        }}
      >
        <Typography variant="subtitle1">
          {invoiceLoadedDetails.invoicesLoadedLength}{" "}
          {invoiceLoadedDetails.invoicesLoadedLength > 1
            ? "Invoices"
            : "Invoice"}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Total: {invoiceLoadedDetails.invoicesLoadedTotalAmount}
        </Typography>
      </Box>
    </Box>
  );
}
