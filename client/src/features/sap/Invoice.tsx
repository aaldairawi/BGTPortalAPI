import { TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import { formatInvoiceTotal } from "../../app/helper/invoice";
import { getFinalizedInvoiceItemsThunk } from "./getFinalizedInvoiceItemsThunk";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";

interface Props {
  invoice: FinalizedInvoiceDto;
  index: number;
}

const Invoice: React.FC<Props> = (props: Props) => {
  const { invoice, index } = props;

  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.invoiceItems);

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

      <TableCell sx={tableBodyTableCellStyles}>{invoice.status}</TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.finalizedDate}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>{invoice.creator}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.changer}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.paid ? "True" : "False"}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.notes ? invoice.notes.slice(0, 20) : "N/A"}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.customer.slice(0, 15)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.currency}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {formatInvoiceTotal(parseFloat(invoice.total))}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <LoadingButton
          loading={status === "pending" + invoice.invoiceGkey}
          onClick={() =>
            dispatch(
              getFinalizedInvoiceItemsThunk({
                invoiceGkey: invoice.invoiceGkey.toString(),
                invoiceType: invoice.invoiceType,
              })
            )
          }
          variant="contained"
          size="small"
          sx={{
            ...tableBodyTableCellStyles,
            "& .MuiCircularProgress-root": {
              animationDuration: "0.5s",
            },
            color: "white",
          }}
        >
          Inspect
        </LoadingButton>
      </TableCell>
    </TableRow>
  );
};

export default Invoice;
