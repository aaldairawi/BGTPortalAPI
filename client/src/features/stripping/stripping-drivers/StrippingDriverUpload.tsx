import { Box } from "@mui/material";
import StrippingDriverForm from "./StrippingDriverForm";
import StrippingDriversList from "./StrippingDriversList";


export function StrippingDriverUpload() {
    
    return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <StrippingDriverForm />
      </Box>

      <Box>
        <StrippingDriversList />
      </Box>
    </>
  );
}
