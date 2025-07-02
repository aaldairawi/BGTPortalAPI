import { Box, Button } from "@mui/material";
import { useAppDispatch } from "../store/configureStore";
import { uploadConsigneeInvoicesToPreviewCSVThunk } from "../../features/sap/consigneeInvoices/uploadConsigneeInvoicesThunk";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import {
  FinalizedInvoiceDto,
  InvoiceParams,
} from "../models/invoice/invoice.types";
import { resetCTypeInvoices } from "../../features/sap/consigneeInvoices/consigneeInvoiceSlice";
import { resetSTypeInvoices } from "../../features/sap/shippingLineInvoices/shippingLineInvoicesSlice";

type Props = {
  invoiceParams: InvoiceParams;
  invoicesToUpload: FinalizedInvoiceDto[];
  invoicesUploadingStatus?: boolean;
};

export default function InvoiceUploadActions({
  invoiceParams,
  invoicesToUpload,
  invoicesUploadingStatus,
}: Props) {
  const dispatch = useAppDispatch();

  const handlePreviewCSVClick = async () => {
    const invoiceFinalNumbers = invoicesToUpload.map((e) => e.final);

    const result = await dispatch(
      uploadConsigneeInvoicesToPreviewCSVThunk({
        invoices: invoiceFinalNumbers,
        invoiceType: invoiceParams.invoiceType,
      })
    );

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("CSV preview generated successfully!", { autoClose: 2000 });
      console.log("Result payload:", result.payload);
    } else {

      if ("error" in result) {
        console.error("Upload error:", result.error);
      }
    }
  };

  const handleReset = () => {
    if (invoiceParams.invoiceType.includes("C")) {
      dispatch(resetCTypeInvoices());
    }
    if (invoiceParams.invoiceType.includes("S")) {
      dispatch(resetSTypeInvoices());
    }
  };

  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40rem",
      }}
    >
      <LoadingButton loading={false} variant="contained" color="primary">
        Upload To SAP
      </LoadingButton>
      <LoadingButton
        disabled={invoicesUploadingStatus}
        loading={invoicesUploadingStatus}
        variant="contained"
        color="primary"
        onClick={handlePreviewCSVClick}
      >
        Preview CSV
      </LoadingButton>
      <Button variant="outlined" onClick={handleReset}>
        Reset
      </Button>
    </Box>
  );
}
