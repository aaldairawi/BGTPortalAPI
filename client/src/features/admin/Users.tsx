import {
  Backdrop,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import User from "./User";
import { getAllUsersAsync, userSelectors } from "./usersSlice";
import LoadingComponent from "../../app/components/LoadingComponent";
import { useEffect, useState } from "react";
import { getAllRolesAsync } from "./rolesSlice";
import Register from "../account/Register";
import CreateEntityButton from "../../app/components/CreateEntityButton";
import TableHeadComponent from "../../app/components/TableHeadComponent";

const Users = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(userSelectors.selectAll);
  const { usersloaded } = useAppSelector((state) => state.users);
  const { rolesloaded } = useAppSelector((state) => state.roles);
  const { status } = useAppSelector((state) => state.users);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleShowCreateForm = () => {
    setShowCreateForm((prevValue) => !prevValue);
  };

  useEffect(() => {
    if (!usersloaded) {
      dispatch(getAllUsersAsync());
    }
  }, [dispatch, usersloaded]);

  useEffect(() => {
    if (!rolesloaded) {
      dispatch(getAllRolesAsync());
    }
  }, [rolesloaded, dispatch]);

  if (!usersloaded) return <LoadingComponent message="Loading Users..." />;

  if (status === "pendingDeleteUser")
    return <LoadingComponent message="Deleting User" />;

  return (
    <>
      <TableContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <Table
          sx={{
            minWidth: 650,
            maxWidth: 1100,
          }}
        >
          <TableHeadComponent
            tableCellHeadings={[
              "User",
              "Email",
              "Registered",
              "LastLoggedIn",
              "Action",
              "Delete",
            ]}
          />
          <TableBody>
            {users.map((user) => (
              <User user={user} key={user.id} />
            ))}
          </TableBody>
        </Table>

        <CreateEntityButton text="Create" onClick={handleShowCreateForm} />
        {showCreateForm && (
          <Backdrop invisible={false} open={showCreateForm}>
            <Register
              showCloseIcon={true}
              onHandleCloseForm={handleShowCreateForm}
            />
          </Backdrop>
        )}
      </TableContainer>
    </>
  );
};

export default Users;
