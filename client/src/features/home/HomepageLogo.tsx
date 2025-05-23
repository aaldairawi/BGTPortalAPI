import { Avatar, Container, Typography } from "@mui/material";

const HomePageLogo = () => {
  return (
    <Container sx={{ mt: 15 }}>
      <Avatar
        src="/images/container-cargo-freight-ship.jpg"
        variant="square"
        sx={{ width: "100%", height: "30rem" }}
      />
      <Container sx={{ textAlign: "center" }}>
        <Typography variant="h5" color="#393939">
          Please contact IT to have your access updated. Thank you.
        </Typography>
      </Container>
    </Container>
  );
};

export default HomePageLogo;
