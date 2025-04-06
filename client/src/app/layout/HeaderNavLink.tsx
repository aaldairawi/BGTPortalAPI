import { Button, List, ListItem, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

import { signOut } from "../../features/account/accountSlice";

import { ILinks, Links, rightLinks } from "./links";

const renderLink = (path: string, text: string, key: string): JSX.Element => (
  <ListItem
    sx={{
      color: "rgba(0,0,0)",
      fontSize: "14px",
      "&.active": { textDecoration: "underline" },
      "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
    }}
    component={NavLink}
    to={path}
    key={key}
  >
    {text}
  </ListItem>
);

const filterLinks = (links: ILinks[], exclude: Links[]): ILinks[] =>
  links.filter(({ text }) => !exclude.includes(text));

const HeaderNavLink = () => {
  const { user } = useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();

  if (!user) return null;

  return (
    <List sx={{ display: "flex" }}>
      {user &&
        user.roles?.includes("Admin") &&
        filterLinks(rightLinks, []).map(({ path, text }, index) =>
          renderLink(path, text, index.toString())
        )}
      {user &&
        user.roles?.includes("DubaiBilling") &&
        filterLinks(rightLinks, ["ADMIN", "STRIPPING", "API"]).map(
          ({ path, text }, index) => renderLink(path, text, index.toString())
        )}
      {user &&
        user.roles?.includes("Stripping") &&
        filterLinks(rightLinks, ["ADMIN", "SAP", "API"]).map(
          ({ path, text }, index) => renderLink(path, text, index.toString())
        )}
      {user && (
        <Typography
          variant="caption"
          component={Button}
          sx={{
            color: "rgba(0,0,0)",
            fontWeight: "600",
            "&:hover": { bgcolor: "#e82d26" },
          }}
          onClick={() => dispatch(signOut())}
        >
          Logout
        </Typography>
      )}
    </List>
  );
};

export default HeaderNavLink;
