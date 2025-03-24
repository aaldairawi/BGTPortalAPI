import EditUserForm from "./EditUserForm";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setUserData, userSelectors } from "./usersSlice";
import { Box, Typography } from "@mui/material";
import { getAllRolesAsync, rolesSelctors } from "./rolesSlice";
import { useEffect } from "react";
import LoadingComponent from "../../app/components/LoadingComponent";
import NoUserError from "../../app/router/NoUserError";
import { IUpdateUserRole } from "../../app/models/role/role";

const EditUserPage = () => {
  const { userid } = useParams();
  const { status, rolesloaded } = useAppSelector((state) => state.roles);

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) =>
    userSelectors.selectById(state, parseInt(userid!))
  );
  const roles = useAppSelector(rolesSelctors.selectAll);

  useEffect(() => {
    if (!rolesloaded) {
      dispatch(getAllRolesAsync());
    }
  }, [rolesloaded, dispatch]);

  useEffect(() => {
    if (user) {
      const userRoles: IUpdateUserRole[] = roles.map((role) => {
        return {
          role: role.name,
          status: user.roles.includes(role.name),
        };
      });
      dispatch(
        setUserData({
          userId: user.id.toString(),
          roles: userRoles,
          password: { newPassword: "" },
        })
      );
    }
  }, [user, dispatch, roles]);
  if (status === "pendingGetAllRoles")
    return <LoadingComponent message="Getting Roles" />;
  if (!user) return <NoUserError />;

  return (
    <>
      <Box sx={{ ml: 3 }}>
        <Typography variant="h5" color="info">
          Updating user @{user.userName}
        </Typography>
      </Box>
      <EditUserForm user={user} />
    </>
  );
};

export default EditUserPage;
