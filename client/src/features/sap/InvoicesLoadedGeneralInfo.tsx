import {  Box, Typography } from "@mui/material";

interface Props {
  invoiceTypeLoaded: string;
  invoicesTypeLoadedLength: number;
}


const InvoicesLoadedGeneralInfo: React.FC<Props> = (props: Props) => {

  const { invoiceTypeLoaded, invoicesTypeLoadedLength } = props;
  const pluralInvoicesText = invoicesTypeLoadedLength > 0 ? "Invoices" : "Invoice";
  return (
    <Box
      sx={{
        
        display: "flex",
        flexDirection: "column",
        height: 90,
        textAlign: "center",
        left: 200,
        top: 150,
        color: "white",
        backgroundColor: "#393939",
        fontSize: "12px",
      }}
    >
      <Typography sx={{ fontSize: "12px" }}>{invoiceTypeLoaded} Type</Typography>
      <Typography sx={{ fontSize: "12px" }}>Displaying {invoicesTypeLoadedLength} {pluralInvoicesText} </Typography>
    </Box>
  );
};

export default InvoicesLoadedGeneralInfo;
