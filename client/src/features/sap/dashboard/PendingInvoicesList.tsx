import { TableContainer, Table, TableBody, Paper } from "@mui/material";

import { InvoicePendingUploadDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";

import TableHeadComponent from "../../../app/components/TableHeadComponent";
import { PendingInvoice } from "./PendingInvoice";

interface Props {
  pendingInvoices: InvoicePendingUploadDto[];
}

export function PendingInvoicesList({ pendingInvoices }: Props) {
  if (pendingInvoices.length <= 0) return;

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 0,
        maxHeight: 425,
        width: "100%",
        overflowY: "auto",
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800,
          width: "100%",
        }}
      >
        <TableHeadComponent
          tableCellHeadings={[
            "No",
            "Final",
            "Finalized",
            "Currency",
            "Type",
            "Customer",
            "Total",
          ]}
        />
        <TableBody>
          {pendingInvoices.map((invoice, index) => (
            <PendingInvoice
              key={invoice.finalInvoiceNumber}
              invoice={invoice}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
