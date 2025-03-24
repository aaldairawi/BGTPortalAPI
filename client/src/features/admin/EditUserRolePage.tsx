import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
import { userSelectors } from "./usersSlice";
import EditUserForm from "./EditUserForm";
import { Container } from "@mui/material";
import { rolesSelctors } from "./rolesSlice";
// Delete this after setting up the EditUserPage.tsx;
const EditUserRolePage = () => {

  const { userid } = useParams();

  const { usersloaded } = useAppSelector((state) => state.users);
  const { rolesloaded } = useAppSelector((state) => state.roles);

  const roles = useAppSelector(rolesSelctors.selectAll);

  const user = useAppSelector((state) =>
    userSelectors.selectById(state, parseInt(userid!))
  );

  if (!usersloaded || !rolesloaded || !user) {
    return <Navigate to="/admin" />;
  }
  return (
    <Container>
      <EditUserForm user={user} roles={roles} />
    </Container>
  );
};

export default EditUserRolePage;
