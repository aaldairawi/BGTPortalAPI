import { Box, Typography } from "@mui/material";
import { FilterUploadedInvoices } from "./FilterUploadedInvoices";
import UploadedInvoicesList from "./UploadedInvoicesList";
import { useAppSelector } from "../../../app/store/configureStore";
import { UploadedInvoicesSummary } from "./UploadedInvoicesSummary";

export function UploadedInvoices() {
  const { invoices, invoicesLoaded } = useAppSelector(
    (state) => state.uploadedInvoicesDashboard
  );

  const loadedAndHasResults = invoicesLoaded && invoices.length > 0;
  const loadedAndHasNoResults = invoicesLoaded && invoices.length <= 0;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
          gap: 2,
          px: 2,
        }}
      >
        <Box sx={{ minWidth: "180px", flexShrink: 0 }}>
          <FilterUploadedInvoices />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            flexBasis: 0, // allow it to stretch
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {loadedAndHasResults && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,

                  width: "100%",
                }}
              >
                <Box sx={{ width: "65rem" }}>
                  <UploadedInvoicesList uploadedInvoices={invoices} />
                </Box>
                <Box sx={{ alignSelf: "flex-start" }}>
                  <UploadedInvoicesSummary invoices={invoices} />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {loadedAndHasNoResults && (
        <Typography
          variant="h5"
          sx={{
            mt: 10,
            ml: 4,
            width: "100%",
            textAlign: "center",
          }}
        >
          No uploaded invoices found for the selected data...
        </Typography>
      )}

      {!invoicesLoaded && (
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
