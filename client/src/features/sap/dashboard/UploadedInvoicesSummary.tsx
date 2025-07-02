import { Box, Paper, Typography } from "@mui/material";
import { InvoiceHeaderDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";
import { green } from "@mui/material/colors";

interface Props {
  invoices: InvoiceHeaderDto[];
}

export function UploadedInvoicesSummary({ invoices }: Props) {
  const pluralInvoicesLength =
    invoices.length > 1 ? "invoices uploaded" : "invoice uploaded";

  const invoiceUploadedDate = invoices[0].uploadedDate;

  const consigneeInvoices = invoices.filter((element) =>
    element.invoiceType.startsWith("C")
  );

  const shippinglineInvoices = invoices.filter((element) =>
    element.invoiceType.startsWith("S")
  );

  const formatAmount = (amount: number) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDateOnly = (dateStr: string) => {
    return new Date(dateStr).toISOString().split("T")[0]; // yyyy-mm-dd
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      <Typography variant="subtitle1">
        {invoices.length} {pluralInvoicesLength} on{" "}
        {formatDateOnly(invoiceUploadedDate)}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            bgcolor: green[100],
            width: 200,
            height: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Consignee Revenue
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            IQD{" "}
            {formatAmount(
              consigneeInvoices.reduce(
                (prev, curr) => prev + curr.invoiceTotal,
                0
              )
            )}
          </Typography>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            bgcolor: green[200],
            width: 200,
            height: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Shipping Line Revenue
          </Typography>
          <Typography variant="subtitle2" fontWeight={600}>
            ${" "}
            {formatAmount(
              shippinglineInvoices.reduce(
                (prev, curr) => prev + curr.invoiceTotal,
                0
              )
            )}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
