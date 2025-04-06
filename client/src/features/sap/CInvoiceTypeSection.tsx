import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import Calendar from "../../app/components/Calendar";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
  ctypeInvoiceSelectors,
  getAllCTypeFinalizedInvoicesAsync,
} from "./cTypeFinalizedSlice";
import InvoiceTypeList from "./InvoiceTypeList";
import { dateObjectOptions } from "../../app/components/dateOptions";
import AvatarInvoiceInfo from "./AvatarInvoiceInfo";
import AvatarInvoiceLength from "./AvatarInvoiceLength";
import { LoadingButton } from "@mui/lab";
import FinalInvoiceTable from "./FinalInvoiceTable";
import InvoiceDetailsBackdrop from "./InvoiceDetailsBackdrop";
import { invoiceItemsSelector } from "./cTypeInvoiceItemSlice";

const CInvoiceTypeSection = () => {
  const invoices = useAppSelector(ctypeInvoiceSelectors.selectAll);

  const dispatch = useAppDispatch();

  const {
    invoicesResponseDto,
    status,
    invoicesLoaded,
    invoiceTypeClicked,
    invoiceTypeSelected,
    invoiceDateSelected,
  } = useAppSelector((state) => state.cFinalizedInvoicesSlice);

  const { showInvoiceItemBackdrop, invoiceItemsLoaded } = useAppSelector(
    (state) => state.cInvoiceItemsSlice
  );
  const invoiceItems = useAppSelector(invoiceItemsSelector.selectAll);
  const { invoiceItemStatus } = useAppSelector(
    (state) => state.cInvoiceItemsSlice
  );
  const showLoadingMessage =
    status === "pendingGetAllCTypeFinalizedInvoicesAsync" && !invoicesLoaded;

  const showGetInvoicesButton =
    invoiceTypeClicked &&
    invoiceTypeSelected !== "" &&
    invoiceDateSelected !== "";
  const invoicesHasItems = invoices.length > 0;
  const showInvoicesNoLengthMessage = invoicesLoaded && !invoicesHasItems;

  const onHandleSubmitGetInvoicesButton = () => {
    const dateFromCalendar = new Date(
      invoiceDateSelected!.toString()
    ).toLocaleString("en-US", dateObjectOptions);

    dispatch(
      getAllCTypeFinalizedInvoicesAsync({
        invoiceType: invoiceTypeSelected,
        finalizedDate: dateFromCalendar,
      })
    );
  };
  return (
    <>
      {invoiceItemStatus === "pendingGetInvoiceItemsAsync" && (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={invoiceItemStatus === "pendingGetInvoiceItemsAsync"}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {showInvoicesNoLengthMessage && (
        <Box sx={{ textAlign: "center", mt: 20 }}>
          <Typography variant="h5" color="info">
            No invoices found for the chosen criteria...
          </Typography>
        </Box>
      )}
      {showLoadingMessage && (
        <Box sx={{ textAlign: "center", mt: 20 }}>
          <Typography variant="h5" sx={{ color: "white" }}>
            Loading invoices...
          </Typography>
        </Box>
      )}
      {invoicesHasItems   && (
        <AvatarInvoiceInfo
          avatarText={`${invoicesResponseDto?.invoiceType} Type`}
        />
      )}
      {invoicesHasItems  && (
        <AvatarInvoiceLength invoicesResponseDto={invoicesResponseDto} />
      )}
      {invoicesHasItems  && (
        <Container
          sx={{
            mt: 10,
            mr: 55,
            width: "45rem",
            height: "30rem",
            overflowY: "auto",
          }}
        >
          <FinalInvoiceTable invoices={invoices} />
        </Container>
      )}
      {showInvoiceItemBackdrop && invoiceItemsLoaded && (
        <InvoiceDetailsBackdrop invoiceItems={invoiceItems} />
      )}
      {status !== "pendingGetAllCTypeFinalizedInvoicesAsync" && (
        <Box
          sx={{
            position: "absolute",
            right: 300,
            top: 100,
            bgcolor: "transparent",
          }}
        >
          <InvoiceTypeList />
        </Box>
      )}
      <Calendar />
      {showGetInvoicesButton && (
        <LoadingButton
          type="button"
          onClick={onHandleSubmitGetInvoicesButton}
          loading={status === "pendingGetAllCTypeFinalizedInvoicesAsync"}
          loadingIndicator={<CircularProgress color="info" size={13} />}
          variant="contained"
          color="info"
          sx={{
            width: "15rem",
            position: "absolute",
            right: 40,
            top: 450,
          }}
        >
          Get Invoices
        </LoadingButton>
      )}
    </>
  );
};

export default CInvoiceTypeSection;
