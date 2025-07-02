import {
  Box,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

import UnitCurrentStatusResult from "./UnitCurrentStatusResult";
import { toast } from "react-toastify";
import { getUnitCurrentStatusThunk } from "./getUnitCurrentStatusThunk";

const UnitCurrentStatus = () => {
  const dispatch = useAppDispatch();

  const { container } = useAppSelector((state) => state.unitCurrentStatus);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({ mode: "onTouched" });

  const handleApiErrors = (errors: string[]) => {
    if (errors) {
      errors.forEach((error) => {
        if (error.includes("UnitNumber")) {
          setError("unitnumber", { message: error });
        }
      });
    }
  };

  return (
    <Container sx={{ p: 2, mt: 5, border: "1px solid #393939" }}>
      <Typography variant="h5" color="#393939" sx={{ mb: 2 }}>
        Unit Current Status API
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          dispatch(getUnitCurrentStatusThunk(data.unitnumber))
            .then((response) => {
              if (response.meta.requestStatus === "fulfilled") {
                
                toast.success(`Successfully retrieved container.`, {
                  autoClose: 1500,
                });
              }

              reset();
            })
            .catch((error: string[]) => handleApiErrors(error))
        )}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        <TextField
          variant="standard"
          slotProps={{
            inputLabel: {
              style: {
                fontSize: "20px",
                color: "#393939",
                marginBottom: "1rem",
              },
            },
            input: { style: { fontSize: "15px", color: "#393939" } },
          }}
          sx={{ width: "150px", color: "white" }}
          {...register("unitnumber", {
            required: true,
            minLength: { value: 11, message: "Not a valid unit number." },
            maxLength: { value: 11, message: "Units are only 11 characters." },
          })}
          error={!!errors.unitnumber}
          helperText={errors?.unitnumber?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          loadingIndicator={<CircularProgress color="info" size={15} />}
          variant="contained"
          sx={{ width: "200px" }}
          type="submit"
        >
          Submit
        </LoadingButton>
        {container && <UnitCurrentStatusResult unitCurrentStatus={container} />}
      </Box>
    </Container>
  );
};

export default UnitCurrentStatus;
