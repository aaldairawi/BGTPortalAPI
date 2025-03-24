import { Avatar, ListItem } from "@mui/material";
import { useAppDispatch } from "../../app/store/configureStore";
import { onSelectInvoiceType } from "./cTypeFinalizedSlice";

interface Props {
  typeGroup: string;
  invoiceActivated: boolean;
}

const InvoiceType: React.FC<Props> = (props: Props) => {
  const { invoiceActivated, typeGroup } = props;
  const dispatch = useAppDispatch();

  return (
    <ListItem
      sx={{
        "&:hover": {
          bgcolor: "grey.800",
          cursor: "pointer",
        },
      }}
      onClick={() => dispatch(onSelectInvoiceType(typeGroup))}
    >
      <Avatar
        variant="circular"
        sx={{
          width: "40px",
          bgcolor: invoiceActivated ? "lightgreen" : "#f74f00",
          fontSize: "10px",
          color: invoiceActivated ? "black" : "white",
        }}
      >
        {typeGroup.includes("_") ? typeGroup.substring(0, 2) : typeGroup}
      </Avatar>
    </ListItem>
  );
};

export default InvoiceType;
