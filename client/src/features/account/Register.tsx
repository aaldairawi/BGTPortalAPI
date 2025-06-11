/* eslint-disable @typescript-eslint/no-explicit-any */
import { LockOutlined } from "@mui/icons-material";

import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { registerUserAsync } from "./accountSlice";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import React, { useState } from "react";

import { AUTHLOGINBOX, AUTHLOGINTEXTFIELD } from "./AuthTextFieldStyles";
import { toast } from "react-toastify";

interface Props {
  showCloseIcon?: boolean;
}

const Register: React.FC<Props> = (props: Props) => {
  const { showCloseIcon } = props;

  const dispatch = useAppDispatch();
  const { isUserAnAdmin } = useAppSelector((state) => state.account);
  const [isValidUserName, setIsValidUserName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting, errors, isValid },
  } = useForm({ mode: "onTouched" });

  function handleApiErrors(errors: any) {
    if (errors) {
      errors.forEach((error: string) => {
        if (error.includes("Password")) {
          setError("password", { message: error });
        } else if (error.includes("Email")) {
          setError("email", { message: error });
        } else if (error.includes("Username")) {
          setError("username", { message: error });
        }
      });
    }
  }

  const onHandleValidateUsername = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsValidUserName(() => {
      if (event.target.value.length >= 3) {
        return true;
      } else {
        return false;
      }
    });
  };
  const onHandleValidateEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let bgtEmailDomain = "";
    const atSignIndex = event.target.value.indexOf("@");
    const bgtEmailString = event.target.value.substring(atSignIndex);
    if (atSignIndex > 0) {
      bgtEmailDomain = bgtEmailString;
    }
    const emailValid =
      bgtEmailDomain === "@bgt.ictsi.com" ||
      bgtEmailDomain === "@ictsiiraq.com";
    setIsValidEmail(() => {
      if (event.target.value.includes("@") && emailValid) {
        return true;
      } else {
        return false;
      }
    });
  };

  const onHandleValidatePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const regexPattern = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/.,<>])(?=.{8,100}$).*/
    );
    const passwordCorrect = regexPattern.test(event.target.value);
    if (passwordCorrect) {
      setIsValidPassword(true);
    } else {
      setIsValidPassword(false);
    }
  };

  const onHandleFormSubmit = async (data: FieldValues) => {
    try {
      await dispatch(registerUserAsync(data)).unwrap();

      if (isUserAnAdmin) {
        toast.success("User created successfully.", { autoClose: 1000 });
      } else {
        toast.success("Registration successful, please log in.", {
          autoClose: 500,
        });
      }

      reset();
    } catch (error: any) {
      toast.error("Registration failed. Please check your inputs.", {
        autoClose: 1000,
      });
      console.log(error);

      handleApiErrors(error);
    }
  };

  const marginVariable = showCloseIcon ? 3 : 20;

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 1,
        mt: marginVariable,
        background: "#393939",
        border: "1px solid white",
        borderRadius: "5px",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "white" }}>
        <LockOutlined sx={{ color: "orange" }} />
      </Avatar>
      <Typography component="h1" variant="h5" color="white">
        {showCloseIcon ? "Create" : "Register"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onHandleFormSubmit)}
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
            {...register("username", {
              onChange: onHandleValidateUsername,
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username is incorrect",
              },
            })}
            error={!!errors.username}
          />
          {isValidUserName ? (
            <CheckIcon sx={{ color: "green" }} />
          ) : (
            <Tooltip title="Username must be atleast 3 characters to be valid. ">
              <ErrorIcon sx={{ color: "orange" }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={AUTHLOGINBOX}>
          <Typography variant="subtitle1" color="white">
            Email
          </Typography>
          <TextField
            sx={{ ...AUTHLOGINTEXTFIELD, ml: 4 }}
            margin="normal"
            {...register("email", {
              onChange: onHandleValidateEmail,
              required: "",
              pattern: {
                value: /^[\w-.]+@(bgt\.ictsi\.com|ictsiiraq\.com)$/,
                message: "Nonvalid email",
              },
            })}
            error={!!errors.email}
          />
          {isValidEmail ? (
            <CheckIcon sx={{ color: "green" }} />
          ) : (
            <Tooltip title="Your email must be a valid ICTSI email. No personal emails are accepted.">
              <ErrorIcon sx={{ color: "orange" }} />
            </Tooltip>
          )}
        </Box>
        <Box sx={AUTHLOGINBOX}>
          <Typography variant="subtitle1" color="white">
            Password
          </Typography>
          <TextField
            sx={AUTHLOGINTEXTFIELD}
            margin="normal"
            {...register("password", {
              onChange: onHandleValidatePassword,
              required: "Password is incorrect",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/.,<>])(?=.{8,100}$).*/,
                message: "",
              },
            })}
            error={!!errors.password}
          />
          {isValidPassword ? (
            <CheckIcon sx={{ color: "green" }} />
          ) : (
            <Tooltip title="Your password must be atleast 8 characters. This follows the standard password rules, e.g: 1 uppercase, 1 lowercase, 1 special character">
              <ErrorIcon sx={{ color: "orange" }} />
            </Tooltip>
          )}
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
          {isUserAnAdmin ? "Create" : "Register"}
        </LoadingButton>
        {!showCloseIcon && (
          <Grid container spacing={2}>
            <Grid size={12} sx={{ textAlign: "center" }}>
              <Link to="/v1/login" style={{ color: "white" }}>
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Register;
