import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { IUnitCurrentStatus } from "../../app/models/container/unitCurrentStatus";
import {
  tableHeadTableCellStyles,
  tableBodyTableCellStyles,
} from "../admin/tableCssStyles";

interface Props {
  unitCurrentStatus: IUnitCurrentStatus;
}

const UnitCurrentStatusResult: React.FC<Props> = (props: Props) => {
  const { unitCurrentStatus } = props;
  return (
    <TableContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mt: 5,
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
            <TableCell sx={tableHeadTableCellStyles}>Container</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Transit State</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Category</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Freight</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Line</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Operator</TableCell>
            <TableCell sx={tableHeadTableCellStyles}>Berth</TableCell>
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
              {unitCurrentStatus.containerId}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitTState}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitCategory}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitFreightKind}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitLineOperator}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitNameOps}
            </TableCell>
            <TableCell sx={tableBodyTableCellStyles}>
              {unitCurrentStatus.unitBerth}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UnitCurrentStatusResult;
