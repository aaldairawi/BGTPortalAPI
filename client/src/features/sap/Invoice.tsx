import { TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import { formatInvoiceTotal } from "../../app/helper/invoice";

interface Props {
  invoice: FinalizedInvoiceDto;
  index: number;
}

const Invoice: React.FC<Props> = (props: Props) => {
  const { invoice, index } = props;

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
      <TableCell sx={tableBodyTableCellStyles}>{invoice.final}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.finalizedDate}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.creator}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.paid}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.customer.slice(0, 15)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.currency}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {formatInvoiceTotal(parseFloat(invoice.total))}
      </TableCell>
    </TableRow>
  );
};

export default Invoice;
