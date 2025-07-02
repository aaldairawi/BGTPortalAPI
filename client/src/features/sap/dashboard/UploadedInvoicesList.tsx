import { TableContainer, Table, TableBody, Paper } from "@mui/material";


import { InvoiceHeaderDto } from "../../../app/models/invoicedashboard/invoicedashboard.types";

import UploadedInvoice from "./UploadedInvoice";
import TableHeadComponent from "../../../app/components/TableHeadComponent";

interface Props {
  uploadedInvoices: InvoiceHeaderDto[];
}

const UploadedInvoicesList: React.FC<Props> = (props: Props) => {
  const { uploadedInvoices } = props;

  if (uploadedInvoices.length <= 0) return;

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
            "Uploaded",
            "Uploaded By",
            "Currency",
            "Type",
            "Profit Center",
            "Total",
          ]}
        />
        <TableBody>
          {uploadedInvoices.map((invoice, index) => (
            <UploadedInvoice
              key={invoice.finalInvoiceNumber}
              invoice={invoice}
              index={index}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UploadedInvoicesList;
