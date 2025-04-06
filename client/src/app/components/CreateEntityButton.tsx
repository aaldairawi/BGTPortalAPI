import { Box, Button, Typography } from "@mui/material";

interface Props {
  text: string;
  onClick: () => void;
}

const CreateEntityButton: React.FC<Props> = (props: Props) => {
  const { text, onClick } = props;
  return (
    <Box
      component={Button}
      onClick={onClick}
      variant="contained"
      sx={{
        top: 100,
        pt: 1,
        position: "fixed",
        right: 10,
        width: "9rem",
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          "&:hover": { color: "black" },
        }}
        color="white"
      >
        {text}
      </Typography>
    </Box>
  );
};

export default CreateEntityButton;
