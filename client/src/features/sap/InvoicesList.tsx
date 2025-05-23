import { TableContainer, Table, TableBody, Paper } from "@mui/material";
import Invoice from "./Invoice";
import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import TableHeadComponent from "../../app/components/TableHeadComponent";

interface Props {
  invoices: FinalizedInvoiceDto[];
  invoicesLoaded: boolean;
}

const InvoicesList: React.FC<Props> = (props: Props) => {
  const { invoices } = props;

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 0,
        maxHeight: 425,
        maxWidth: 1100,
        overflowY: "auto",
        
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800,
          maxWidth: 1000,
          width: "100%",
        }}
      >
        <TableHeadComponent
          tableCellHeadings={[
            "No",
            "Final",
            "Date",
            "Creator",
            "Paid",
            "Customer",
            "Currency",
            "Total",
          ]}
        />
        <TableBody>
          {invoices.map((invoice, index) => (
            <Invoice invoice={invoice} index={index} key={invoice.id} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoicesList;
