import { Avatar, Box, List, ListItem, Tooltip } from "@mui/material";
import {
  INavisApiPanelSlice,
  setActiveNavisApiPanelDisplay,
} from "./navisApiPanelSlice";
import React from "react";
import { useAppDispatch } from "../../app/store/configureStore";

import { panelMenuStyles as navisApiPanelStyles } from "../../app/layout/panelMenuStyles";
import StayCurrentLandscapeIcon from "@mui/icons-material/StayCurrentLandscape";
import IosShareIcon from "@mui/icons-material/IosShare";
import { NavisApiSliceActions } from "./navisApiPanelActions";

interface Props {
  data: INavisApiPanelSlice[];
}

const NavisApiPanel: React.FC<Props> = (props: Props) => {
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
      <List sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
        }}>
        {data.map(({ text }) => {
          return (
            <ListItem
              sx={navisApiPanelStyles}
              key={text}
              onClick={() => dispatch(setActiveNavisApiPanelDisplay(text))}
            >
              <Tooltip title={text} arrow={true}>
                <Avatar sx={{ p: 3 }}>
                  {text === NavisApiSliceActions.UNIT_STATUS && (
                    <StayCurrentLandscapeIcon />
                  )}

                  {text === NavisApiSliceActions.UNIT_LIFETIME && (
                    <IosShareIcon />
                  )}
                </Avatar>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default NavisApiPanel;
