import { Box, Typography } from "@mui/material";
import FilterStrippingUnits from "./FilterStrippingUnits";
import { useAppSelector } from "../../app/store/configureStore";
import { StrippedUnitsList } from "./StrippedUnitsList";
import { StrippingUploadAction } from "./StrippingUploadAction";
import { StrippingDetails } from "./StrippingDetails";

const StrippingUpload = () => {
  const { strippedUnits, strippingUnitsLoaded } = useAppSelector(
    (state) => state.stripping
  );

  const strippedContainersIn4 = strippedUnits.filter(
    (element) => element.final === true
  );

  const hasResults = strippingUnitsLoaded && strippedUnits.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2, // smaller gap for tighter layout
        px: 2,
      }}
    >
      {/* Filter Sidebar */}
      <Box sx={{ minWidth: "180px", flexShrink: 0 }}>
        <FilterStrippingUnits />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          flexBasis: 0, // allow it to stretch
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {hasResults ? (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
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

            <Box sx={{ width: "100%" }}>
              <StrippedUnitsList strippedContainerList={strippedUnits} />
            </Box>
          </>
        ) : (
          <Typography
            variant="h5"
            sx={{
              mt: 10,
              width: "80%",
              textAlign: "center",
            }}
          >
            No containers loaded yet...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StrippingUpload;
