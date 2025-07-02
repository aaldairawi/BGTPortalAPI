import dayjs from "dayjs";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { useState } from "react";
import { getPendingInvoicesThunk } from "./invoiceDashboardThunks";
import { resetPendingInvoices } from "./pendingInvoicesSlice";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Popover } from "@mui/material";
import Calendar from "../../../app/components/Calendar";

export function FilterPendingInvoices() {
  const dispatch = useAppDispatch();
  const today = dayjs();

  const [finalizedInvoicesDate, setFinalizedInvoicesDate] = useState(
    today.format("YYYY-MM-DD")
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { invoices, status } = useAppSelector(
    (state) => state.pendingInvoicesDashboard
  );

  const handleClose = () => setAnchorEl(null);

  const handleApplyFilter = () => {
    if (finalizedInvoicesDate) {
      console.log(finalizedInvoicesDate);

      dispatch(getPendingInvoicesThunk(finalizedInvoicesDate));
      handleClose();
    }
  };

  const handleReset = () => {
    dispatch(resetPendingInvoices());
    setFinalizedInvoicesDate("");
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
                  finalizedInvoicesDate ? dayjs(finalizedInvoicesDate) : dayjs()
                }
                onChange={(dateFinalized) => {
                  setFinalizedInvoicesDate(dateFinalized.format("YYYY-MM-DD"));
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
