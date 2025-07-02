// import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

// import InvoicesList from "./InvoicesList";

// import { Box, TextField, Typography, Button } from "@mui/material";

// import React, { useState } from "react";
// import { getSingleInvoiceThunk } from "./getSingleInvoiceThunk";

// import { resetSingleInvoiceLoaded } from "./singleInvoiceSlice";
// import { LoadingButton } from "@mui/lab";

// export default function SearchSingleInvoice() {
//   const [invoiceFinalNumber, setInvoiceFinalNumber] = useState("");
//   const dispatch = useAppDispatch();

//   const { invoiceLoaded, singleInvoiceResult, status } = useAppSelector(
//     (state) => state.singleInvoice
//   );

//   const onHandleChangeInvoiceNumber = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setInvoiceFinalNumber(event.target.value);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "flex-start",
//           gap: 2,
//           pb: 1,
//         }}
//       >
//         <TextField
//           label="Final"
//           variant="outlined"
//           onChange={onHandleChangeInvoiceNumber}
//           value={invoiceFinalNumber}
//         />
//         <LoadingButton
//           loading={status === "pendingSearchSingleInvoiceThunk"}
//           variant="contained"
//           disabled={invoiceFinalNumber.length <= 0}
//           onClick={() => dispatch(getSingleInvoiceThunk(invoiceFinalNumber))}
//         >
//           Search
//         </LoadingButton>
//         {singleInvoiceResult && (
//           <Button
//             variant="contained"
//             onClick={() => {
//               dispatch(resetSingleInvoiceLoaded());
//               setInvoiceFinalNumber("");
//             }}
//           >
//             Reset
//           </Button>
//         )}
//       </Box>
//       {!singleInvoiceResult && (
//         <Typography variant="h5" sx={{ textAlign: "center" }}>
//           No Invoice Loaded Yet...
//         </Typography>
//       )}
//       {invoiceLoaded && singleInvoiceResult && (
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-evenly",
//             mt: 2,
//           }}
//         >
//           <InvoicesList invoices={[singleInvoiceResult]} />
//         </Box>
//       )}
//     </>
//   );
// }
