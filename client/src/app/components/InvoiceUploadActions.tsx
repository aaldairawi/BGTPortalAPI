import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../store/configureStore";
import {
  invoicesSelector,
  resetInvoicesLoaded,
} from "../../features/sap/finalizedInvoicesSlice";
import { uploadInvoicesToSap } from "../../features/sap/uploadInvoicesToSapThunk";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { resetUploadState } from "../../features/sap/uploadInvoicesSlice";

export default function InvoiceUploadActions() {
  const [uploadToProduction, setUploadToProduction] = useState(false);
  const invoices = useAppSelector(invoicesSelector.selectAll);
  const { invoiceParams } = useAppSelector((state) => state.finalizedInvoices);
  const { status, invoicesUploadedSuccessfully, uploadFailed } = useAppSelector(
    (state) => state.uploadInvoices
  );
  const invoiceFinalNumbers: string[] = invoices.map(
    (element) => element.final
  );
  const dispatch = useAppDispatch();
  const hasTriedUpload = useRef(false);

  useEffect(() => {
    if (!hasTriedUpload.current) return;

    if (invoicesUploadedSuccessfully) {
      toast.success("Invoices uploaded successfully", { autoClose: 600 });
      dispatch(resetUploadState());
    } else if (uploadFailed) {
      toast.error("Invoice upload failed");
      dispatch(resetUploadState());
    }
  }, [invoicesUploadedSuccessfully, uploadFailed, dispatch]);

  const handleUploadClick = async () => {
    hasTriedUpload.current = true;

    const result = await dispatch(
      uploadInvoicesToSap({
        invoices: invoiceFinalNumbers,
        uploadToProduction,
        invoiceType: invoiceParams.invoiceType,
      })
    );
    if (uploadInvoicesToSap.fulfilled.match(result)) {
      dispatch(resetInvoicesLoaded());
    }
  };

  return (
    <Box
      sx={{
        gap: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              disabled={status === "pendingUploadInvoices"}
              checked={uploadToProduction}
              onChange={(e) => setUploadToProduction(e.target.checked)}
            />
          }
          label="Upload To Production"
        />
      </FormGroup>

      <LoadingButton
        disabled={status === "pendingUploadInvoices"}
        loading={status === "pendingUploadInvoices"}
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleUploadClick}
      >
        Upload
      </LoadingButton>
    </Box>
  );
}
