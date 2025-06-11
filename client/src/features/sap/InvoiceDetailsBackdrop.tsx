import {
  TableContainer,
  Table,
  TableBody,
  Box,
  Typography,
  Backdrop,
  Paper,
} from "@mui/material";
import TableHeadComponent from "../../app/components/TableHeadComponent";

import {
  InvoiceItemDto,
  InvoiceItemUnion,
  SLInvoiceItemDto,
} from "../../app/models/invoice/invoice.types";

import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../app/store/configureStore";
import { onHandleHideInvoiceItemBackdrop } from "./finalizedInvoiceItemsSlice";
import InvoiceItem from "./InvoiceItem";
import SLInvoiceItem from "./SLInvoiceItem";

const CTypeInvoiceHeaders = [
  "No",
  "Description",
  "Quantity",
  "Billed",
  "Rate",
  "Total",
  "GLCode",
  "Unit",
  "CUE",
];

const STypeInvoiceHeaders = [
  "No",
  "Description",
  "Tariff",
  "Qty",
  "Rate",
  "Rate Billed",
  "Total",
  "Final",
  "Notes",
];

interface Props {
  invoiceItems: InvoiceItemUnion[];
}
const InvoiceDetailsBackdrop: React.FC<Props> = (props: Props) => {
  const { invoiceItems } = props;

  const dispatch = useAppDispatch();
  const isCTypeItem = (item: InvoiceItemUnion): item is InvoiceItemDto =>
    "invoiceItemGkey" in item;
  const isSTypeItem = (item: InvoiceItemUnion): item is SLInvoiceItemDto =>
    "tariffId" in item;
  const parsedDate = Date.parse(invoiceItems[0].finalizedDate);
  const date = new Date(parsedDate).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  if (invoiceItems.length === 0) return;
  return (
    <>
      <Backdrop
        open={true}
        invisible={false}
        sx={{
          bgcolor: "rgba(0,0,0,0.5)",
          zIndex: 300,
          width: "100%",
          height: "100%",
        }}
      >
        <Paper
          sx={{
            width: "70rem",
            height: "35rem",
            display: "flex",
            flexDirection: "column",
            border: "1px solid white",
            position: "relative",
          }}
          elevation={5}
        >
          {/* Top Info Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              borderBottom: "1px solid lightgray",
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              Invoice Inspector
            </Typography>

            <Box sx={{ display: "flex", gap: 3 }}>
              <Typography variant="subtitle2">Finalized: {date}</Typography>
              <Typography variant="subtitle2">
                Total Items: {invoiceItems.length}
              </Typography>
              <Typography variant="subtitle2">
                Total Sum:{" "}
                {invoiceItems
                  .reduce(
                    (previous, current) => previous + current.itemTotalAmount,
                    0
                  )
                  .toLocaleString()}
              </Typography>
              <Typography variant="subtitle2">
                Final: {invoiceItems[0].invoiceFinalNumber}
              </Typography>
            </Box>

            <CloseIcon
              onClick={() => dispatch(onHandleHideInvoiceItemBackdrop())}
              sx={{
                fontSize: "1.7rem",
                color: "black",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
              }}
            />
          </Box>

          {/* Scrollable Table */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
            <TableContainer>
              <Table stickyHeader>
                <TableHeadComponent
                  tableCellHeadings={
                    invoiceItems.length > 0 && isCTypeItem(invoiceItems[0])
                      ? CTypeInvoiceHeaders
                      : STypeInvoiceHeaders
                  }
                />
                <TableBody>
                  {invoiceItems.map((item, index) => {
                    if (isCTypeItem(item)) {
                      return (
                        <InvoiceItem
                          key={index}
                          invoiceItem={item}
                          index={index}
                        />
                      );
                    }

                    if (isSTypeItem(item)) {
                      return (
                        <SLInvoiceItem
                          key={index}
                          invoiceItem={item}
                          index={index}
                        />
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>
      </Backdrop>
    </>
  );
};

export default InvoiceDetailsBackdrop;
