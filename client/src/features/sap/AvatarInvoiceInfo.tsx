import { Avatar } from "@mui/material";

interface Props {
  avatarText: string;
}

const AvatarInvoiceInfo: React.FC<Props> = (props: Props) => {
  const { avatarText } = props;
  return (
    <Avatar
      sx={{
        width: 90,
        display: "flex",
        flexDirection: "column",
        height: 90,
        textAlign: "center",
        position: "absolute",
        left: 200,
        top: 150,
        color: "white",
        backgroundColor: "#ff5a09",
        fontSize: "12px",
      }}
      variant="circular"
    >
      {avatarText}
    </Avatar>
  );
};

export default AvatarInvoiceInfo;
