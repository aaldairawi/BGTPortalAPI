import { Container, Typography } from "@mui/material";

const ServerError = () => {
  return (
    <Container sx={{mt: 20}}>
      <Typography variant="h5" color="white">
        Server error please contact IT.
      </Typography>
    </Container>
  );
};

export default ServerError;
