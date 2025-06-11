import EditUserForm from "./EditUserForm";
import { useLocation, useParams } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import PersonIcon from "@mui/icons-material/Person";

import { Box, Typography } from "@mui/material";

import { useEffect, useRef } from "react";
import LoadingComponent from "../../../app/components/LoadingComponent";
import { getUserToUpdateInfoAsync } from "./getUserThunks";
import { resetEditUserFetched } from "./usersSlice";

export function EditUserPage() {
  const location = useLocation();
  const prevPathName = useRef(location.pathname);

  const { userId } = useParams();
  const { existingUserAppInfo, status, userToEditFetched } = useAppSelector(
    (state) => state.users
  );

  console.log(existingUserAppInfo);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userId && !userToEditFetched) {
      dispatch(getUserToUpdateInfoAsync(userId));
    }
  }, [dispatch, userId, userToEditFetched]);

  useEffect(() => {
    const previousPath = prevPathName.current;

    return () => {
      if (location.pathname !== previousPath) {
        dispatch(resetEditUserFetched());
      }
    };
  }, [dispatch, location.pathname]);

  if (status === "pendingGettingUserAppInfo")
    return <LoadingComponent message="Fetching user data" />;

  return (
    <>
      <Box
        sx={{
          ml: 4,
          mt: 20,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 9,
        }}
      >
        <Box
          sx={{
            outline: "1px solid white",
            alignSelf: "flex-start",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            flexDirection: "column",
            minWidth: "20rem",
            bgcolor: "#393939",
            borderRadius: "5px",
            gap: 3,
          }}
        >
          <Box>
            <PersonIcon
              sx={{
                fontSize: 50,
                width: "5rem",
                minHeight: "70px",
                color: "white",
              }}
            />
          </Box>
          <Box sx={{ pb: 2, color: "white", ml: 1 }}>
            <Typography variant="subtitle1">
              Id: {existingUserAppInfo.userId}
            </Typography>
            <Typography variant="subtitle1">
              Username: {existingUserAppInfo.username}
            </Typography>
            <Typography variant="subtitle1">
              Email: {existingUserAppInfo.email}
            </Typography>
            <Typography variant="subtitle1">
              Registed: {existingUserAppInfo.registered}
            </Typography>
            <Typography variant="subtitle1">
              Last Login Date: {existingUserAppInfo.lastLoggedIn}
            </Typography>
          </Box>
        </Box>
        <EditUserForm userData={existingUserAppInfo} />
      </Box>
    </>
  );
}

// export default EditUserPage;
