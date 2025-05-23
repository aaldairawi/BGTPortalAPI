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
import { ContainerImportDto } from "../../app/models/container/container.types";


interface Props {
  unitImportLifeTime: ContainerImportDto;
}

const UnitImportStatusResult: React.FC<Props> = (props: Props) => {
  const { unitImportLifeTime } = props;
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
        <TableHead sx={{ borderBottom: "1px solid black" }}>
          <TableRow>
            <TableCell sx={tableHeadTableCellStyles}>Unit</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Category</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Status</TableCell>

            {unitImportLifeTime.shippingLine && (
              <TableCell sx={tableHeadTableCellStyles}>Line</TableCell>
            )}
            {unitImportLifeTime.vesselName && (
              <TableCell sx={tableHeadTableCellStyles}>Vessel</TableCell>
            )}
            {unitImportLifeTime.vesselVoyage && (
              <TableCell sx={tableHeadTableCellStyles}>Voyage</TableCell>
            )}
            {unitImportLifeTime.vesselATA && (
              <TableCell sx={tableHeadTableCellStyles}>VesselATA</TableCell>
            )}
            {unitImportLifeTime.containerDischarge && (
              <TableCell sx={tableHeadTableCellStyles}>Discharge</TableCell>
            )}
            {unitImportLifeTime.loadedToTruck && (
              <TableCell sx={tableHeadTableCellStyles}>Loaded</TableCell>
            )}
            {unitImportLifeTime.stripped && (
              <TableCell sx={tableHeadTableCellStyles}>Stripped</TableCell>
            )}
            {unitImportLifeTime.gateOut && (
              <TableCell sx={tableHeadTableCellStyles}>Gateout</TableCell>
            )}
            {unitImportLifeTime.received && (
              <TableCell sx={tableHeadTableCellStyles}>Received</TableCell>
            )}
            {unitImportLifeTime.berth && (
              <TableCell sx={tableHeadTableCellStyles}>Berth</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            sx={{
              border: "none",
            }}
          >
            <TableCell sx={tableBodyTableCellStyles}>
              {unitImportLifeTime.unitId}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitImportLifeTime.category}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitImportLifeTime.status}
            </TableCell>

            {unitImportLifeTime.shippingLine && (
              <TableCell
                sx={{ ...tableBodyTableCellStyles}}
              >
                {unitImportLifeTime.shippingLine.slice(0, 10)}
              </TableCell>
            )}
            {unitImportLifeTime.vesselName && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.vesselName.slice(0, 10)}
              </TableCell>
            )}
            {unitImportLifeTime.vesselVoyage && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.vesselVoyage}
              </TableCell>
            )}
            {unitImportLifeTime.vesselATA && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.vesselATA}
              </TableCell>
            )}

            {unitImportLifeTime.containerDischarge && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.containerDischarge}
              </TableCell>
            )}
            {unitImportLifeTime.loadedToTruck && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.loadedToTruck}
              </TableCell>
            )}
            {unitImportLifeTime.stripped && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.stripped}
              </TableCell>
            )}
            {unitImportLifeTime.gateOut && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.gateOut}
              </TableCell>
            )}
            {unitImportLifeTime.received && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.received}
              </TableCell>
            )}
            {unitImportLifeTime.berth && (
              <TableCell sx={tableBodyTableCellStyles}>
                {unitImportLifeTime.berth}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnitImportStatusResult;
