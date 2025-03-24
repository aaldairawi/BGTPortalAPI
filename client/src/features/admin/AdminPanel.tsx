import { Box, List, ListItem, Tooltip } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import Avatar from "@mui/material/Avatar";
import React from "react";
import { panelMenuStyles as adminPanelStyles } from "../../app/layout/panelMenuStyles";
import { AdminPanelActions } from "./adminActions";
import {
  IAdminPanelSlice,
  setActiveAdminPanelDisplay,
} from "./adminPanelSlice";
import { useAppDispatch } from "../../app/store/configureStore";

interface Props {
  data: IAdminPanelSlice[];
}

const AdminPanel: React.FC<Props> = (props: Props) => {
  const { data } = props;
  const dispatch = useAppDispatch();

  return (
    <Box
    sx={{
      borderRadius: "5px",
      position: "fixed",
      left: 40,
      top: 160,
      bgcolor: "transparent",
    }}
    >
      <List
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}
      >
        {data.map(({ text }) => {
          return (
            <ListItem
              sx={adminPanelStyles}
              key={text}
              onClick={() => dispatch(setActiveAdminPanelDisplay(text))}
            >
              <Tooltip title={text} arrow={true}>
                <Avatar
                  variant="circular"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {text === AdminPanelActions.USERS && <PersonIcon />}
                  {text === AdminPanelActions.ROLES && <SecurityIcon />}
                </Avatar>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default AdminPanel;
