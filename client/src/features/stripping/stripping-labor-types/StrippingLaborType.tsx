/* eslint-disable @typescript-eslint/no-explicit-any */

import { TableRow, TableCell, Button } from "@mui/material";

import { tableBodyTableCellStyles } from "../../admin/tableCssStyles";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";

import { toast } from "react-toastify";
import { LaborType } from "../../../app/models/stripping/stripping.types";
import { deleteStrippingDriverThunk } from "../stripping-drivers/deleteStrippingDriverThunk";

interface Props {
  index: number;
  strippingLaborType: LaborType;
}
export function StrippingLaborType({ strippingLaborType, index }: Props) {
  const dispatch = useAppDispatch();

  const { strippingDriverStatus } = useAppSelector(
    (state) => state.strippingDrivers
  );

  const handleDelete = (driverId: number) => {
    console.log(driverId);

    dispatch(deleteStrippingDriverThunk(driverId))
      .unwrap()
      .then(() => {
        toast.success("Labor deleted successfully!", { autoClose: 2000 });
      })
      .catch((error: any) => {
        toast.error("Failed to delete labor.", { autoClose: 300 });
        console.error(error);
      });
  };

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
      <TableCell sx={tableBodyTableCellStyles}>
        {strippingLaborType.laborType}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <Button
          variant="contained"
          color="warning"
          onClick={() => handleDelete(strippingLaborType.id)}
          disabled={strippingDriverStatus === "pending"}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
