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
import InvoiceItem from "./InvoiceItem";
import { IFinalizedInvoiceItemDto } from "../../app/models/invoice/finalizedinvoice";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch } from "../../app/store/configureStore";
import { onHandleHideInvoiceItemBackdrop } from "./cTypeInvoiceItemSlice";

const TableHeaderTitles = [
  "No",
  "Description",
  "Quantity",
  "QuantityBilled",
  "Total",
  "GLCode",
  "Customer",
  "Container",
  "CUE",
];

interface Props {
  invoiceItems: IFinalizedInvoiceItemDto[];
}
const InvoiceDetailsBackdrop: React.FC<Props> = (props: Props) => {
  const { invoiceItems } = props;

  const dispatch = useAppDispatch();

  return (
    <>
      <Backdrop
        open={true}
        invisible={false}
        sx={{
          bgcolor: "rgba(0,0,0,0.9)",
          zIndex: 300,
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 110,
            left: 210,
            ml: 0.5,
          }}
        >
          <Typography
            sx={{ color: "black", fontWeight: "bold" }}
            variant="subtitle2"
          >
            Invoice Inspector
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 110,
            left: 370,
            ml: 0.5,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Created: {invoiceItems[0].invoiceCreatedDate}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 135,
            left: 370,
            ml: 0.5,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Finalized: {invoiceItems[0].invoiceFinalizedDate}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 110,
            left: 530,
            ml: 0.5,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Total Items: {invoiceItems.length}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 135,
            left: 530,
            ml: 0.5,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Total Sum:{" "}
            {invoiceItems
              .reduce((previous, current) => previous + current.total, 0)
              .toLocaleString()}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 110,
            left: 690,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Draft {invoiceItems[0].invoiceDraftNumber}
          </Typography>
        </Box>
        <Box
          sx={{
            position: "absolute",
            top: 135,
            left: 690,
          }}
        >
          <Typography sx={{ color: "black" }} variant="subtitle2">
            Final {invoiceItems[0].invoiceFinalNumber}
          </Typography>
        </Box>

        <Box
          sx={{
            position: "absolute",
            top: 110,
            right: 220,
            ml: 0.5,
          }}
        >
          <CloseIcon
            onClick={() => dispatch(onHandleHideInvoiceItemBackdrop())}
            sx={{
              "&:hover": { bgcolor: "white" },
              fontSize: "1.7rem",
              color: "black",
              cursor: "pointer",
            }}
          />
        </Box>
        <Paper
          sx={{
            bgcolor: "#878787",
            width: "70rem",
            height: "30rem",
            pt: 0,
            overflow: "hidden",
            border: "1px solid white",
          }}
        >
          <TableContainer
            sx={{
              mt: 8,
              ml: 7,
              maxHeight: 420,
            }}
          >
            <Table
              stickyHeader
              sx={{
                minWidth: 650,
                maxWidth: 1000,
              }}
            >
              <TableHeadComponent tableCellHeadings={TableHeaderTitles} />

              <TableBody>
                {invoiceItems.map((invoiceItem, index) => (
                  <InvoiceItem
                    invoiceItem={invoiceItem}
                    index={index}
                    key={index}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Backdrop>
    </>
  );
};

export default InvoiceDetailsBackdrop;
