import { Table, TableBody, TableContainer } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/store/configureStore";
import User from "./User";
import { userSelectors } from "./usersSlice";
import LoadingComponent from "../../../app/components/LoadingComponent";
import { useEffect } from "react";

import TableHeadComponent from "../../../app/components/TableHeadComponent";
import { getAllUsersAsync } from "./getUserThunks";

export function Users() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(userSelectors.selectAll);

  const { usersloaded } = useAppSelector((state) => state.users);

  const { status } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (!usersloaded) {
      dispatch(getAllUsersAsync());
    }
  }, [dispatch, usersloaded]);

  if (!usersloaded) return <LoadingComponent message="Loading Users..." />;

  if (status === "pendingDeleteUser")
    return <LoadingComponent message="Deleting User" />;

  return (
    <>
      <TableContainer
        sx={{
          mt: 0,
          maxHeight: 425,
          maxWidth: 1050,
          overflowY: "auto",
        }}
      >
        <Table
          stickyHeader
          sx={{
            minWidth: 800,
            maxWidth: 1000,
            width: "100%",
          }}
        >
          <TableHeadComponent
            tableCellHeadings={[
              "No",
              "User",
              "Email",
              "Registered",
              "Last Activity",
              "Action",
              "Delete",
            ]}
          />
          <TableBody>
            {users.map((user, index) => (
              <User user={user} key={user.id} index={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
