import { TableContainer, Table, TableBody, Paper } from "@mui/material";
import Invoice from "./Invoice";
import { IFinalizedInvoiceDto } from "../../app/models/invoice/finalizedinvoice";
import TableHeadComponent from "../../app/components/TableHeadComponent";

interface Props {
  invoices: IFinalizedInvoiceDto[];
}

const FinalInvoiceTable: React.FC<Props> = (props: Props) => {
  const { invoices } = props;
  return (
    <Paper
      sx={{
        bgcolor: "transparent",

        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          mt: 0,
          maxHeight: 420,
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 500,
            maxWidth: 750,
          }}
        >
          <TableHeadComponent
            tableCellHeadings={[
              "No",
              "Draft",
              "Final",
              "Date",
              "Customer",
              "Currency",
              "Action",
            ]}
          />

          <TableBody>
            {invoices.map((invoice, index) => (
              <Invoice invoice={invoice} index={index} key={invoice.id} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FinalInvoiceTable;
