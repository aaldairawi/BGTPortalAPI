import {
  Box,
  Button,
  Popover,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import Calendar from "../../../app/components/Calendar";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { fetchDashboardThunk } from "./fetchDashboardThunk";
import { laborTypeMap } from "../../../app/models/stripping/stripping.types";
import { toast } from "react-toastify";
import { resetDashboard } from "./strippingDashboardSlice";

export const DashboardComponent = () => {
  const dispatch = useAppDispatch();
  const { data, status } = useAppSelector((state) => state.strippingDashboard);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromDate, setFromDate] = useState<Dayjs>(() => dayjs());
  const [toDate, setToDate] = useState<Dayjs>(() => dayjs());

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isRangeValid = fromDate.isBefore(toDate) || fromDate.isSame(toDate);
  const handleApplyFilter = () => {
    if (!fromDate || !toDate) return;

    if (!isRangeValid) {
      toast.error("End date must be after or equal to start date", {
        autoClose: 2000,
      });
      return;
    }

    const from = fromDate.format("YYYY-MM-DD");
    const to = toDate.format("YYYY-MM-DD");

    dispatch(fetchDashboardThunk({ fromDate: from, toDate: to }));
    handleClose();
  };

  const renderTable = (zone: string) => {
    if (data.length <= 0) return;
    const filtered = data.filter((d) => d.berth === zone);
    const total20 = filtered.reduce((sum, d) => sum + d.shift20, 0);
    const total40 = filtered.reduce((sum, d) => sum + d.shift40, 0);
    const total45 = filtered.reduce((sum, d) => sum + d.shift45, 0);
    const total = total20 + total40 + total45;

    const bgColor = zone === "B27" ? "#e3f2fd" : "#e1f5fe";

    return (
      <Box sx={{ mb: 3, bgcolor: bgColor, borderRadius: 2, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          {zone === "B27" ? "EAST" : "WEST"}
        </Typography>
        <Table sx={{ width: 600, margin: "0 auto", border: "1px solid #ccc" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Labor</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>20</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>40</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>45</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={`${row.berth}-${row.laborType}`}>
                <TableCell>
                  {laborTypeMap[Number(row.laborType)] || "unknown"}
                </TableCell>
                <TableCell>{row.shift20}</TableCell>
                <TableCell>{row.shift40}</TableCell>
                <TableCell>{row.shift45}</TableCell>
                <TableCell>{row.total}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>TOTAL</TableCell>
              <TableCell>{total20}</TableCell>
              <TableCell>{total40}</TableCell>
              <TableCell>{total45}</TableCell>
              <TableCell>{total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pb: 2,
          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        <Button onClick={handleClick} variant="contained">
          Select Date Range
        </Button>
        {data.length > 0 && (
          <Button
            onClick={() => {
              dispatch(resetDashboard());
              const today = dayjs();
              setFromDate(today);
              setToDate(today);
              setAnchorEl(null);
            }}
            variant="contained"
          >
            Reset
          </Button>
        )}
      </Box>

      {open && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={2}
            sx={{ p: 2 }}
          >
            <Typography variant="subtitle1">From:</Typography>
            <Calendar value={fromDate} onChange={setFromDate} />

            <Typography variant="subtitle1">To:</Typography>
            <Calendar value={toDate} onChange={setToDate} />

            <Button onClick={handleApplyFilter} variant="contained" fullWidth>
              Apply Filter
            </Button>
          </Box>
        </Popover>
      )}

      {status === "loading" ? (
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <CircularProgress />
          <Typography mt={2}>Loading dashboard...</Typography>
        </Box>
      ) : data.length > 0 ? (
        <>
          <Typography
            variant="subtitle2"
            sx={{ mt: 2, mb: 2, textAlign: "center" }}
          >
            Showing data from <b>{fromDate.format("MMM D, YYYY")}</b> to{" "}
            <b>{toDate.format("MMM D, YYYY")}</b>
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {renderTable("B27")}
            {renderTable("B20")}
          </Box>
        </>
      ) : (
        <Typography mt={4} variant="h5" textAlign="center">
          Please select a date range.
        </Typography>
      )}
    </Box>
  );
};
