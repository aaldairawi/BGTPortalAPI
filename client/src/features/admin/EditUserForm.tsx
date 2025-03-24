import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { IUserDto } from "../../app/models/account/user";
import { LoadingButton } from "@mui/lab";
import { FormEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { cancelEditingUser, editUserAsync } from "./usersSlice";
import { Link } from "react-router-dom";
import Roles from "./Roles";
interface Props {
  user: IUserDto;
}

const EditUserForm: React.FC<Props> = (props: Props) => {
  const { user } = props;

  const [password, setPassword] = useState("");
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const dispatch = useAppDispatch();
  const { status, userUpdatedData, userUpdateFormTouched } = useAppSelector(
    (state) => state.users
  );

  const onHandleChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPasswordTouched(true);
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
        "Your password doesn't meet the criteria, either delete it or try again"
      );
      return;
    }
    dispatch(
      editUserAsync({
        userId: user.id.toString(),
        roles: [...userUpdatedData.roles],
        password: { newPassword: password },
      })
    )
      .then(() => setPassword(""))
      .catch((error) => console.log(error));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmitForm}
      sx={{
        mt: 4,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        flexDirection: "row",
        bgcolor: "transparent",
        maxWidth: 1000,
      }}
    >
      <Roles editinguser={true} />
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
            input: { style: { color: "white" } },
            inputLabel: { style: { color: "white" } },
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
            disabled={!userUpdateFormTouched && !isPasswordTouched}
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
