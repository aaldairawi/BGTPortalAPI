import {
  Box,
  CircularProgress,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import {
  getExportUnitLifeTimeAsync,
  getImportUnitLifeTimeAsync,
} from "./n4ContainerSlice";
import { toast } from "react-toastify";
import UnitImportStatusResult from "./UnitImportStatusResult";
import UnitExportStatusResult from "./UnitExportStatusResult";

const unitLifeTimeOptions = [
  { value: "IMPORT", label: "IMPORT" },
  { value: "EXPORT/STORAGE", label: "EXPORT/STORAGE" },
];
const UnitLifeTime = () => {
  const dispatch = useAppDispatch();

  const { unitImportLifeTime, unitExportLIfeTime } = useAppSelector(
    (state) => state.n4Containers
  );

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
      <Typography variant="h5" color="white" sx={{ mb: 2, color: "#393939" }}>
        Unit Current Life Time API
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit((data) =>
          dispatch(
            data.unitCategory === "IMPORT"
              ? getImportUnitLifeTimeAsync(data)
              : getExportUnitLifeTimeAsync(data)
          )
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
          autoFocus
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
          {...register("unitNumber", {
            required: true,
            minLength: { value: 11, message: "Not a valid unit number." },
            maxLength: { value: 11, message: "Units are only 11 characters." },
          })}
          error={!!errors.unitnumber}
          helperText={errors?.unitnumber?.message as string}
        />
        <TextField
          select
          defaultValue="IMPORT"
          variant="standard"
          autoFocus
          sx={{ width: "150px", color: "#393939" }}
          slotProps={{
            inputLabel: {
              style: { fontSize: "20px", color: "#393939", marginBottom: "1rem" },
            },
            input: { style: { fontSize: "15px", color: "#393939" } },
          }}
          {...register("unitCategory", {
            required: true,
          })}
          error={!!errors.unitnumber}
          helperText={errors?.unitnumber?.message as string}
          onChange={() => console.log("Changed")}
        >
          {unitLifeTimeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
        {unitImportLifeTime && (
          <UnitImportStatusResult unitImportLifeTime={unitImportLifeTime} />
        )}
        {unitExportLIfeTime && (
          <UnitExportStatusResult unitExportLifeTime={unitExportLIfeTime} />
        )}
      </Box>
    </Container>
  );
};

export default UnitLifeTime;
