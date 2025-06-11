import { TableRow, TableCell, Checkbox } from "@mui/material";
import { StrippingContainer } from "../../app/models/stripping/stripping.types";
import { tableBodyTableCellStyles } from "../admin/tableCssStyles";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { updateContainerList } from "./strippingSlice";

type Props = {
  strippedContainer: StrippingContainer;
  index: number;
};

export function StrippedUnit({ strippedContainer, index }: Props) {
  const dispatch = useAppDispatch();
  const selectedContainers = useAppSelector(
    (state) => state.stripping.strippingContainersToBeUpdated.containers
  );

  const isChecked = selectedContainers.includes(
    strippedContainer.containerNumber
  );

  const handleCheckboxClick = () => {
    dispatch(updateContainerList(strippedContainer.containerNumber));
  };

  return (
    <TableRow
      sx={{
        border: "none",
        "&:hover": { bgcolor: "lightgray" },
        bgcolor: strippedContainer.final ? "#757de8" : "white",
        color: strippedContainer.final ? "white" : "black",
      }}
    >
      <TableCell sx={{ fontWeight: "bold", ...tableBodyTableCellStyles }}>
        {index + 1}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.containerNumber}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.lineOperator}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.iso}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.size}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.dateStripped}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.laborType}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.driverName}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippedContainer.berth}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <Checkbox onClick={handleCheckboxClick} checked={isChecked} />
      </TableCell>
    </TableRow>
  );
}
