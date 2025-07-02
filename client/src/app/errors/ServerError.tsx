import { Container, Divider, Paper, Typography, Button, Box } from "@mui/material";
import { useLocation, Link } from "react-router-dom";

const ServerError = () => {
  const { state } = useLocation();

  return (
    <Container component={Paper} sx={{ mt: 4, p: 4 }}>
      {state?.error ? (
        <>
          <Typography gutterBottom variant="h3" color="secondary">
            {state.error.title}
          </Typography>
          <Divider />
          <Typography variant="body1" color="secondary" sx={{ mb: 3 }}>
            {state.error.detail || "Internal Server Error"}
          </Typography>
        </>
      ) : (
        <Typography gutterBottom variant="h3">
          Server Error
        </Typography>
      )}

      <Box mt={3}>
        <Button component={Link} to="/" variant="contained" color="primary">
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default ServerError;
