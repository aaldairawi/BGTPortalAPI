import { Box } from "@mui/material";
import { CSVLink } from "react-csv";

const GenerateInvoiceCSV = () => {
  const invoiceHeaders = [
    { label: "Gl Code", key: "gcode" },
    { label: "Profit Center", key: "profit" },
    { label: "First Name", key: "firstname" },
    { label: "Email", key: "email" },
    { label: "Number", key: "number" },
  ];
  const invoiceData = [
    { gcode: "991" },
    { profit: "5000" },
    { firstname: "Ali", email: "aaldairawi@gmail.com", number: "123" },

    { firstname: "Ali", email: "aaldairawi@gmail.com", number: "123" },

    { firstname: "Ali", email: "aaldairawi@gmail.com", number: "123" },
  ];

  return (
    <Box>
      <CSVLink
        data={invoiceData}
        headers={invoiceHeaders}
        filename="invoicedemo"
      >
        Download
      </CSVLink>
    </Box>
  );
};

export default GenerateInvoiceCSV;
