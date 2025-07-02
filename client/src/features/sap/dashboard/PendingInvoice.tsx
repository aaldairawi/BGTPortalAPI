import { TableCell, TableRow } from "@mui/material";

import { InvoicePendingUploadDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";
import { formatInvoiceTotal } from "../../../app/helper/invoiceTotalsAndFormat";
import { tableBodyTableCellStyles } from "../../admin/tableCssStyles";
import { dateTimeToStringFormatted } from "../../../app/helper/dateOptions";

interface Props {
  invoice: InvoicePendingUploadDto;
  index: number;
}

export function PendingInvoice({ invoice, index }: Props) {
  return (
    <TableRow
      sx={{
        border: "none",
        "&:hover": { bgcolor: "lightgray" },
      }}
    >
      <TableCell sx={{ fontWeight: "bold", ...tableBodyTableCellStyles }}>
        {index + 1}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.finalInvoiceNumber}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {dateTimeToStringFormatted(invoice.finalizedDate)}
      </TableCell>
      
      
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.currency}
      </TableCell>


      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.invoiceType.replace("_", "")}
      </TableCell>
      
      <TableCell sx={tableBodyTableCellStyles}>{invoice.customer}</TableCell>


      <TableCell sx={tableBodyTableCellStyles}>
        {formatInvoiceTotal(invoice.invoiceTotal)}
      </TableCell>
    </TableRow>
  );
}
