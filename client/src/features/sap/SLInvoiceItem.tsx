import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { SLInvoiceItemDto } from "../../app/models/invoice/invoice.types";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { formatInvoiceTotal } from "../../app/helper/invoiceTotalsAndFormat";

interface Props {
  invoiceItem: SLInvoiceItemDto;
  index: number;
}

const SLInvoiceItem: React.FC<Props> = ({ invoiceItem, index }) => {
  const smallTextStyle = { fontSize: "0.60rem" };

  return (
    <TableRow
      sx={{
        border: "none",
        "&:hover": { bgcolor: "lightgray" },
      }}
    >
      <TableCell
        sx={{
          fontWeight: "bold",
          ...tableBodyTableCellStyles,
          ...smallTextStyle,
        }}
      >
        {index + 1}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {invoiceItem.description.slice(0, 30)}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {invoiceItem.tariffId}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {invoiceItem.quantity}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {formatInvoiceTotal(invoiceItem.rate)}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {formatInvoiceTotal(invoiceItem.rateBilled)}
      </TableCell>
      <TableCell sx={{ ...tableBodyTableCellStyles, ...smallTextStyle }}>
        {formatInvoiceTotal(invoiceItem.itemTotalAmount)}
      </TableCell>
    </TableRow>
  );
};

export default SLInvoiceItem;
