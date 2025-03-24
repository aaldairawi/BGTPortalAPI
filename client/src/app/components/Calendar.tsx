import { Container } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { onSelectInvoiceDate } from "../../features/sap/cTypeFinalizedSlice";
import { dateObjectOptions } from "./dateOptions";

const minimumDate = dayjs("2024-01-01");
const maximumDate = dayjs("2026-01-01");

const Calendar = () => {
  const { status, invoiceTypeClicked } = useAppSelector(
    (state) => state.cFinalizedInvoicesSlice
  );
  const dispatch = useAppDispatch();

  return (
    <Container
      sx={{
        borderRadius: "5px",
        display: "flex",
        position: "absolute",
        width: "20rem",
        right: 1,
        top: 100,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          disabled={!invoiceTypeClicked || status === "settingInvoiceClicked"}
          minDate={minimumDate}
          maxDate={maximumDate}
          onChange={(dateSelected: Dayjs) =>
            dispatch(
              onSelectInvoiceDate(
                new Date(dateSelected.toString()).toLocaleString(
                  "en-US",
                  dateObjectOptions
                )
              )
            )
          }
          sx={{ bgcolor: "white", color: "black" }}
          loading={
            status === "pendingGetAllCTypeFinalizedInvoicesAsync" ||
            status === "settingInvoiceClicked"
          }
        />
      </LocalizationProvider>
    </Container>
  );
};

export default Calendar;
