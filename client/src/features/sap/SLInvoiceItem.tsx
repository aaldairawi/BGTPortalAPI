import React from "react";
import { TableCell, TableRow } from "@mui/material";
import {  SLInvoiceItemDto } from "../../app/models/invoice/invoice.types";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";

interface Props {
  invoiceItem: SLInvoiceItemDto;
  index: number;
}

const SLInvoiceItem: React.FC<Props> = ({ invoiceItem, index }) => {
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
        {invoiceItem.description.slice(0, 30)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.tariffId}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.quantity}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoiceItem.rate}</TableCell>

      <TableCell sx={tableBodyTableCellStyles}> 
        {invoiceItem.rateBilled}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>{invoiceItem.itemTotalAmount}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.invoiceFinalNumber}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.notes}
      </TableCell>
    </TableRow>
  );
};

export default SLInvoiceItem;
