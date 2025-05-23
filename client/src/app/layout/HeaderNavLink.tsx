import { Button, List, ListItem, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

import { signOut } from "../../features/account/accountSlice";

import { ILinks, Links, rightLinks } from "./links";
import { clearUsersLoadedFromAdapter } from "../../features/admin/usersSlice";

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
  const { user, isUserAnAdmin } = useAppSelector((state) => state.account);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  if (!user) return null;

  const onHandleSignUserOut = () => {
    dispatch(signOut());
    if (isUserAnAdmin) {
      dispatch(clearUsersLoadedFromAdapter());
    }
    navigate("/");
  };

  return (
    <List sx={{ display: "flex" }}>
      {user &&
        isUserAnAdmin &&
        filterLinks(rightLinks, []).map(({ path, text }, index) =>
          renderLink(path, text, index.toString())
        )}
      {user &&
        user.roles?.includes("DubaiBilling") &&
        filterLinks(rightLinks, ["ADMIN", "STRIPPING", "UNIT"]).map(
          ({ path, text }, index) => renderLink(path, text, index.toString())
        )}
      {user &&
        user.roles?.includes("Stripping") &&
        filterLinks(rightLinks, ["ADMIN", "SAP", "UNIT"]).map(
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
          onClick={onHandleSignUserOut}
        >
          Logout
        </Typography>
      )}
    </List>
  );
};

export default HeaderNavLink;
