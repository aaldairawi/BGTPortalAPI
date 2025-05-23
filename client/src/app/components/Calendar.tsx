import { Paper } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";

import {  useAppSelector } from "../store/configureStore";


import React from "react";

const minimumDate = dayjs("2024-01-01");
const maximumDate = dayjs("2026-01-01");

interface Props {
  onChange: (dateObject: Dayjs) => void;
}
const Calendar: React.FC<Props> = (props: Props) => {
  const { onChange } = props;

  const { invoiceParams } = useAppSelector((state) => state.finalizedInvoices);

  return (
    <Paper sx={{ maxWidth: 305 }} elevation={3}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          // disabled={ctypeInvoiceStatus === "settingInvoiceClicked"}
          value={dayjs(invoiceParams.dateFinalized)}
          minDate={minimumDate}
          maxDate={maximumDate}
          onChange={onChange} 
            
          
          sx={{ bgcolor: "white", color: "black" }}
          loading={false}
        />
      </LocalizationProvider>
    </Paper>
  );
};

export default Calendar;

//(dateSelected: Dayjs) =>
//
// }
