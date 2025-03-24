import { Box, Container, Divider, Typography } from "@mui/material";
import UnitCurrentStatus from "./UnitCurrentStatus";
import { useAppSelector } from "../../app/store/configureStore";
import NavisApiPanel from "./NavisApiPanel";
import { NavisApiSliceActions } from "./navisApiPanelActions";
import UnitLifeTime from "./UnitLifeTime";

const NavisApi = () => {
  const { items } = useAppSelector((state) => state.navisApiPanel);
  const activeDisplay = items.find(
    (obj) => obj.action.display === true && obj.text
  );

  const NavisAdminPanelDefault = (
    <>
      <NavisApiPanel data={items} />
      <Container sx={{ mt: 33, textAlign: "center" }}>
        <Typography variant="h3" color="white">
          Navis Container API
        </Typography>
      </Container>
    </>
  );
  if (!activeDisplay) return NavisAdminPanelDefault;
  return (
    <Box>
      <Box sx={{ mt: 1 }}>
        <Divider variant="fullWidth" />
        <NavisApiPanel data={items} />
        {activeDisplay.text === NavisApiSliceActions.UNIT_STATUS ? (
          <UnitCurrentStatus />
        ) : null}
        {activeDisplay.text === NavisApiSliceActions.UNIT_LIFETIME ? (
          <UnitLifeTime />
        ) : null}
      </Box>
    </Box>
  );
};

export default NavisApi;
