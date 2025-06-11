import { Box, Typography } from "@mui/material";
import FilterStrippingUnits from "./FilterStrippingUnits";
import { useAppSelector } from "../../app/store/configureStore";
import { StrippedUnitsList } from "./StrippedUnitsList";
import LoadingComponent from "../../app/components/LoadingComponent";

import { StrippingUploadAction } from "./StrippingUploadAction";
import { StrippingDetails } from "./StrippingDetails";

const StrippingUpload = () => {
  const { status, strippedUnits, strippingUnitsLoaded } = useAppSelector(
    (state) => state.stripping
  );

  if (status === "pendingGetAllStrippedUnitsThunk") {
    return <LoadingComponent message="Loading Units" />;
  }

  // Get the count of stripped containers in app.
  const strippedContainersIn4 = strippedUnits.filter(
    (element) => element.final == true
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 2,
          pb: 1,
        }}
      >
        <FilterStrippingUnits />
      </Box>
      {strippingUnitsLoaded && strippedUnits.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            width: "90rem",
            ml: "auto",
            mr: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              width: "100%",
              justifyContent: "space-evenly",
              alignSelf: "center",
            }}
          >
            <StrippingDetails
              strippingContainersLoadedDetails={{
                retiredContainersLength: strippedUnits.length,
                strippedContainersLength: strippedContainersIn4.length,
              }}
            />
            <StrippingUploadAction />
          </Box>
          <StrippedUnitsList strippedContainerList={strippedUnits} />
        </Box>
      )}
      {strippedUnits.length <= 0 && (
        <Typography
          variant="h5"
          sx={{
            mt: 10,
            width: "100%",
            textAlign: "center",
          }}
        >
          No container loaded yet...
        </Typography>
      )}
    </>
  );
};

export default StrippingUpload;
