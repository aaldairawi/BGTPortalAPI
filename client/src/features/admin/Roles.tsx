import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { tableHeadTableCellStyles } from "./tableCssStyles";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { getAllRolesAsync, rolesSelctors } from "./rolesSlice";
import { useEffect } from "react";

import { Role as RoleInterface } from "../../app/models/role/role";
import Role from "./Role";
import LoadingComponent from "../../app/components/LoadingComponent";
import { ExistingUserRoleStatus } from "../../app/models/role/role";

interface Props {
  editingUser: boolean;
}

export type RolesToMap = ExistingUserRoleStatus[] | RoleInterface[];

export function Roles({ editingUser }: Props) {
  const dispatch = useAppDispatch();

  const appRoles = useAppSelector(rolesSelctors.selectAll);

  const { status, rolesloaded } = useAppSelector((state) => state.roles);
  const { existingUserAppInfo } = useAppSelector((state) => state.users);

  const userAppRoles = existingUserAppInfo.roles;

  const roles: RolesToMap = editingUser ? userAppRoles : appRoles;

  useEffect(() => {
    if (!rolesloaded && !editingUser) {
      dispatch(getAllRolesAsync());
    }
  }, [dispatch, rolesloaded, editingUser]);

  if (!editingUser && status === "pendingGetAllRoles")
    return <LoadingComponent message="Getting App Roles..." />;

  return (
    <>
      <TableContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          maxHeight: 450,
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 60,
            maxWidth: 1100,
            p: 5,
          }}
        >
          <TableHead sx={{ borderBottom: "1px solid white" }}>
            <TableRow>
              <TableCell sx={tableHeadTableCellStyles}>Id</TableCell>
              <TableCell sx={tableHeadTableCellStyles}>Role</TableCell>
              <TableCell sx={tableHeadTableCellStyles}>Normalized</TableCell>
              {editingUser && (
                <TableCell sx={tableHeadTableCellStyles}>Add</TableCell>
              )}
              {editingUser && (
                <TableCell sx={tableHeadTableCellStyles}>Remove</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <Role
                index={index + 1}
                role={role}
                key={role.name}
                editingUser={editingUser || undefined}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
