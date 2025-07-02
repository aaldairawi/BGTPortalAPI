import { TableRow, TableCell } from "@mui/material";
import { VesselDtoBase } from "../../../app/models/container/unit.types";
import { tableBodyTableCellStyles } from "../../admin/tableCssStyles";

interface Props {
  vessel: VesselDtoBase;
  index: number;
}

export function VesselStatus({ vessel, index }: Props) {
  const isWorking = !!vessel.ata && !!vessel.startTime;

  return (
    <TableRow
      sx={{
        border: "none",
        "&:hover": { bgcolor: "lightgray" },
      }}
    >
      <TableCell sx={{ fontWeight: "bold", ...tableBodyTableCellStyles }}>
        {index + 1}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{vessel.vesselName}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{vessel.visitID}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{vessel.operatorCode}</TableCell>

      {isWorking ? (
        <>
          <TableCell sx={tableBodyTableCellStyles}>{vessel.ata}</TableCell>
          <TableCell sx={tableBodyTableCellStyles}>
            {vessel.startTime}
          </TableCell>
        </>
      ) : (
        <TableCell sx={tableBodyTableCellStyles}>{vessel.eta}</TableCell>
      )}

      <TableCell sx={tableBodyTableCellStyles}>{vessel.berth}</TableCell>
    </TableRow>
  );
}
