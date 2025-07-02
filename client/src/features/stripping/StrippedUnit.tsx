import { TableRow, TableCell, Checkbox } from "@mui/material";
import { StrippingContainer } from "../../app/models/stripping/stripping.types";
import { strippedUnitTableCellSyles } from "../admin/tableCssStyles";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { updateContainerList } from "./strippingSlice";
import { dateTimeToStringFormatted } from "../../app/helper/dateOptions";

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
      }}
    >
      <TableCell
        sx={{
          fontWeight: "bold",
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {index + 1}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.containerNumber}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.lineOperator}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.iso}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.size}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {dateTimeToStringFormatted(strippedContainer.dateStripped)}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.laborType}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.driverName}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        {strippedContainer.berth}
      </TableCell>
      <TableCell
        sx={{
          color: strippedContainer.final ? "white" : "393939",
          ...strippedUnitTableCellSyles,
        }}
      >
        <Checkbox onClick={handleCheckboxClick} checked={isChecked} />
      </TableCell>
    </TableRow>
  );
}
