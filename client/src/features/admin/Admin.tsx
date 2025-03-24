import { Container, Typography } from "@mui/material";
import AdminPanel from "./AdminPanel";
import Users from "./Users";
// import { useNavigate } from "react-router-dom";
import { AdminPanelActions } from "./adminActions";
import { resetDisplay } from "./adminPanelSlice";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import Roles from "./Roles";
import { useEffect } from "react";

const Admin = () => {
  const { items, activePanel } = useAppSelector((state) => state.adminPanel);

  const dispatch = useAppDispatch();

  const activeDisplay = items.find((obj) => obj.action.display === true);

  useEffect(() => {
    return () => {
      dispatch(resetDisplay());
    };
  }, [dispatch]);

  const AdminPanelDefault = (
    <>
      <AdminPanel data={items} />
      <Container sx={{ mt: 33, textAlign: "center" }}>
        <Typography variant="h2" color="white">
          Admin Panel
        </Typography>
      </Container>
    </>
  );

  if (!activeDisplay || activePanel === null) return AdminPanelDefault;
  return (
    <>
      <AdminPanel data={items} />
      {activeDisplay.text === AdminPanelActions.USERS ? <Users /> : null}
      {activeDisplay.text === AdminPanelActions.ROLES ? (
        <Roles editinguser={false} />
      ) : null}
    </>
  );
};

export default Admin;
