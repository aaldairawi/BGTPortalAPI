import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
  message?: string;
}

const LoadingComponent: React.FC<Props> = (props: Props) => {
  const { message } = props;
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="center"
        height="100vh"
        width="100vw"
      >
        <CircularProgress
          size={100}
          sx={{ color: "#393939", animationDuration: "800ms" }}
        />
        <Typography
          variant="h4"
          color="#393939"
          sx={{ justifyContent: "center", position: "fixed", top: "60%" }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingComponent;
