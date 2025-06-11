import { Box, Button } from "@mui/material";
import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";

import { uploadInovicesToPreviewCSVThunk } from "../../features/sap/uploadInovicesToPreviewCSVThunk";

import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { resetUploadState } from "../../features/sap/uploadInvoicesSlice";
import {
  FinalizedInvoiceDto,
  InvoiceParams,
} from "../models/invoice/invoice.types";
import { resetCTypeInvoices } from "../../features/sap/ctype/cTypeInvoiceSlice";
import { resetSTypeInvoices } from "../../features/sap/stype/sTypeInvoicSlice";

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
  const { invoicesUploadedSuccessfully } = useAppSelector(
    (state) => state.uploadInvoices
  );

  const invoiceFinalNumbers: string[] = invoicesToUpload.map(
    (element) => element.final
  );

  const dispatch = useAppDispatch();
  const hasTriedUpload = useRef(false);

  useEffect(() => {
    if (!hasTriedUpload.current) return;

    if (invoicesUploadedSuccessfully) {
      toast.success("Invoices uploaded successfully", { autoClose: 600 });
      dispatch(resetUploadState());
    }
    dispatch(resetUploadState());
  }, [invoicesUploadedSuccessfully, dispatch]);

  const handlePreviewCSVClick = async () => {
    hasTriedUpload.current = true;
    console.log(invoiceFinalNumbers);

    const result = await dispatch(
      uploadInovicesToPreviewCSVThunk({
        invoices: invoiceFinalNumbers,
        invoiceType: invoiceParams.invoiceType,
      })
    );
    if (uploadInovicesToPreviewCSVThunk.fulfilled.match(result)) {
      console.log("Upload complete");
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
      <LoadingButton
        disabled={false}
        loading={false}
        variant="contained"
        color="primary"
        onClick={() => console.log("Uploading to sap...")}
      >
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
