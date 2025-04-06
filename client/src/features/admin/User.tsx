import { Button, TableCell, TableRow } from "@mui/material";
import { UserDto } from "../../app/models/account/user";
import { useAppDispatch } from "../../app/store/configureStore";
import { removeUserById } from "./usersSlice";
import { Link } from "react-router-dom";
import { tableBodyTableCellStyles } from "./tableCssStyles";
import { deleteUserAsync } from "./deleteUserThunk";

interface Props {
  user: UserDto;
}

const User: React.FC<Props> = (props: Props) => {
  const { user } = props;
  const dispatch = useAppDispatch();

  return (
    <TableRow
      sx={{
        border: "none",
        cursor: "pointer",
      }}
    >
      <TableCell sx={tableBodyTableCellStyles}>{user.userName}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{user.email}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{user.registered}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{user.lastLoggedIn}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        <Button
          component={Link}
          sx={{ fontSize: "13px" }}
          to={`/edit/user/${user.id}`}
          variant="contained"
          color="success"
        >
          Update
        </Button>
      </TableCell>

      <TableCell sx={tableBodyTableCellStyles}>
        {" "}
        <Button
          variant="contained"
          color="error"
          sx={{ fontSize: "13px" }}
          onClick={() =>
            dispatch(deleteUserAsync(user.id)).then(() =>
              dispatch(removeUserById(user.id))
            )
          }
        >
          DELETE
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default User;
