import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  tableHeadTableCellStyles,
  tableBodyTableCellStyles,
} from "../admin/tableCssStyles";
import { IContainerExportDto } from "../../app/models/container/unitLifeTime";

interface Props {
  unitExportLifeTime: IContainerExportDto;
}

const UnitExportStatusResult: React.FC<Props> = (props: Props) => {
  const { unitExportLifeTime } = props;

  return (
    <TableContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 5,
        outline: "1px solid white",
        width: "100%",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          maxWidth: 1100,
        }}
      >
        <TableHead sx={{ borderBottom: "1px solid white" }}>
          <TableRow>
            <TableCell sx={tableHeadTableCellStyles}>Unit</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Category</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Status</TableCell>

            {unitExportLifeTime.shippingLine && (
              <TableCell sx={tableHeadTableCellStyles}>Line</TableCell>
            )}
            {unitExportLifeTime.vesselName && (
              <TableCell sx={tableHeadTableCellStyles}>Vessel</TableCell>
            )}
            {unitExportLifeTime.vesselVoyage && (
              <TableCell sx={tableHeadTableCellStyles}>Voyage</TableCell>
            )}
            {unitExportLifeTime.receivedEmpty && (
              <TableCell sx={tableHeadTableCellStyles}>
                Received Empty
              </TableCell>
            )}
            {unitExportLifeTime.unitStuffed && (
              <TableCell sx={tableHeadTableCellStyles}>Stuffed</TableCell>
            )}
            {unitExportLifeTime.receivedFull && (
              <TableCell sx={tableHeadTableCellStyles}>Received Full</TableCell>
            )}
            {unitExportLifeTime.containerLoaded && (
              <TableCell sx={tableHeadTableCellStyles}>Loaded</TableCell>
            )}
            {unitExportLifeTime.vesselCompleted && (
              <TableCell sx={tableHeadTableCellStyles}>
                Vessel Completed
              </TableCell>
            )}
            {unitExportLifeTime.berth && (
              <TableCell sx={tableHeadTableCellStyles}>Berth</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              border: "none",
              cursor: "pointer",
              "&:hover": {
                bgcolor: "grey.800",
              },
            }}
          >
            <TableCell sx={tableBodyTableCellStyles}>
              {unitExportLifeTime.unitId}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitExportLifeTime.category}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitExportLifeTime.status}
            </TableCell>

            {unitExportLifeTime.shippingLine && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.shippingLine}
              </TableCell>
            )}
            {unitExportLifeTime.vesselName && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.vesselName}
              </TableCell>
            )}
            {unitExportLifeTime.vesselVoyage && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.vesselVoyage}
              </TableCell>
            )}
            {unitExportLifeTime.receivedEmpty && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.receivedEmpty}
              </TableCell>
            )}

            {unitExportLifeTime.unitStuffed && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.unitStuffed}
              </TableCell>
            )}
            {unitExportLifeTime.receivedFull && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.receivedFull}
              </TableCell>
            )}
            {unitExportLifeTime.containerLoaded && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.containerLoaded}
              </TableCell>
            )}
            {unitExportLifeTime.vesselCompleted && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.vesselCompleted}
              </TableCell>
            )}
            {unitExportLifeTime.berth && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitExportLifeTime.berth}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnitExportStatusResult;
