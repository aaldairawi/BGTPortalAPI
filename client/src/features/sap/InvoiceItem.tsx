import React from "react";
import { TableCell, TableRow } from "@mui/material";
import { ConsigneeInvoiceItemDto } from "../../app/models/invoice/invoice.types";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";

interface Props {
  invoiceItem: ConsigneeInvoiceItemDto;
  index: number;
}

const InvoiceItem: React.FC<Props> = ({ invoiceItem, index }) => {
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
        {invoiceItem.quantity}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.quantityBilled}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoiceItem.rate}</TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.itemTotalAmount}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>{invoiceItem.glCode}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.containerId}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoiceItem.eventTypeId.slice(0, 20)}
      </TableCell>
    </TableRow>
  );
};

export default InvoiceItem;
