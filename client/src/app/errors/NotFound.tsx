import { Box, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Paper elevation={0} variant="outlined">
      <Box
        sx={{
          mt: 20,
          display: "flex",
          alignItems: "center",
          pb: 10,
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" color="#393939">
          This Route doesn't exist in the app.
        </Typography>
        <Typography variant="h4" color="#393939" component={Link} to="/">
          Home
        </Typography>
      </Box>
    </Paper>
  );
};

export default NotFound;
