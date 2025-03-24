import { CircularProgress, TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "./tableCssStyles";
import React from "react";
import { IRole, IUpdateUserRole } from "../../app/models/role/role";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addRoleToUserAsync, removeRoleFromUserAsync } from "./usersSlice";

interface Props {
  role: IRole;
  index: number;
  editinguser: boolean;
}
const filterForTrue = (roles: IUpdateUserRole[], roleName: IRole): boolean => {
  
  const findTheRoleInRoles = roles.find((role) => role.role === roleName.name);
  const indexOfFoundRole = roles.findIndex(
    (role) => role === findTheRoleInRoles
  );
  if (roles[indexOfFoundRole].status === true) return true;
  return false;
};
const Role: React.FC<Props> = (props: Props) => {
  const { role, index, editinguser } = props;
  const { status, userUpdatedData } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();
  

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={tableBodyTableCellStyles}>{index}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{role.name}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {role.name.toUpperCase()}
      </TableCell>
      {editinguser && (
        <TableCell sx={tableBodyTableCellStyles}>
          <LoadingButton
            disabled={filterForTrue(userUpdatedData.roles, role)}
            variant="contained"
            loadingIndicator={
              <CircularProgress sx={{ color: "white" }} size={13} />
            }
            loading={status === "pendingAddingRoleToUser" + role.id}
            onClick={() =>
              dispatch(addRoleToUserAsync({ roleId: role.id, role: role.name }))
            }
          >
            Add
          </LoadingButton>
        </TableCell>
      )}
      {editinguser && (
        <TableCell sx={tableBodyTableCellStyles}>
          <LoadingButton
            disabled={!filterForTrue(userUpdatedData.roles, role)}
            variant="outlined"
            loadingIndicator={
              <CircularProgress sx={{ color: "white" }} size={13} />
            }
            loading={status === "pendingRemovingRoleFromUser" + role.id + "rem"}
            onClick={() =>
              dispatch(
                removeRoleFromUserAsync({
                  roleId: role.id,
                  role: role.name,
                  name: "rem",
                })
              )
            }
          >
            Remove
          </LoadingButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default Role;
