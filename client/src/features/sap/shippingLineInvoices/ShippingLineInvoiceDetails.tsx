import {
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableBody,
  Divider,
  Modal,
  Select,
  FormControl,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TableHeadComponent from "../../../app/components/TableHeadComponent";
import {
  SLParentAndPartnerInvoiceItemsDto,
  SLInvoiceItemDto,
} from "../../../app/models/invoice/invoice.types";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import SLInvoiceItem from "../SLInvoiceItem";
import { closeItemsDisplay } from "./shippingLineInvoiceItemsSlice";
import { LoadingButton } from "@mui/lab";
import {
  uploadSL2InvoiceToPreviewCSVThunk,
  uploadSL4InvoiceToPreviewCSVThunk,
} from "./uploadShippingLineInvoicesThunk";
import {
  resetShippingLineCsvState,
  setSL2CsvReady,
} from "./shippingLineInvoicesCsvSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const STypeInvoiceHeaders = [
  "No",
  "Description",
  "Tariff",
  "Qty",
  "Rate",
  "Billed",
  "Total",
];

interface Props {
  invoiceItems: SLParentAndPartnerInvoiceItemsDto;
}

const ShippingLineInvoiceDetails: React.FC<Props> = ({ invoiceItems }) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => state.uploadSlToPreview);
  const [selectedBerth, setSelectedBerth] = useState("B27");

  const csvReadiness = useAppSelector(
    (state) => state.shippingLineInvoiceCsv.csvReadiness
  );

  const parentFinalNumber =
    invoiceItems.parentInvoiceItems[0]?.invoiceFinalNumber;

  const isSl4PreviewReady =
    parentFinalNumber && csvReadiness[parentFinalNumber]?.sl2Ready;

  const isSl4UploadToProductionReady =
    parentFinalNumber && csvReadiness[parentFinalNumber]?.sl4Ready;

  const calculateSummary = (items: SLInvoiceItemDto[]) => {
    const total = items.reduce((sum, item) => sum + item.itemTotalAmount, 0);
    return {
      totalItems: items.length,
      totalAmount: total,
    };
  };

  const onHandleSelectedBerth = (event: SelectChangeEvent<string>) => {
    setSelectedBerth(event.target.value);
  };

  const renderTable = (
    title: string,
    items: SLInvoiceItemDto[],
    finalNbr: string,
    notes: string
  ) => {
    const summary = calculateSummary(items);

    return (
      <Box
        sx={{
          flex: 1,
          px: 2,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            justifyContent: "flex-start",
          }}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
            {title}
          </Typography>

          <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
            <strong>Final:</strong> {finalNbr}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
            <strong>Notes:</strong> {notes || "N/A"}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          {title.includes("Parent") && (
            <FormControl size="small">
              <Select
                value={selectedBerth}
                onChange={onHandleSelectedBerth}
                sx={{ fontSize: "12px", width: 90 }}
              >
                <MenuItem value="B27">B27</MenuItem>
                <MenuItem value="B20">B20</MenuItem>
              </Select>
            </FormControl>
          )}

          {title.includes("Parent") && (
            <>
              <LoadingButton
                sx={{ fontSize: "10px" }}
                loading={status === "pendingSl2Preview"}
                variant="contained"
                onClick={async () => {
                  const resultAction = await dispatch(
                    uploadSL2InvoiceToPreviewCSVThunk({
                      invoiceNumber:
                        invoiceItems.parentInvoiceItems[0].invoiceFinalNumber,
                      invoiceType: "SL2",
                      berth: selectedBerth,
                    })
                  );

                  if (
                    uploadSL2InvoiceToPreviewCSVThunk.fulfilled.match(
                      resultAction
                    )
                  ) {
                    dispatch(
                      setSL2CsvReady({
                        invoiceFinalNumber:
                          invoiceItems.parentInvoiceItems[0].invoiceFinalNumber,
                        ready: true,
                      })
                    );
                    toast.success("SL2 Preview generated successfully!", {
                      autoClose: 3000,
                    });
                  }
                }}
              >
                Preview CSV SL2
              </LoadingButton>

              <LoadingButton sx={{ fontSize: "10px" }} variant="contained">
                Upload CSV SL2
              </LoadingButton>
            </>
          )}

          {title.includes("Partner") && (
            <>
              <LoadingButton
                sx={{ fontSize: "10px" }}
                variant="contained"
                loading={status === "pendingSl4Preview"}
                disabled={!isSl4PreviewReady}
                onClick={async () => {
                  const resultAction = await dispatch(
                    uploadSL4InvoiceToPreviewCSVThunk({
                      berth: selectedBerth,
                      parentInvoiceNumber:
                        invoiceItems.parentInvoiceItems[0].invoiceFinalNumber,
                      partnerInvoiceNumber:
                        invoiceItems.partnerInvoiceItems[0].invoiceFinalNumber,
                      invoiceType: "SL4",
                    })
                  );

                  if (
                    uploadSL4InvoiceToPreviewCSVThunk.fulfilled.match(
                      resultAction
                    )
                  ) {
                    toast.success("SL4 Preview generated successfully!", {
                      autoClose: 3000,
                    });
                  }
                  setSelectedBerth("B27");
                }}
              >
                Preview CSV SL4
              </LoadingButton>

              <LoadingButton
                sx={{ fontSize: "10px" }}
                variant="contained"
                disabled={!isSl4UploadToProductionReady}
              >
                Upload CSV SL4
              </LoadingButton>
            </>
          )}
        </Box>

        <TableContainer sx={{ flex: 1, overflowY: "auto", mt: 1 }}>
          <Table stickyHeader size="small">
            <TableHeadComponent tableCellHeadings={STypeInvoiceHeaders} />
            <TableBody>
              {items.map((item, index) => (
                <SLInvoiceItem key={index} invoiceItem={item} index={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 1,
            p: 1,
            bgcolor: "#f9f9f9",
            borderTop: "1px solid #ddd",
          }}
        >
          <Typography variant="body2">
            <strong>Total Items:</strong> {summary.totalItems}
          </Typography>
          <Typography variant="body2">
            <strong>Total Amount:</strong>{" "}
            {summary.totalAmount.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Modal
      open={true}
      onClose={() => {
        dispatch(closeItemsDisplay());
        dispatch(resetShippingLineCsvState());
      }}
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(0,0,0,0.5)" },
        },
      }}
    >
      <Paper
        sx={{
          width: "92rem",
          height: "38rem",
          m: "5rem auto",
          display: "flex",
          flexDirection: "column",
          border: "1px solid white",
          position: "relative",
          outline: "none",
        }}
        elevation={5}
      >
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
            Shipping Line Invoice Inspector
          </Typography>
          <CloseIcon
            onClick={() => {
              dispatch(closeItemsDisplay());
              dispatch(resetShippingLineCsvState());
            }}
            sx={{
              fontSize: "1.7rem",
              color: "black",
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
            }}
          />
        </Box>

        <Box
          sx={{ display: "flex", flex: 1, overflow: "hidden", p: 2, gap: 2 }}
        >
          {renderTable(
            "Parent SL2",
            invoiceItems.parentInvoiceItems,
            invoiceItems.parentInvoiceItems[0]?.invoiceFinalNumber || "",
            invoiceItems.parentInvoiceItems[0]?.notes || ""
          )}

          <Divider orientation="vertical" flexItem />

          {renderTable(
            "Partner SL4",
            invoiceItems.partnerInvoiceItems,
            invoiceItems.partnerInvoiceItems[0]?.invoiceFinalNumber || "",
            invoiceItems.partnerInvoiceItems[0]?.notes || ""
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default ShippingLineInvoiceDetails;
