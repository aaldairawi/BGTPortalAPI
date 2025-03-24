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
import React, { useEffect } from "react";
import Role from "./Role";
import LoadingComponent from "../../app/components/LoadingComponent";

interface Props {
  editinguser: boolean;
}
const Roles: React.FC<Props> = (props: Props) => {
  const roles = useAppSelector(rolesSelctors.selectAll);
  const { status, rolesloaded } = useAppSelector((state) => state.roles);

  const dispatch = useAppDispatch();
  const { editinguser } = props;

  useEffect(() => {
    if (!rolesloaded) {
      dispatch(getAllRolesAsync());
    }
  }, [dispatch, rolesloaded]);

  if (status === "pendingGetAllRoles")
    return <LoadingComponent message="Getting Roles..." />;
  const adjustMarginTop = editinguser ? 0 : 5;
  const adjustTableWidth = editinguser ? 500 : 700;
  return (
    <>
      <TableContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: adjustMarginTop,
          maxHeight: 600,
        }}
      >
        <Table
          sx={{
            minWidth: 60,
            maxWidth: adjustTableWidth,
            p: 5,
            mt: adjustMarginTop,
          }}
        >
          <TableHead sx={{ borderBottom: "1px solid white" }}>
            <TableRow>
              <TableCell sx={tableHeadTableCellStyles}>Id</TableCell>
              <TableCell sx={tableHeadTableCellStyles}>Role</TableCell>
              <TableCell sx={tableHeadTableCellStyles}>Normalized</TableCell>
              {editinguser && (
                <TableCell sx={tableHeadTableCellStyles}>Add</TableCell>
              )}
              {editinguser && (
                <TableCell sx={tableHeadTableCellStyles}>Remove</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <Role
                editinguser={editinguser}
                index={index + 1}
                role={role}
                key={index + 1}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Roles;
