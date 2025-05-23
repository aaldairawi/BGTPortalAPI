import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { invoicesSelector } from "./finalizedInvoicesSlice";

import InvoicesList from "./InvoicesList";
import { Box, TextField, Typography, Button } from "@mui/material";
import { getOneFinalizedInvoiceByFinalIdAsync } from "./getOneFinalizedInvoiceThunk";

import { InvoicesLoadedDetails } from "../../app/components/InvoicesLoadedDetails";
import React, { useState } from "react";

export default function InvoiceSingleUpload() {
  const [invoiceFinalNumber, setInvoiceFinalNumber] = useState("");
  const dispatch = useAppDispatch();

  const { invoicesLoaded } = useAppSelector((state) => state.finalizedInvoices);

  const invoices = useAppSelector((state) => invoicesSelector.selectAll(state));

  const onHandleChangeInvoiceNumber = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInvoiceFinalNumber(event.target.value);
  };
  const isInputValid =
    invoiceFinalNumber.length <= 5 || invoiceFinalNumber.length > 6;
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
          label="Final"
          variant="outlined"
          onChange={onHandleChangeInvoiceNumber}
          value={invoiceFinalNumber}
        />
        <Button
          variant="contained"
          disabled={isInputValid}
          onClick={() =>
            dispatch(getOneFinalizedInvoiceByFinalIdAsync(invoiceFinalNumber))
          }
        >
          Search
        </Button>
      </Box>

      {invoicesLoaded && invoices.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <InvoicesList invoices={invoices} invoicesLoaded={invoicesLoaded} />
          <InvoicesLoadedDetails />
        </Box>
      )}

      {invoices.length <= 0 && (
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
