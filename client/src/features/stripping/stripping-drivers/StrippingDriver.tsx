import { TableRow, TableCell, Button } from "@mui/material";
import { StrippingDriverDto as StrippingDriverType } from "../../../app/models/stripping/stripping.types";
import { tableBodyTableCellStyles } from "../../admin/tableCssStyles";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { deleteStrippingDriverThunk } from "./deleteStrippingDriverThunk";
import { toast } from "react-toastify";

interface Props {
  index: number;
  strippingDriver: StrippingDriverType;
}
export function StrippingDriver({ strippingDriver, index }: Props) {
  const dispatch = useAppDispatch();
  const { strippingDriverStatus } = useAppSelector(
    (state) => state.strippingDrivers
  );

  const handleDelete = () => {
    dispatch(deleteStrippingDriverThunk(strippingDriver.id))
      .unwrap()
      .then(() => {
        toast.success("Driver deleted successfully!", { autoClose: 2000 });
      })
      .catch((error) => {
        toast.error("Failed to delete driver.", { autoClose: 2000 });
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
        {strippingDriver.name}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {strippingDriver.creator ? strippingDriver.creator : "Admin"}
      </TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <Button
          variant="contained"
          color="warning"
          onClick={handleDelete}
          disabled={strippingDriverStatus === "pending"}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}
