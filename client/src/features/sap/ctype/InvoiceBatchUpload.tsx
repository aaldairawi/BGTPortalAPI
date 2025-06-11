import InvoicesList from "../InvoicesList";
import { Box, Typography } from "@mui/material";

import FilterInvoiceBatch from "../FilterInvoiceBatch";
import { InvoiceDetails } from "../../../app/components/InvoiceDetails";

import {
  FinalizedInvoiceDto,
  InvoiceParams,
  InvoicesLoadedDetails as InvoicesLoadedDetailsModel,
} from "../../../app/models/invoice/invoice.types";
import InvoiceUploadActions from "../../../app/components/InvoiceUploadActions";

type Props = {
  invoicesToDisplay: FinalizedInvoiceDto[];
  invoicesLoaded: boolean;
  invoiceTypeToPass: "C" | "S";
  invoiceLoadedDetails: InvoicesLoadedDetailsModel | null;
  invoiceParams: InvoiceParams;
  invoicesToUpload: FinalizedInvoiceDto[];
  invoiceStatus: boolean;
  invoiceUploadingStatus?: boolean;
};
export default function InvoiceBatchUpload({
  invoicesToDisplay,
  invoicesLoaded,
  invoiceTypeToPass,
  invoiceLoadedDetails,
  invoiceParams,
  invoiceStatus,
  invoiceUploadingStatus,
  invoicesToUpload,
}: Props) {
  
  
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          width: "10rem",
        }}
      >
        <FilterInvoiceBatch
          invoiceTypeToPass={invoiceTypeToPass}
          invoicesLoading={invoiceStatus}
        />
      </Box>

      {invoicesLoaded && invoicesToDisplay.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "90rem",
            ml: "auto",
            mr: "auto",
            
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "space-evenly",
              alignSelf: "center",
              
            }}
          >
            <InvoiceDetails
              invoiceLoadedDetails={invoiceLoadedDetails}
              invoiceParams={invoiceParams}
            />            
              <InvoiceUploadActions

                invoicesUploadingStatus={invoiceUploadingStatus}
                invoiceParams={invoiceParams}
                invoicesToUpload={invoicesToUpload}
              />
          </Box>
          <InvoicesList invoices={invoicesToDisplay} />
        </Box>
      )}

      {invoicesLoaded && invoicesToDisplay.length === 0 && (
        <Typography
          variant="h5"
          sx={{
            mt: 10,
            width: "100%",
            textAlign: "center",
          }}
        >
          No invoices to display yet...
        </Typography>
      )}
    </>
  );
}
