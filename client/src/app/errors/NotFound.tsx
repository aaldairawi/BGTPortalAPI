import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box sx={{ position: "fixed", mt: 10 }}>
      <Typography sx={{ mb: 2 }} variant="h5" color="white">
        This Route doesn't exist in the app.
      </Typography>
      <Typography variant="h4" color="white" component={Link} to="/">
        Home
      </Typography>
    </Box>
  );
};

export default NotFound;
