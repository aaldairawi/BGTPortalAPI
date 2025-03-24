import { Box, List, ListItem, Tooltip, Avatar } from "@mui/material";

import {
  ISapApiPanelSlice,
  setActiveSapApiPanelDisplay,
} from "./sapPanelSlice";
import { panelMenuStyles as sapApiPanelStyles } from "../../app/layout/panelMenuStyles";
import { SapPanelActions } from "./sapActions";
import { useAppDispatch } from "../../app/store/configureStore";
import Person2Icon from "@mui/icons-material/Person2";
import DirectionsBoatFilledIcon from "@mui/icons-material/DirectionsBoatFilled";
interface Props {
  data: ISapApiPanelSlice[];
}
const SapPanel: React.FC<Props> = (props: Props) => {
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
              sx={sapApiPanelStyles}
              key={text}
              onClick={() => dispatch(setActiveSapApiPanelDisplay(text))}
            >
              <Tooltip title={text} arrow={true}>
                <Avatar
                  variant="circular"
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {text === SapPanelActions.C_TYPE_INVOICE && <Person2Icon />}
                  {text === SapPanelActions.S_TYPE_INVOICE && (
                    <DirectionsBoatFilledIcon />
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

export default SapPanel;
