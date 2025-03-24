import { Avatar, Typography } from "@mui/material";
import { IFinalizedInvoiceResponse } from "../../app/models/invoice/finalizedinvoice";
import React from "react";

interface Props {
  invoicesResponseDto?: IFinalizedInvoiceResponse | null;
}
const AvatarInvoiceLength: React.FC<Props> = (props: Props) => {
  const { invoicesResponseDto } = props;
  return (
    <Avatar
      variant="circular"
      sx={{
        width: 90,
        display: "flex",
        flexDirection: "column",
        height: 90,
        textAlign: "center",
        position: "absolute",
        left: 200,
        top: 260,
        color: "black",
        p: 3,
      }}
    >
      <Typography sx={{ fontSize: "12px" }}>Displaying</Typography>
      <Typography sx={{ fontSize: "12px" }} color="error">
        {invoicesResponseDto?.invoicesLength}
      </Typography>
      <Typography sx={{ fontSize: "12px" }}>
        {invoicesResponseDto?.invoicesLength === 1 ? "Invoice" : "Invoices"}
      </Typography>
    </Avatar>
  );
};

export default AvatarInvoiceLength;
