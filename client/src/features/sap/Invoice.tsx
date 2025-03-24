import { Button, TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { IFinalizedInvoiceDto } from "../../app/models/invoice/finalizedinvoice";
import { useAppDispatch } from "../../app/store/configureStore";
import { getInvoiceItemsAsync } from "./cTypeInvoiceItemSlice";

interface Props {
  invoice: IFinalizedInvoiceDto;
  index: number;
}

const Invoice: React.FC<Props> = (props: Props) => {
  const { invoice, index } = props;

  const dispatch = useAppDispatch();

  return (
    <TableRow
      sx={{
        border: "none",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "grey.800",
        },
      }}
    >
      <TableCell sx={tableBodyTableCellStyles}>{index + 1}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.draft}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.final}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.finalizedDate}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.customer}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.currency}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <Button
          onClick={() =>
            dispatch(getInvoiceItemsAsync(invoice.invoiceGkey.toString()))
          }
          variant="contained"
          sx={{ fontSize: "10px" }}
          color="success"
        >
          Inspect
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default Invoice;
