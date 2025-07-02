import { Button, Stack, TextField, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { downloadStrippedCsvThunk } from "../../stripping/csv/downloadStrippedCsvThunk";
import { toast } from "react-toastify";
import { resetDashboard } from "../dashboard/strippingDashboardSlice";

const parseDate = (value: string): Date | null => {
  if (!value) return null;
  const [y, m, d] = value.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d));
};

export default function CsvExport() {
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const dispatch = useAppDispatch();
  const { downloadStatus, downloadError } = useAppSelector(
    (state) => state.strippingDashboard
  );

  const isInvalidRange = from && to && from > to;

  const handleDownload = () => {
    if (from && to && !isInvalidRange) {
      dispatch(downloadStrippedCsvThunk({ from, to }));
    }
  };

  // error toast
  useEffect(() => {
    if (downloadStatus === "failed" && downloadError) {
      toast.error(downloadError, { autoClose: 2000 });
    }
  }, [downloadStatus, downloadError]);

  // success toast (optional)
  useEffect(() => {
    if (downloadStatus === "succeeded") {
      toast.success("CSV downloaded successfully!", { autoClose: 1000 });
      dispatch(resetDashboard());
    }
  }, [downloadStatus, dispatch]);

  return (
    <Stack spacing={2} direction="row" alignItems="center">
      <TextField
        id="from-date"
        type="date"
        onChange={(e) => setFrom(parseDate(e.target.value))}
      />
      <TextField
        id="to-date"
        type="date"
        onChange={(e) => setTo(parseDate(e.target.value))}
      />
      <Button
        variant="contained"
        onClick={handleDownload}
        disabled={
          !from || !to || isInvalidRange || downloadStatus === "loading"
        }
        startIcon={
          downloadStatus === "loading" ? <CircularProgress size={20} /> : null
        }
      >
        {downloadStatus === "loading" ? "Downloading…" : "Download CSV File"}
      </Button>
    </Stack>
  );
}
