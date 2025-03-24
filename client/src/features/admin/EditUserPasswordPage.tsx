// import { Box, Button, Container, TextField, Typography } from "@mui/material";
// import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
// import { editUserPasswordAsync, userSelectors } from "./usersSlice";
// import { Navigate, useNavigate, useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import LoadingComponent from "../../app/components/LoadingComponent";

// const EditUserPasswordPage = () => {
//   const { userid } = useParams();
//   const navigate = useNavigate();
//   const { status } = useAppSelector((state) => state.users);
//   const dispatch = useAppDispatch();
//   const {
//     register,
//     setError,
//     handleSubmit,
//     reset,
//     formState: { isValid, errors },
//   } = useForm({ mode: "onTouched" });
//   const user = useAppSelector((state) =>
//     userSelectors.selectById(state, parseInt(userid!))
//   );

//   if (!user) return <Navigate to="/admin" />;
//   if (status === "pendingEditUserPasswordAsync")
//     return <LoadingComponent message="Changing password..." />;
//   const handleApiErrors = (errors: string[]) => {
//     if (errors) {
//       errors.forEach((error) => {
//         if (error.includes("Password")) {
//           setError("password", { message: error });
//         }
//       });
//     }
//   };
//   return (
//     <Container>
//       <Typography variant="h3">{`Update password for ${user.userName}.`}</Typography>
//       <Box
//         component="form"
//         onSubmit={handleSubmit((data) =>
//           dispatch(
//             editUserPasswordAsync({
//               // id: user.id.toString(),
//               newPassword: data.password,
//             })
//           )
//             .then(() => reset())
//             .then(() => navigate("/admin"))
//             .catch((error: string[]) => handleApiErrors(error))
//         )}
//         sx={{
//           mt: 3,
//           display: "flex",
//           flexDirection: "column",
//           gap: 1,
//         }}
//       >
//         <TextField
//           sx={{ width: "20rem" }}
//           label="New Password"
//           {...register("password", {
//             pattern: {
//               value:
//                 /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/.,<>])(?=.{6,10}$).*/,
//               message: "Password not valid",
//             },
//           })}
//           error={!!errors.password}
//           helperText={errors?.password?.message as string}
//         />
//         <Button variant="outlined" sx={{ width: "15rem" }} disabled={!isValid}>
//           Sumbit
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default EditUserPasswordPage;
