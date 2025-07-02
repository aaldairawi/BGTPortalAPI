import { Box, Button, Typography, Popover } from "@mui/material";
import { useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import dayjs from "dayjs";

import Calendar from "../../../app/components/Calendar";
import InvoicesList from "../InvoicesList";

import { getShippingLineInvoicesByFinalizedDateThunk } from "./getShippingLineInvoiceThunk";

import { resetSTypeInvoices } from "./shippingLineInvoicesSlice";
import { resetShippingLineCsvState } from "./shippingLineInvoicesCsvSlice";

export default function ShippingLineUpload() {
  const dispatch = useAppDispatch();
  const { status, invoicesLoaded, shippingLineInvoices } = useAppSelector(
    (state) => state.shippingLineInvoices
  );

  const today = dayjs();

  const [shippingLineFinalizedDate, setShippingLineFinalizedDate] = useState(
    today.format("YYYY-MM-DD")
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const invoicesLoading = status === "pending";
  const hasInvoices = invoicesLoaded && shippingLineInvoices.length > 0;
  const noInvoices = invoicesLoaded && shippingLineInvoices.length === 0;
  const open = Boolean(anchorEl && !invoicesLoading);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleApplyFilter = () => {
    if (shippingLineFinalizedDate) {
      dispatch(
        getShippingLineInvoicesByFinalizedDateThunk(shippingLineFinalizedDate)
      );
      handleClose();
    }
  };

  const handleReset = () => {
    dispatch(resetSTypeInvoices());
    dispatch(resetShippingLineCsvState());
    setShippingLineFinalizedDate("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          width: hasInvoices ? "30rem" : "15rem",
        }}
      >
        <LoadingButton
          fullWidth
          loading={invoicesLoading}
          onClick={handleClick}
          variant="contained"
        >
          Filter By Finalized Date
        </LoadingButton>

        {hasInvoices && (
          <Button
            fullWidth
            color="secondary"
            variant="contained"
            onClick={handleReset}
          >
            Reset
          </Button>
        )}
      </Box>

      {open && (
        <Popover
          anchorEl={anchorEl}
          onClose={handleClose}
          open={open}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "row",
              gap: 2,
              pb: 1,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              gap={2}
            >
              <Calendar
                value={
                  shippingLineFinalizedDate
                    ? dayjs(shippingLineFinalizedDate)
                    : dayjs()
                }
                onChange={(dateFinalized) => {
                  dispatch(resetSTypeInvoices());
                  setShippingLineFinalizedDate(
                    dateFinalized.format("YYYY-MM-DD")
                  );
                }}
              />

              <Button onClick={handleApplyFilter} variant="contained" fullWidth>
                Apply Filter
              </Button>
            </Box>
          </Box>
        </Popover>
      )}

      {noInvoices && (
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          No Invoices Found For The Selected Date...
        </Typography>
      )}

      {/* Invoice List */}
      {hasInvoices && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
            width: "90rem",
            mx: "auto",
          }}
        >
          <InvoicesList invoices={shippingLineInvoices} />
        </Box>
      )}

      {/* Feedback Messages */}
      {!invoicesLoaded && (
        <Typography
          variant="h5"
          sx={{ mt: 10, width: "100%", textAlign: "center" }}
        >
          No invoices to display yet...
        </Typography>
      )}
    </>
  );
}
