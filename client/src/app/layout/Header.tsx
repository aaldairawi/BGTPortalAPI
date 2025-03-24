import { AppBar, Avatar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import HeaderNavLink, { ILinks } from "./HeaderNavLink";
import { useAppSelector } from "../store/configureStore";

const rightLinks: ILinks[] = [
  { path: "/stripping", text: "Stripping" },
  { path: "/sap-integration", text: "Sap" },
  { path: "/n4api", text: "Api" },
  { path: "/admin", text: "Admin" },
];

const Header = () => {
  const { user } = useAppSelector((state) => state.account);

  return (
    <AppBar position="fixed" sx={{ mb: 0, zIndex: 300, p: 0 }}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pb: 1,
          bgcolor: "#393939",
        }}
      >
        <Box
          sx={{
            p: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box component={Link} to="/">
            <Avatar
              src="/images/bgt_logo.jpg"
              alt="Bgt Logo"
              variant="square"
              sx={{ width: "15rem", height: "auto" }}
            />
          </Box>

          {user && (
            <Box sx={{ ml: 3 }}>
              <Typography sx={{ fontSize: "1.2rem" }} color="white">
                Hello @{user?.userName}
              </Typography>
            </Box>
          )}
        </Box>
        {!user && (
          <Box>
            <Typography variant="h5" color="info">
              V 1.0
            </Typography>
          </Box>
        )}
        {user && (
          <Box>
            <HeaderNavLink links={rightLinks} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
