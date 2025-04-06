import { CircularProgress, TableCell, TableRow } from "@mui/material";
import { tableBodyTableCellStyles } from "./tableCssStyles";
import React from "react";

import {
  ExistingUserRoleStatus,
  Role as RoleInterface,
} from "../../app/models/role/role";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addRoleToUserAsync, removeRoleFromUserAsync } from "./roleThunks";

type RoleResult = RoleInterface | ExistingUserRoleStatus;

interface Props {
  role: RoleResult;
  index: number;
  editingUser?: boolean;
}

const Role: React.FC<Props> = (props: Props) => {
  const { role, index, editingUser } = props;
  const { status } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell sx={tableBodyTableCellStyles}>{index}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>{role.name}</TableCell>
      <TableCell sx={tableBodyTableCellStyles}>
        {role.name.toUpperCase()}
      </TableCell>

      {editingUser && (
        <TableCell sx={tableBodyTableCellStyles}>
          <LoadingButton
            disabled={"status" in role ? role.status : false}
            variant="contained"
            loadingIndicator={
              <CircularProgress sx={{ color: "white" }} size={13} />
            }
            loading={status === "pendingAddingRoleToUser" + role.id}
            onClick={() =>
              dispatch(addRoleToUserAsync({ role: role.name, roleId: role.id }))
            }
          >
            Add
          </LoadingButton>
        </TableCell>
      )}

      {editingUser && (
        <TableCell sx={tableBodyTableCellStyles}>
          <LoadingButton
            disabled={"status" in role ? !role.status : true}
            variant="outlined"
            loadingIndicator={
              <CircularProgress sx={{ color: "#393939" }} size={13} />
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
