import { TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { FinalizedInvoiceDto } from "../../app/models/invoice/invoice.types";
import { formatInvoiceTotal } from "../../app/helper/invoiceTotalsAndFormat";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { getConsigneeInvoiceItemsThunk } from "./getFinalizedInvoiceItemsThunk";
import { getShippingLineAndPartnerInvoiceItemsThunk } from "./shippingLineInvoices/getShippingLineAndPartnerInvoiceItemsThunk";

interface Props {
  invoice: FinalizedInvoiceDto;
  index: number;
}

const Invoice: React.FC<Props> = ({ invoice, index }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.consigneeInvoiceItems);
  const { status: shippingLineInvoiceItemsStatus } = useAppSelector(
    (state) => state.shippingLineInvoiceItems
  );

  const handleInspectClick = () => {
    dispatch(getConsigneeInvoiceItemsThunk(invoice.invoiceGkey.toString()));
  };

  const handlePartnerClick = () => {
    dispatch(
      getShippingLineAndPartnerInvoiceItemsThunk(invoice.invoiceGkey.toString())
    );
  };

  const isLoading = status === "pending" + invoice.invoiceGkey;
  const isFetchingSlPartnerInvoice =
    shippingLineInvoiceItemsStatus === "pending" + invoice.invoiceGkey;

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
        {new Date(invoice.finalizedDate).toLocaleDateString("en-CA")}
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>{invoice.creator}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.changer}</TableCell>
      {invoice.invoiceType.charAt(0).toUpperCase() === "C" && (
        <TableCell sx={tableBodyTableCellStyles}>
          {invoice.paid ? "True" : "False"}
        </TableCell>
      )}

      {invoice.invoiceType.charAt(0).toUpperCase() === "S" && (
        <TableCell sx={tableBodyTableCellStyles}>
          {invoice.invoiceType.slice(0, 3)}
        </TableCell>
      )}

      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.notes ? invoice.notes.slice(0, 20) : "N/A"}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.customer.slice(0, 15)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{invoice.currency}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {formatInvoiceTotal(invoice.total)}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {invoice.invoiceType.charAt(0).toUpperCase() === "C" && (
          <LoadingButton
            loading={isLoading}
            onClick={handleInspectClick}
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
        )}

        {invoice.invoiceType.charAt(0).toUpperCase() === "S" && (
          <LoadingButton
            loading={isFetchingSlPartnerInvoice}
            onClick={handlePartnerClick}
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
            Partner
          </LoadingButton>
        )}
      </TableCell>
    </TableRow>
  );
};

export default Invoice;
