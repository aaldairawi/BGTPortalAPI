import { Container, Typography } from "@mui/material";
import { useAppSelector } from "../../app/store/configureStore";
import SapPanel from "./SapPanel";
import { SapPanelActions } from "./sapActions";
import CTypePanel from "./CTypePanel";
import GenerateInvoiceCSV from "./GenerateInvoiceCSV";
// import SapIntegrationPieChart from "./SapIntegrationPieChart";
// import { dateObjectOptions } from "../../app/components/dateOptions";
// import { useEffect } from "react";

// const todaysDate = new Date();

const SapIntegration = () => {
  const { items, activePanel } = useAppSelector((state) => state.sapApiPanel);

  const activePanelText = items.find((obj) => obj.action.display === true);

  const AdminPanelDefault = (
    <>
      <SapPanel data={items} />
      <Container
        sx={{
          mt: 33,
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <GenerateInvoiceCSV />
        <Typography variant="h2" sx={{ mb: 3, color: "white" }}>
          SAP Invoices Panel
          {/* {todaysDate.toLocaleString("en-US", dateObjectOptions)} */}
        </Typography>
        {/* <SapIntegrationPieChart
          invoiceFinalizedData={{ ctype: 10, sl1Type: 5, sl2Type: 5 }}
        /> */}
      </Container>
    </>
  );
  // useEffect(() => {
  //   const fetchSapInvoicesData = setInterval(() => console.log("Ran..."), 2000);

  //   return () => clearInterval(fetchSapInvoicesData);

  // }, []);
  if (!activePanel || !activePanelText) return AdminPanelDefault;

  return (
    <>
      <SapPanel data={items} />
      {activePanelText.text === SapPanelActions.C_TYPE_INVOICE && (
        <CTypePanel />
      )}
    </>
  );
};

export default SapIntegration;
