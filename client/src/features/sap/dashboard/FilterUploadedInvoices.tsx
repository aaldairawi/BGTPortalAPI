import { LoadingButton } from "@mui/lab";
import { Box, Button, Popover } from "@mui/material";

import dayjs from "dayjs";
import { useState } from "react";
import Calendar from "../../../app/components/Calendar";

import { getUploadedInvoicesThunk } from "./invoiceDashboardThunks";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { resetUploadedInvoicesDashboard } from "./uploadedInvoicesSlice";

export function FilterUploadedInvoices() {
  const dispatch = useAppDispatch();
  const today = dayjs();

  const [uploadedInvoicesDate, setUploadedInvoicesDate] = useState(
    today.format("YYYY-MM-DD")
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { invoices, status } = useAppSelector(
    (state) => state.uploadedInvoicesDashboard
  );

  const handleClose = () => setAnchorEl(null);

  const handleApplyFilter = () => {
    if (uploadedInvoicesDate) {
      dispatch(getUploadedInvoicesThunk(uploadedInvoicesDate));
      handleClose();
    }
  };

  const handleReset = () => {
    dispatch(resetUploadedInvoicesDashboard());
    setUploadedInvoicesDate("");
  };

  const hasInvoices = invoices.length > 0;
  const invoicesLoading = status === "pending";

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
                  uploadedInvoicesDate ? dayjs(uploadedInvoicesDate) : dayjs()
                }
                onChange={(dateFinalized) => {
                  setUploadedInvoicesDate(dateFinalized.format("YYYY-MM-DD"));
                }}
              />

              <Button onClick={handleApplyFilter} variant="contained" fullWidth>
                Apply Filter
              </Button>
            </Box>
          </Box>
        </Popover>
      )}
    </>
  );
}
