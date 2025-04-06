import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { UserAppInfo } from "../../app/models/account/user";
import { LoadingButton } from "@mui/lab";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { cancelEditingUser } from "./usersSlice";
import { Link, useNavigate } from "react-router-dom";
import { Roles } from "./Roles";

import { toast } from "react-toastify";
import { sendUpdatedUserInfoAsync } from "./updateUserThunk";

interface Props {
  userData: UserAppInfo;
}

const EditUserForm: React.FC<Props> = (props: Props) => {
  const { userData } = props;
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const { status, existingUserAppInfo: userUpdatedData } = useAppSelector(
    (state) => state.users
  );

  const onHandleChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword(event.target.value);
  };

  const handleSubmitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const regexPattern = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/.,<>])(?=.{8,10}$).*/
    );
    const passwordCorrect = regexPattern.test(password);

    if (password.length > 0 && !passwordCorrect) {
      alert(
        "Password entered doesn't meet the criteria (8-10) characters, either delete it or try again"
      );
      return;
    }

    dispatch(
      sendUpdatedUserInfoAsync({
        userId: userData.userId.toString(),
        roles: userUpdatedData.roles.map((element) => ({
          role: element.name,
          status: element.status,
        })),
        password: password,
      })
    )
      .unwrap()
      .then(() => {
        setPassword("");
        toast.success("User successfully updated.", { autoClose: 1000 });
        navigate("/admin");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong updating the user.");
      });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      sx={{
        outline: "1px solid black",

        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "row",
        bgcolor: "transparent",
        maxWidth: 1000,
      }}
    >
      <Roles editingUser={true} />
      <Box
        sx={{
          mt: 6,
          ml: 7,
          width: "40rem",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TextField
          variant="standard"
          onChange={onHandleChangePassword}
          value={password}
          type="text"
          label="Password"
          sx={{ maxWidth: 200 }}
          slotProps={{
            input: { style: { color: "#393939" } },
            inputLabel: { style: { color: "#393939" } },
          }}
        />
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="flex-start"
          gap="1.5rem"
          mt="2rem"
          sx={{
            width: "15rem",
          }}
        >
          <LoadingButton
            disabled={password.length <= 0}
            variant="contained"
            type="submit"
            color="success"
            loadingIndicator={<CircularProgress color="info" size={13} />}
            loading={status === "pendingEditUserAsync"}
          >
            Save
          </LoadingButton>
          <Button
            disabled={status === "pendingEditUserAsync"}
            component={Link}
            onClick={() => dispatch(cancelEditingUser())}
            to={`/admin`}
            variant="contained"
            color="success"
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUserForm;
