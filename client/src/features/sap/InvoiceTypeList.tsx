import { List } from "@mui/material";
// import { useAppSelector } from "../../app/store/configureStore";
import Grid from "@mui/material/Grid2";
import InvoiceType from "./InvoiceType";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useEffect } from "react";
import { getAllCInvoiceTypesAsync } from "./invoiceTypeSlice";

const InvoiceTypeList = () => {
  const dispatch = useAppDispatch();
  const { invoiceTypeSelected } = useAppSelector(
    (state) => state.cFinalizedInvoicesSlice
  );
  const { invoiceTypesLoaded, invoiceTypes } = useAppSelector(
    (state) => state.cInvoiceTypeSlice
  );

  useEffect(() => {
    if (!invoiceTypesLoaded) {
      dispatch(getAllCInvoiceTypesAsync());
    }
  }, [invoiceTypesLoaded, dispatch]);

  return (
    <List
      sx={{
        width: "100%",
        maxWidth: 360,
        bgcolor: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={1} sx={{ width: "9rem" }}>
        {invoiceTypes?.map((invoice) => (
          <Grid size={6} key={invoice.typeGroup}>
            <InvoiceType
              invoiceActivated={invoiceTypeSelected === invoice.typeGroup}
              typeGroup={invoice.typeGroup}
              key={invoice.typeGroup}
            />
          </Grid>
        ))}
      </Grid>
    </List>
  );
};

export default InvoiceTypeList;
