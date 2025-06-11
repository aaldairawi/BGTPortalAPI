import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import LoadingComponent from "../../../app/components/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";

import { getSingleInvoiceThunk } from "../getSingleInvoiceThunk";

import InvoicesList from "../InvoicesList";

import { resetSingleInvoiceLoaded } from "../singleInvoiceSlice";


export default function ShippingLineUpload() {
  const [invoiceFinalNumber, setInvoiceFinalNumber] = useState("");
  const dispatch = useAppDispatch();

  const { invoiceLoaded, singleInvoiceResult, status } = useAppSelector(
    (state) => state.singleInvoice
  );

  const onHandleChangeInvoiceNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInvoiceFinalNumber(event.target.value);
  };

  if (status === "pendingSearchSingleInvoiceThunk")
    return <LoadingComponent message="Loading Invoice" />;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          pb: 1,
        }}
      >
        <TextField
          label="SL Invoice"
          variant="outlined"
          onChange={onHandleChangeInvoiceNumber}
          value={invoiceFinalNumber}
        />
        <Button
          variant="contained"
          disabled={invoiceFinalNumber.length <= 0}
          onClick={() => dispatch(getSingleInvoiceThunk(invoiceFinalNumber))}
        >
          Search
        </Button>
        {singleInvoiceResult && (
          <Button
            variant="contained"
            onClick={() => dispatch(resetSingleInvoiceLoaded())}
          >
            Reset
          </Button>
        )}
      </Box>
      {!singleInvoiceResult && (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          No Invoice Loaded Yet...
        </Typography>
      )}
      {invoiceLoaded && singleInvoiceResult && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            mt: 2,
          }}
        >
          <InvoicesList invoices={[singleInvoiceResult]} />
        </Box>
      )}
    </>
  );
}
