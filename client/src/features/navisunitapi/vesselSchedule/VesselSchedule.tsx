import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";

import { WorkingVesselList } from "./WorkingVesselsList";
import { getVesselScheduleThunk } from "./getVesselScheduleThunk";


// const workingVesselTableHeader = [
//   "No",
//   "Voyage",
//   "Operator",
//   "ATA",
//   "Start Work",
//   "Berth",
// ];

// const inBoundVesselTableHeader = ["No", "Voyage", "Operator", "ETA", "Berth"];

const VesselSchedule = () => {
  const { status, vessels } = useAppSelector((state) => state.vesselSchedule);

  const dispatch = useAppDispatch();

  const loading = status === "pending";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Box sx={{ width: "15rem", mb: 5 }}>
        <LoadingButton
          fullWidth
          loading={loading}
          variant="contained"
          onClick={() => dispatch(getVesselScheduleThunk())}
        >
          Load Schedule
        </LoadingButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "column",
          ml: "auto",
          mr: "auto",
          outline: "1px solid black",
        }}
      >
        <WorkingVesselList vessels={vessels} />
      </Box>
    </Box>
  );
};

export default VesselSchedule;
