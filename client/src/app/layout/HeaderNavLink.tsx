import { Button, List, ListItem, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

import { navStyles } from "./navStyles";
import { signOut } from "../../features/account/accountSlice";

type ADMIN_LINKS = "Api" | "Admin";
type NORMAL_USER_LINKS = "Sap" | "Stripping";
type Links = ADMIN_LINKS | NORMAL_USER_LINKS;
export interface ILinks {
  path: string;
  text: ADMIN_LINKS | NORMAL_USER_LINKS;
}

interface Props {
  links: ILinks[];
}

const LinksRendered = (path: string, text: Links, key: string) => (
  <ListItem sx={navStyles} component={NavLink} to={path} key={key}>
    {text.toUpperCase()}
  </ListItem>
);
const HeaderNavLink: React.FC<Props> = (props: Props) => {
  const { links } = props;
  const { user } = useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();
  const signedInDubaiBillingLinks = (cb: () => boolean) => {
    if (cb()) {
      return links.map(({ path, text }) =>
        text === "Admin" || text === "Api" || text === "Stripping"
          ? null
          : LinksRendered(path, text, text)
      );
    }
  };
  const signedInStrippingTeamLinks = (cb: () => boolean) => {
    if (cb()) {
      return links.map(({ path, text }) =>
        text === "Admin" || text === "Sap" || text === "Api"
          ? null
          : LinksRendered(path, text, text)
      );
    }
  };
  const signedInAdminLinks = (cb: () => boolean) => {
    if (cb()) {
      return links.map(({ path, text }) =>
        LinksRendered(
          path === "/sap-integration" ? "/sap-integration/admin" : path,
          text,
          text
        )
      );
    }
  };

  if (user && !user.roles) {
    return (
      <Typography
        component={Button}
        size="medium"
        sx={navStyles}
        onClick={() => dispatch(signOut())}
      >
        Logout
      </Typography>
    );
  }

  return (
    <List sx={{ display: "flex" }}>
      {user ? signedInAdminLinks(() => user.roles.includes("Admin")) : null}
      {user
        ? signedInDubaiBillingLinks(() => user.roles.includes("DubaiBilling"))
        : null}
      {user
        ? signedInStrippingTeamLinks(() => user.roles.includes("Stripping"))
        : null}
      {user && (
        <Typography
          component={Button}
          size="medium"
          sx={navStyles}
          onClick={() => dispatch(signOut())}
        >
          Logout
        </Typography>
      )}
    </List>
  );
};

export default HeaderNavLink;
