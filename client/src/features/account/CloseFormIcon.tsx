import { Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  onHandleClick: () => void;
}
const CloseFormIcon: React.FC<Props> = (props: Props) => {
  const { onHandleClick } = props;
  return (
    <Box sx={{ ml: 66 }} component={Button} onClick={onHandleClick}>
      <CloseIcon sx={{ fontSize: "2.5rem", color: "orange" }} />
    </Box>
  );
};

export default CloseFormIcon;
