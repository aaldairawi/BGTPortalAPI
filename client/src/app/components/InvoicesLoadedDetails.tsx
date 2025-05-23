import { Box, Button, Typography } from "@mui/material";

import { formatInvoiceTotal } from "../helper/invoice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { resetInvoicesLoaded } from "../../features/sap/finalizedInvoicesSlice";
import InvoiceUploadActions from "./InvoiceUploadActions";

const removeInvoiceTypeUnderScore = (invoiceType: string) => {
  return invoiceType.includes("_") ? invoiceType.replace("_", "") : invoiceType;
};
export function InvoicesLoadedDetails() {
  const dispatch = useAppDispatch();
  const { invoicesLoadedDetails } = useAppSelector(
    (state) => state.finalizedInvoices
  );
  const { status } = useAppSelector((state) => state.uploadInvoices);

  if (!invoicesLoadedDetails) return;
  return (
    <Box
      sx={{
        alignSelf: "flex-start",
        gap: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          borderRadius: "5px",
          gap: 2,
          p: 1,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="subtitle1">
          {removeInvoiceTypeUnderScore(
            invoicesLoadedDetails.invoicesLoadedType
          )}{" "}
          Type Loaded
        </Typography>
        <Typography variant="subtitle1">
          {invoicesLoadedDetails.invoicesLoadedLength}{" "}
          {invoicesLoadedDetails.invoicesLoadedLength > 1
            ? "Invoices Loaded"
            : "Invoice Loaded"}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Total:{" "}
          {formatInvoiceTotal(
            parseFloat(invoicesLoadedDetails.invoicesLoadedTotalAmount)
          )}
        </Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          disabled={status === "pendingUploadInvoices"}
          variant="contained"
          fullWidth
          onClick={() => dispatch(resetInvoicesLoaded())}
        >
          Reset
        </Button>
      </Box>

      <InvoiceUploadActions />
    </Box>
  );
}
