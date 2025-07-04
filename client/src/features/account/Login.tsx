import { LockOutlined } from "@mui/icons-material";
import {
  Container,
  Avatar,
  Typography,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

import { useForm } from "react-hook-form";

import { signInUserAsync } from "./accountSlice";
import { useEffect } from "react";

const AUTHLOGINBOX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "30rem",
  gap: 2,
  mb: 2,
};

const AUTHLOGINTEXTFIELD = {
  width: "20rem",
  bgcolor: "white",
  p: 0,
  m: 0,
  borderRadius: "5px",
};

const Login = () => {
  const { user } = useAppSelector((state) => state.account);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "onTouched" });
  const apiversion = "/v1";

  useEffect(() => {
    if (!user) return;

    const roles = user.roles || [];
    console.log(roles);

    if (roles.includes("DubaiFinance") || roles.includes("IraqFinance")) {
      console.log("User has Dubai Finance");
      navigate(`${apiversion}/sap-integration`);
    } else if (roles.includes("Admin")) {
      console.log("User has Admin");

      navigate(`${apiversion}/admin`);
    } else if (roles.includes("Operations")) {
      navigate(`${apiversion}/stripping-units`);
    } else if (roles.includes("Guest") && roles.length === 1) {
      console.log("YES 1 ROLE ONLY");

      navigate(`${apiversion}/default-member-page`);
    }
  }, [user, navigate]);

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1,
        bgcolor: "lightgrey",
        background: "#393939",
        border: "2px solid white",
        gap: 2,
        borderRadius: "5px",
        mt: 20,
      }}
    >
      <Avatar sx={{ bgcolor: "white" }}>
        <LockOutlined sx={{ color: "orange" }} />
      </Avatar>
      <Typography component="h1" variant="h5" color="white">
        Sign In
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          dispatch(signInUserAsync(data)).catch((error) => console.log(error))
        )}
        noValidate
        sx={{ mt: 1 }}
      >
        <Box sx={AUTHLOGINBOX}>
          <Typography variant="subtitle1" color="white">
            Username
          </Typography>
          <TextField
            sx={AUTHLOGINTEXTFIELD}
            margin="normal"
            autoComplete="username"
            {...register("username", {
              required: "Username is required",
              minLength: { value: 3, message: "username is required" },
            })}
            error={!!errors.username}
          />
        </Box>
        <Box sx={AUTHLOGINBOX}>
          <Typography variant="subtitle1" color="white">
            Password
          </Typography>
          <TextField
            sx={AUTHLOGINTEXTFIELD}
            margin="normal"
            autoComplete="current-password"
            type="password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/.,<>])(?=.{6,100}$).*/,
                message: "password is required",
              },
            })}
            error={!!errors.password}
          />
        </Box>
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type="submit"
          fullWidth
          loadingIndicator={<CircularProgress color="info" size={13} />}
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
        <Grid container spacing={2}>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Link to="/v1/register" style={{ color: "white" }}>
              {"Don't have an account sign up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
