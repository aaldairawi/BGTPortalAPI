import { TableCell, TableRow } from "@mui/material";

import { InvoiceHeaderDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";
import { formatInvoiceTotal } from "../../../app/helper/invoiceTotalsAndFormat";
import { tableBodyTableCellStyles } from "../../admin/tableCssStyles";
import { dateTimeToStringFormatted } from "../../../app/helper/dateOptions";

interface Props {
  invoice: InvoiceHeaderDto;
  index: number;
}

const UploadedInvoice: React.FC<Props> = ({ invoice, index }) => {
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
        {invoice.finalizedDate}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {dateTimeToStringFormatted(invoice.uploadedDate)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.uploadedByName}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.currency}</TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.invoiceType.replace("_", "")}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.profitCenter}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {formatInvoiceTotal(invoice.invoiceTotal)}
      </TableCell>
    </TableRow>
  );
};

export default UploadedInvoice;
