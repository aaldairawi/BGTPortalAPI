import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import HeaderNavLink from "./HeaderNavLink";

import { useAppSelector } from "../store/configureStore";

const Header = () => {
  const { user } = useAppSelector((state) => state.account);

  return (
    <AppBar position="fixed" sx={{ mb: 0, zIndex: 300, p: 0 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 1,
          bgcolor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box component={Link} to="/">
            <Avatar
              src="/images/bgt_logo.jpg"
              alt="Bgt Logo"
              variant="square"
              sx={{ width: "15rem", height: "auto", pt: 1 }}
            />
          </Box>
          {user && (
            <Box sx={{ ml: 3 }}>
              <Typography sx={{ fontSize: "1rem" }} color="#393939">
                Hello @{user?.userName}
              </Typography>
            </Box>
          )}
        </Box>
        {!user && (
          <Box>
            <Typography variant="h5" color="info">
              V 1.5
            </Typography>
          </Box>
        )}
        {user && (
          <Box>
            <HeaderNavLink />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
