import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";

import TableHeadComponent from "../../../app/components/TableHeadComponent";
import { VesselDtoBase } from "../../../app/models/container/unit.types";
import { VesselStatus } from "./VesselStatus";
import { useAppSelector } from "../../../app/store/configureStore";

interface Props {
  vessels: VesselDtoBase[] | null;
}
 
export function WorkingVesselList({ vessels }: Props) {
  const { vesselsLoaded } = useAppSelector((state) => state.vesselSchedule);

  if (!vesselsLoaded || !vessels) return null;

  const workingVessels = vessels.filter((v) => v.phase.includes("WORKING"));
  const inboundVessels = vessels.filter((v) => v.phase.includes("INBOUND"));

  const dataSets = [
    { title: "Working Vessels", rows: workingVessels },
    { title: "Upcoming Vessels", rows: inboundVessels },
  ];

  const getTableHeaders = (isWorking: boolean): string[] =>
    isWorking
      ? ["#", "Vessel Name", "Visit ID", "Operator Code", "ATA", "Start Time", "Berth"]
      : ["#", "Vessel Name", "Visit ID", "Operator Code", "ETA", "Berth"];

  return (
    <>
      {dataSets.map(({ title, rows }) => {
        const isWorking = title === "Working Vessels";

        return (
          <Box
            key={title}
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              {title}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ mt: 0, maxHeight: 425, width: "100%", overflowY: "auto" }}
            >
              <Table stickyHeader sx={{ minWidth: 800, width: "100%" }}>
                <TableHeadComponent tableCellHeadings={getTableHeaders(isWorking)} />
                <TableBody>
                  {rows.map((vessel, index) => (
                    <VesselStatus
                      key={`${vessel.visitID}-${index}`}
                      vessel={vessel}
                      index={index}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      })}
    </>
  );
}
