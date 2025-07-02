import { Box, Typography } from "@mui/material";
import { StrippingLoadedDetails } from "../../app/models/stripping/stripping.types";

type Props = {
  strippingContainersLoadedDetails: StrippingLoadedDetails | null;
  //invoiceParams: InvoiceParams;
};

export function StrippingDetails({ strippingContainersLoadedDetails }: Props) {
  if (!strippingContainersLoadedDetails) return null;

  return (
    <Box
      sx={{
        gap: 4,
        display: "flex",
        alignItems: "center",
        width: "25rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "5px",
          gap: 3,
          p: 1,
          width: "100%",
          bgcolor: "white",
          color: "grey",
        }}
      >
        <Typography variant="subtitle1">
          {strippingContainersLoadedDetails.strippedContainersLength}{" "}
          {strippingContainersLoadedDetails.strippedContainersLength > 1
            ? "Units Stripped In App"
            : "Unit Stripped In App"}
        </Typography>

        <Typography variant="subtitle1">
          {strippingContainersLoadedDetails.retiredContainersLength}{" "}
          {strippingContainersLoadedDetails.retiredContainersLength > 1
            ? "Units Stripped In N4"
            : "Unit Stripped In N4"}
        </Typography>
      </Box>
    </Box>
  );
}
